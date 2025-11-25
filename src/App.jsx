import React, { useState } from "react";
import MainLayout from "./views/MainLayout";
import { createGraph } from "./controllers/GraphController";
import { runMonteCarlo } from "./models/MonteCarlo";
import { runLasVegas } from "./models/LasVegas";

function App() {
    const [graphs, setGraphs] = useState([]);

    const handleCreateGraph = () => {
        if (graphs.length >= 100) return alert("Máximo 100 grafos");
        setGraphs([...graphs, createGraph()]);
    };

    const handleMonteCarlo = () => {
        setGraphs([...runMonteCarlo(graphs)]);
    };

    const handleLasVegas = () => {
        setGraphs([...runLasVegas(graphs)]);
    };

    return (
        <MainLayout
            graphs={graphs}
            onCreateGraph={handleCreateGraph}
            onRunMonteCarlo={handleMonteCarlo}
            onRunLasVegas={handleLasVegas}
        />
    );
}

export default App;
