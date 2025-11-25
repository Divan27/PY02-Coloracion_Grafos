export default class Graph {
    constructor() {
        this.nodes = [];
        this.edges = [];
        this.colors = {};
    }

    addNode(x, y) {
        const id = this.nodes.length;
        this.nodes.push({ id, x, y });
        return id;
    }

    addEdge(a, b) {
        if (a !== b && !this.edges.find(e => (e.a === a && e.b === b) || (e.a === b && e.b === a))) {
            this.edges.push({ a, b });
        }
    }

    getNodes() {
        return this.nodes.map(n => n.id);
    }

    setColors(colors) {
        this.colors = colors;
    }

    findConflicts(colors) {
        const conflicts = [];
        this.edges.forEach(edge => {
            if (colors[edge.a] === colors[edge.b]) {
                conflicts.push(edge);
            }
        });
        return conflicts;
    }
}
