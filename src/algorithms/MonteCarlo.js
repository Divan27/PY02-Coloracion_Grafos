// src/algorithms/MonteCarlo.js

// Colores permitidos para la coloración (azul, rojo, verde)
const AVAILABLE_COLORS = ["blue", "red", "green"];

export default class MonteCarlo {
  /**
   * @param {Graph} graph
   * @param {Object} options
   *  - iterations: número de simulaciones (muestras)
   *  - mode: "iteraciones_limitadas" | "solucion_valida"
   *  - acceptTieProbability: probabilidad de aceptar soluciones empatadas
   */
  constructor(graph, options = {}) {
    this.nodes = graph.nodes;
    this.edges = graph.edges;
    this.iterations = options.iterations ?? 1000;
    this.mode = options.mode ?? "iteraciones_limitadas";
    this.acceptTieProbability = options.acceptTieProbability ?? 0.3;

    // Estado interno para ejecución paso a paso
    this.attempts = 0;
    this.successCount = 0;
    this.totalConflicts = 0;

    this.bestColors = null;
    this.bestEval = { conflicts: Infinity, conflictEdges: [] };

    this.finished = false;
  }

  // Genera una coloración aleatoria (muestra)
  randomColoring() {
    const colors = {};
    for (const node of this.nodes) {
      const color =
        AVAILABLE_COLORS[
          Math.floor(Math.random() * AVAILABLE_COLORS.length)
        ];
      colors[node.id] = color;
    }
    return colors;
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
   * Ejecuta UNA iteración de Monte Carlo.
   * Devuelve un objeto con:
   *  - done: si ya terminó o no
   *  - colors: mejor coloración encontrada hasta ahora
   *  - conflictEdges: aristas en conflicto de la mejor coloración
   *  - stats: métricas acumuladas
   */
  step() {
    if (this.finished) {
      const stats = this._currentStats();
      return {
        done: true,
        colors: this.bestColors || {},
        conflictEdges: this.bestEval.conflictEdges,
        stats,
      };
    }

    if (this.attempts >= this.iterations) {
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

    // 2) Generar muestra aleatoria
    const colors = this.randomColoring();

    // 3) Evaluar muestra
    const evalResult = this.evaluateColoring(colors);
    const { conflicts, conflictEdges } = evalResult;

    this.totalConflicts += conflicts;
    if (conflicts === 0) {
      this.successCount++;
    }

    // Actualizar mejor solución
    if (
      conflicts < this.bestEval.conflicts ||
      (conflicts === this.bestEval.conflicts &&
        Math.random() < this.acceptTieProbability)
    ) {
      this.bestEval = { conflicts, conflictEdges };
      this.bestColors = colors;
    }

    // En modo "solución válida" podemos detenernos si ya no hay conflictos
    if (this.mode === "solucion_valida" && conflicts === 0) {
      this.finished = true;
    }

    const stats = this._currentStats();

    return {
      done:
        this.finished ||
        (this.mode === "iteraciones_limitadas" &&
          this.attempts >= this.iterations),
      colors: this.bestColors || {},
      conflictEdges: this.bestEval.conflictEdges,
      stats,
    };
  }

  // Ejecución completa (no dinámica) - por si quieres usarlo en otro contexto
  run() {
    let result;
    while (true) {
      result = this.step();
      if (result.done) break;
    }
    return {
      colors: result.colors,
      conflictEdges: result.conflictEdges,
      stats: {
        attempts: result.stats.attempts,
        conflicts: result.stats.conflicts,
        meanConflicts: result.stats.meanConflicts,
        successRate: result.stats.successRate,
      },
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
        this.iterations > 0
          ? Math.min(attempts / this.iterations, 1)
          : 1,
    };
  }
}
