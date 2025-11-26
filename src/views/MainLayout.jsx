// src/views/MainLayout.jsx
import React, { useEffect, useState } from "react";
import ControlPanelView from "./ControlPanelView";
import GraphCanvasView from "./GraphCanvasView";
import GraphController from "../controllers/GraphController";

// Instancia única del controlador
const graphController = new GraphController();

export default function MainLayout() {
  // ⬇️ usar snapshot inicial, NO la instancia de Graph
  const [graphState, setGraphState] = useState(
    graphController.getSnapshot()
  );

  useEffect(() => {
    const unsubscribe = graphController.subscribe(setGraphState);
    return unsubscribe;
  }, []);

  // Botón "Añadir Nodo"
  const handleAddNode = () => {
    const x = Math.random();
    const y = Math.random();
    graphController.createManualNode(x, y);
  };

  // Botón "Generar grafo aleatorio"
  const handleGenerateRandomGraph = (n) => {
    graphController.generateRandomGraph(n);
  };

  // Botón "Reiniciar grafo"
  const handleReset = () => {
    graphController.resetGraph();
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Coloracion de Grafos</h1>
        <p className="app-subtitle">
          Creación y edición de grafos manuales y aleatorios.
        </p>
      </header>

      <main className="graph-layout">
        {/* PANEL IZQUIERDO */}
        <aside className="graph-layout__sidebar">
          <ControlPanelView
            maxNodes={120}
            currentNodes={graphState.nodes.length}
            onAddNode={handleAddNode}
            onGenerateRandomGraph={handleGenerateRandomGraph}
            onReset={handleReset}
          />
        </aside>

        {/* LIENZO */}
        <section className="graph-layout__canvas">
          <GraphCanvasView
            graph={graphState} // ⬅️ ahora es {nodes, edges}
            onConnectNodes={(sourceId, targetId) =>
              graphController.connectNodes(sourceId, targetId)
            }
            onMoveNode={(nodeId, x, y) =>
              graphController.moveNode(nodeId, x, y)
            }
          />
        </section>
      </main>
    </div>
  );
}
