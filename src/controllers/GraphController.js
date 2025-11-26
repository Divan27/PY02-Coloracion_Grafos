// src/controllers/GraphController.js
import Graph from "../models/Graph";

export default class GraphController {
  constructor() {
    this.graph = new Graph();
    this.listeners = new Set();
  }

  // Devuelve un snapshot inmutable para React
  getSnapshot() {
    return {
      nodes: [...this.graph.nodes],
      edges: [...this.graph.edges],
    };
  }

  subscribe(listener) {
    this.listeners.add(listener);
    // Enviar estado inicial como snapshot
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

  createManualNode(x, y) {
    this.graph.addNode(x, y);
    this.notify();
  }

  connectNodes(sourceId, targetId) {
    this.graph.addEdge(sourceId, targetId);
    this.notify();
  }

  generateRandomGraph(numNodes) {
    this.graph = Graph.createRandomConnectedGraph(numNodes, {
      maxNodes: 120,
    });
    this.notify();
  }

  resetGraph() {
    this.graph.reset();
    this.notify();
  }

  moveNode(nodeId, x, y) {
    this.graph.updateNodePosition(nodeId, x, y);
    this.notify();
  }
}
