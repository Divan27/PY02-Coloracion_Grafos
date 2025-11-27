// src/models/Graph.js
import Node from "./Node";
import Edge from "./Edge";

// Nuevos límites
const MAX_NODES = 150;
const MIN_RANDOM_NODES = 60;

export default class Graph {
  constructor() {
    /** @type {Node[]} */
    this.nodes = [];
    /** @type {Edge[]} */
    this.edges = [];
  }

  addNode(x, y, data = {}) {
    if (this.nodes.length >= MAX_NODES) {
      throw new Error(`Se alcanzó el máximo de ${MAX_NODES} nodos permitidos.`);
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

    // Evitar aristas duplicadas (no dirigido)
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

  updateNodePosition(nodeId, x, y) {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (!node) return;
    node.x = x;
    node.y = y;
  }

  // 👇 Nuevo: eliminar arista entre dos nodos (no dirigida)
  removeEdgeBetween(sourceId, targetId) {
    this.edges = this.edges.filter(
      (e) =>
        !(
          (e.sourceId === sourceId && e.targetId === targetId) ||
          (e.sourceId === targetId && e.targetId === sourceId)
        )
    );
  }

  /**
   * Crea un grafo aleatorio conectado.
   * @param {number} numNodes
   */
  static createRandomConnectedGraph(numNodes, options = {}) {
    const maxNodes = MAX_NODES;
    const minNodes = MIN_RANDOM_NODES;

    if (numNodes < minNodes || numNodes > maxNodes) {
      throw new Error(
        `El número de nodos para el grafo aleatorio debe estar entre ${minNodes} y ${maxNodes}.`
      );
    }

    const graph = new Graph();

    // 1) Crear nodos con posiciones aleatorias normalizadas (0-1)
    for (let i = 0; i < numNodes; i++) {
      const x = Math.random();
      const y = Math.random();
      graph.addNode(x, y);
    }

    // 2) Crear un "árbol generador" aleatorio para garantizar conectividad
    for (let i = 1; i < graph.nodes.length; i++) {
      const current = graph.nodes[i];
      const randomPrev =
        graph.nodes[Math.floor(Math.random() * i)];
      graph.addEdge(current.id, randomPrev.id);
    }

    // 3) Agregar algunas aristas extra aleatorias
    const extraEdges = Math.floor(numNodes / 2);
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
