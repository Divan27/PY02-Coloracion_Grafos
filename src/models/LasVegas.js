export function runLasVegas(graphs) {
    // Algoritmo determinista con aleatoriedad controlada
    graphs.forEach(g => {
        g.nodes.forEach(n => {
            if (Math.random() > 0.5) {
                n.x += 20;
            }
        });
    });

    return graphs;
}
