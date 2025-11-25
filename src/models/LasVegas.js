export default class LasVegas {
    constructor(graph, k) {
        this.graph = graph;
        this.k = k;
    }

    run() {
        const nodes = this.graph.getNodes();
        let colors = {};
        let valid = false;

        while (!valid) {
            nodes.forEach(id => {
                colors[id] = Math.floor(Math.random() * this.k);
            });

            const conflicts = this.graph.findConflicts(colors);

            if (conflicts.length === 0) valid = true;
        }

        return { colors, valid: true };
    }
}
