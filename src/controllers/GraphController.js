import Graph from "../models/Graph";

export function createGraph() {
    const g = new Graph();

    // Crear un grafo simple de ejemplo
    for (let i = 0; i < 5; i++) {
        g.addNode(Math.random() * 100, Math.random() * 100);
        if (i > 0) g.addEdge(i - 1, i);
    }

    return g;
}
