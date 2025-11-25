export default class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
    }

    addNode(x, y) {
        this.nodes.push({ x, y });
    }

    addEdge(a, b) {
        this.edges.push({ from: a, to: b });
    }
}
