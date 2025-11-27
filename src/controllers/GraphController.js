// src/controllers/GraphController.js
import Graph from "../models/Graph";
import LasVegas from "../algorithms/LasVegas";
import MonteCarlo from "../algorithms/MonteCarlo";

export default class GraphController {
  constructor() {
    this.graph = new Graph();
    this.listeners = new Set();

    // Para coloración
    this.coloringStats = null;
    this.conflictEdges = [];

    // Para ejecución dinámica (cualquier algoritmo)
    this.dynamicRun = null; // { algo, mode, iterations, speed, delay, running, timerId, startTime, algorithmLabel }
  }

  getSnapshot() {
    return {
      nodes: [...this.graph.nodes],
      edges: [...this.graph.edges],
      coloringStats: this.coloringStats,
      conflictEdges: [...this.conflictEdges],
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    listener(this.getSnapshot());
    return () => {
      this.listeners.delete(listener);
    };
  }

  notify() {
    const snapshot = this.getSnapshot();
    for (const listener of this.listeners) {
      listener(snapshot);
    }
  }

  // ==============================
  // Control dinámico
  // ==============================

  stopDynamicRun(clearStats = true) {
    if (this.dynamicRun && this.dynamicRun.timerId) {
      clearInterval(this.dynamicRun.timerId);
    }
    this.dynamicRun = null;

    if (clearStats) {
      this.coloringStats = null;
      this.conflictEdges = [];
      this.notify();
    }
  }

  pauseDynamicRun() {
    const run = this.dynamicRun;
    if (!run || !run.running) return;

    run.running = false;
    if (run.timerId) {
      clearInterval(run.timerId);
      run.timerId = null;
    }

    if (this.coloringStats) {
      this.coloringStats.isRunning = false;
      this.coloringStats.isPaused = true;
      this.notify();
    }
  }

  _startDynamicLoop() {
    const run = this.dynamicRun;
    if (!run) return;

    const { algo, delay, mode, iterations, speed, startTime, algorithmLabel } =
      run;

    if (run.timerId) {
      clearInterval(run.timerId);
      run.timerId = null;
    }

    const tick = () => {
      const current = this.dynamicRun;
      if (!current || !current.running) return;

      const stepResult = algo.step();
      const { colors, conflictEdges, stats } = stepResult;
      const now = performance.now();

      this.applyColoring(colors);
      this.conflictEdges = conflictEdges || [];

      this.coloringStats = {
        algorithm: algorithmLabel,
        dynamic: true,
        isRunning: current.running,
        isPaused: !current.running,
        attempts: stats.attempts,
        conflicts: stats.conflicts,
        meanConflicts: stats.meanConflicts,
        successRate: stats.successRate,
        timeMs: now - startTime,
        progress: stats.progress,
        mode,
        iterations,
        speed,
      };

      this.notify();

      if (stepResult.done) {
        this.stopDynamicRun(false);
        if (this.coloringStats) {
          this.coloringStats.isRunning = false;
          this.coloringStats.isPaused = false;
          this.notify();
        }
      }
    };

    run.timerId = setInterval(tick, delay);
    tick();
  }

  resumeDynamicRun() {
    const run = this.dynamicRun;
    if (!run || run.running) return;

    run.running = true;
    this._startDynamicLoop();
  }

  // ==============================
  // Operaciones sobre el grafo
  // ==============================

  createManualNode(x, y) {
    this.stopDynamicRun(true);
    this.graph.addNode(x, y);
    this.notify();
  }

  connectNodes(sourceId, targetId) {
    this.stopDynamicRun(true);
    this.graph.addEdge(sourceId, targetId);
    this.notify();
  }

  generateRandomGraph(numNodes) {
    this.stopDynamicRun(true);
    this.graph = Graph.createRandomConnectedGraph(numNodes);
    this.notify();
  }

  resetGraph() {
    this.stopDynamicRun(true);
    this.graph.reset();
    this.notify();
  }

  moveNode(nodeId, x, y) {
    this.graph.updateNodePosition(nodeId, x, y);
    this.notify();
  }

  deleteEdge(sourceId, targetId) {
    this.stopDynamicRun(true);
    this.graph.removeEdgeBetween(sourceId, targetId);
    this.notify();
  }

  // ==============================
  // Coloración
  // ==============================

  applyColoring(colorMap) {
    this.graph.nodes.forEach((node) => {
      node.color = colorMap ? colorMap[node.id] : null;
    });
  }

  // Coloración instantánea Las Vegas (opcional, por si la quieres usar en otro flujo)
  colorGraphLasVegasInstant() {
    this.stopDynamicRun(true);

    const mode = "solucion_valida";
    const maxAttempts = 20000;

    const algo = new LasVegas(this.graph, { maxAttempts });

    const start = performance.now();
    const result = algo.run();
    const end = performance.now();

    this.applyColoring(result.colors);
    this.conflictEdges = result.conflictEdges || [];

    this.coloringStats = {
      algorithm: "Las Vegas",
      dynamic: false,
      isRunning: false,
      isPaused: false,
      attempts: result.stats.attempts,
      conflicts: result.stats.conflicts,
      meanConflicts: result.stats.meanConflicts,
      successRate: result.stats.successRate,
      timeMs: end - start,
      mode,
      iterations: maxAttempts,
    };

    this.notify();
  }

  /**
   * Coloración DINÁMICA (Las Vegas o Monte Carlo)
   *
   * options:
   *  - algorithm: "lasvegas-dynamic" | "montecarlo-dynamic"
   *  - iterations: (solo MC) número de muestras
   *  - speed: "fast" | "slow"
   */
  startDynamicColoring(options) {
    this.stopDynamicRun(true);

    const speed = options.speed || "fast";
    const delay = speed === "slow" ? 200 : 30;
    let mode;
    let iterations;
    let algo;
    let algorithmLabel;

    if (options.algorithm === "montecarlo-dynamic") {
      // Monte Carlo = iteraciones limitadas
      mode = "iteraciones_limitadas";
      iterations = options.iterations || 1000;
      algo = new MonteCarlo(this.graph, { iterations, mode });
      algorithmLabel = "Monte Carlo";
    } else {
      // Las Vegas = solución válida (sin configurar iteraciones por el usuario)
      mode = "solucion_valida";
      const maxAttempts = 20000; // constante interna
      iterations = maxAttempts;  // para la barra de progreso
      algo = new LasVegas(this.graph, { maxAttempts });
      algorithmLabel = "Las Vegas";
    }

    const startTime = performance.now();

    this.dynamicRun = {
      algo,
      mode,
      iterations,
      speed,
      delay,
      running: true,
      timerId: null,
      startTime,
      algorithmLabel,
    };

    this._startDynamicLoop();
  }
}
