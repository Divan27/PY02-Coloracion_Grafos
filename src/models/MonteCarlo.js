export function runMonteCarlo(graphs) {
    // Simulación aleatoria
    graphs.forEach(g => {
        g.nodes.forEach(n => {
            n.x += Math.random() * 10 - 5;
            n.y += Math.random() * 10 - 5;
        });
    });

    return graphs;
}
