import React, { useRef, useEffect } from "react";

const GraphCanvasView = ({ graphs }) => {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        // Limpiar
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Dibujar cada grafo
        graphs.forEach((graph, index) => {
            drawGraph(ctx, graph, index);
        });
    }, [graphs]);

    const drawGraph = (ctx, graph, index) => {
        // Offset para separar grafos
        const offsetX = (index % 10) * 150;
        const offsetY = Math.floor(index / 10) * 150;

        // Dibujar nodos
        graph.nodes.forEach(node => {
            ctx.beginPath();
            ctx.arc(node.x + offsetX, node.y + offsetY, 10, 0, Math.PI * 2);
            ctx.fillStyle = "blue";
            ctx.fill();
        });

        // Dibujar aristas
        graph.edges.forEach(edge => {
            const a = graph.nodes[edge.from];
            const b = graph.nodes[edge.to];

            ctx.beginPath();
            ctx.moveTo(a.x + offsetX, a.y + offsetY);
            ctx.lineTo(b.x + offsetX, b.y + offsetY);
            ctx.strokeStyle = "black";
            ctx.stroke();
        });
    };

    return (
        <canvas
            ref={canvasRef}
            width={1500}
            height={900}
            style={{ border: "1px solid black" }}
        />
    );
};

export default GraphCanvasView;
