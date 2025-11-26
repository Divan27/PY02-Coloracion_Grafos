// src/models/Graph.js
import Node from "./Node";
import Edge from "./Edge";

export default class Graph {
  constructor() {
    /** @type {Node[]} */
    this.nodes = [];
    /** @type {Edge[]} */
    this.edges = [];
  }

  addNode(x, y, data = {}) {
    if (this.nodes.length >= 120) {
      throw new Error("Se alcanzó el máximo de 120 nodos permitidos.");
    }

    const nextId =
      this.nodes.length > 0
        ? this.nodes[this.nodes.length - 1].id + 1
        : 1;

    const node = new Node(nextId, x, y, data);
    this.nodes.push(node);
    return node;
  }

  addEdge(sourceId, targetId, weight = 1) {
    if (sourceId === targetId) return null;

    const exists = this.edges.some(
      (e) =>
        (e.sourceId === sourceId && e.targetId === targetId) ||
        (e.sourceId === targetId && e.targetId === sourceId)
    );
    if (exists) return null;

    const edge = new Edge(sourceId, targetId, weight);
    this.edges.push(edge);
    return edge;
  }

  reset() {
    this.nodes = [];
    this.edges = [];
  }

  // ✅ nuevo: actualizar posición de un nodo
  updateNodePosition(nodeId, x, y) {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    node.x = x;
    node.y = y;
  }

  static createRandomConnectedGraph(numNodes, options = {}) {
    const maxNodes = options.maxNodes ?? 120;
    const extraEdges = options.extraEdges ?? Math.floor(numNodes / 2);

    if (numNodes < 1 || numNodes > maxNodes) {
      throw new Error(
        `El número de nodos debe estar entre 1 y ${maxNodes}.`
      );
    }

    const graph = new Graph();

    for (let i = 0; i < numNodes; i++) {
      const x = Math.random();
      const y = Math.random();
      graph.addNode(x, y);
    }

    for (let i = 1; i < graph.nodes.length; i++) {
      const current = graph.nodes[i];
      const randomPrev =
        graph.nodes[Math.floor(Math.random() * i)];
      graph.addEdge(current.id, randomPrev.id);
    }

    let added = 0;
    let tries = 0;
    while (
      added < extraEdges &&
      tries < numNodes * numNodes
    ) {
      const n1 =
        graph.nodes[Math.floor(Math.random() * graph.nodes.length)];
      const n2 =
        graph.nodes[Math.floor(Math.random() * graph.nodes.length)];

      if (n1.id !== n2.id) {
        const before = graph.edges.length;
        graph.addEdge(n1.id, n2.id);
        if (graph.edges.length > before) {
          added++;
        }
      }
      tries++;
    }

    return graph;
  }
}
