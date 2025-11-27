// src/algorithms/LasVegas.js

// Colores permitidos para la coloración (azul, rojo, verde)
const AVAILABLE_COLORS = ["blue", "red", "green"];

export default class LasVegas {
  /**
   * @param {Graph} graph
   * @param {Object} options
   *  - maxAttempts: número máximo de intentos
   */
  constructor(graph, options = {}) {
    this.nodes = graph.nodes;
    this.edges = graph.edges;
    this.maxAttempts = options.maxAttempts ?? 20000;

    // Estado interno para ejecución dinámica
    this.attempts = 0;
    this.totalConflicts = 0;
    this.successCount = 0;

    this.bestColors = null;
    this.bestEval = { conflicts: Infinity, conflictEdges: [] };

    this.finished = false;
  }

  // Baraja nodos (Fisher–Yates)
  shuffleNodes(nodes) {
    const arr = [...nodes];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Evalúa una coloración: cuenta conflictos y devuelve aristas en conflicto
  evaluateColoring(colorMap) {
    let conflicts = 0;
    const conflictEdges = [];

    for (const edge of this.edges) {
      const c1 = colorMap[edge.sourceId];
      const c2 = colorMap[edge.targetId];
      if (c1 && c2 && c1 === c2) {
        conflicts++;
        conflictEdges.push({
          sourceId: edge.sourceId,
          targetId: edge.targetId,
        });
      }
    }

    return { conflicts, conflictEdges };
  }

  /**
   * Un intento Las Vegas:
   * - Ordena los nodos aleatoriamente.
   * - Para cada nodo, elige aleatoriamente un color que no choque
   *   con los vecinos ya coloreados.
   * - Si un nodo no tiene color válido disponible, el intento falla.
   */
  randomGreedyColoring() {
    const colors = {};
    const orderedNodes = this.shuffleNodes(this.nodes);

    for (const node of orderedNodes) {
      // Colores de vecinos ya coloreados
      const neighborColors = new Set();

      for (const edge of this.edges) {
        let neighborId = null;

        if (edge.sourceId === node.id) neighborId = edge.targetId;
        else if (edge.targetId === node.id) neighborId = edge.sourceId;

        if (neighborId != null && colors[neighborId]) {
          neighborColors.add(colors[neighborId]);
        }
      }

      // Colores disponibles (no usados por vecinos)
      const available = AVAILABLE_COLORS.filter(
        (c) => !neighborColors.has(c)
      );

      if (available.length === 0) {
        // No hay color válido para este nodo → intento fallido
        return {
          colors,
          success: false,
          conflicts: 1,
          conflictEdges: [],
        };
      }

      const color =
        available[Math.floor(Math.random() * available.length)];
      colors[node.id] = color;
    }

    // Si llegamos aquí, todos los nodos tienen color
    const evalResult = this.evaluateColoring(colors);
    return {
      colors,
      success: evalResult.conflicts === 0,
      conflicts: evalResult.conflicts,
      conflictEdges: evalResult.conflictEdges,
    };
  }

  _currentStats() {
    const attempts = this.attempts;
    const meanConflicts =
      attempts > 0 ? this.totalConflicts / attempts : 0;
    const successRate =
      attempts > 0 ? this.successCount / attempts : 0;

    return {
      attempts,
      conflicts:
        this.bestEval.conflicts === Infinity
          ? 0
          : this.bestEval.conflicts,
      meanConflicts,
      successRate,
      progress:
        this.maxAttempts > 0
          ? Math.min(attempts / this.maxAttempts, 1)
          : 1,
    };
  }

  /**
   * Ejecuta UN paso (un intento) de Las Vegas.
   *
   * Devuelve:
   *  - done: si ya terminó o no
   *  - colors: mejor coloración encontrada hasta ahora
   *  - conflictEdges: aristas en conflicto de la mejor coloración
   *  - stats: métricas acumuladas
   */
  step() {
    if (this.finished || this.attempts >= this.maxAttempts) {
      this.finished = true;
      const stats = this._currentStats();
      return {
        done: true,
        colors: this.bestColors || {},
        conflictEdges: this.bestEval.conflictEdges,
        stats,
      };
    }

    this.attempts++;

    const attempt = this.randomGreedyColoring();

    this.totalConflicts += attempt.conflicts;
    if (attempt.success) {
      this.successCount++;
    }

    // Guardar mejor solución parcial
    if (attempt.conflicts < this.bestEval.conflicts) {
      this.bestEval = {
        conflicts: attempt.conflicts,
        conflictEdges: attempt.conflictEdges,
      };
      this.bestColors = attempt.colors;
    }

    if (attempt.success && attempt.conflicts === 0) {
      this.finished = true;
    }

    const stats = this._currentStats();

    return {
      done: this.finished || this.attempts >= this.maxAttempts,
      colors: this.bestColors || attempt.colors || {},
      conflictEdges: this.bestEval.conflictEdges,
      stats,
    };
  }

  /**
   * Ejecución completa (no dinámica).
   * Repite step() hasta terminar.
   */
  run() {
    let lastStep = null;
    while (true) {
      lastStep = this.step();
      if (lastStep.done) break;
    }

    return {
      colors: lastStep.colors,
      conflictEdges: lastStep.conflictEdges,
      stats: {
        attempts: lastStep.stats.attempts,
        conflicts: lastStep.stats.conflicts,
        meanConflicts: lastStep.stats.meanConflicts,
        successRate: lastStep.stats.successRate,
      },
    };
  }
}
