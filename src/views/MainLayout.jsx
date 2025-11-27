// src/views/MainLayout.jsx
import React, { useEffect, useState } from "react";
import ControlPanelView from "./ControlPanelView";
import GraphCanvasView from "./GraphCanvasView";
import GraphController from "../controllers/GraphController";

const graphController = new GraphController();

export default function MainLayout() {
  const [graphState, setGraphState] = useState(
    graphController.getSnapshot()
  );

  useEffect(() => {
    const unsubscribe = graphController.subscribe(setGraphState);
    return unsubscribe;
  }, []);

  const handleAddNode = () => {
    const x = Math.random();
    const y = Math.random();
    graphController.createManualNode(x, y);
  };

  const handleGenerateRandomGraph = (n) => {
    graphController.generateRandomGraph(n);
  };

  const handleReset = () => {
    graphController.resetGraph();
  };

  const handleColorGraph = (options) => {
    if (
      options.algorithm === "lasvegas-dynamic" ||
      options.algorithm === "montecarlo-dynamic"
    ) {
      graphController.startDynamicColoring(options);
    }
  };

  const handlePauseDynamic = () => {
    graphController.pauseDynamicRun();
  };

  const handleResumeDynamic = () => {
    graphController.resumeDynamicRun();
  };

  return (
    <div className="app-root">
      <header className="app-header">
        <h1 className="app-title">Coloracion de Grafos</h1>
        <p className="app-subtitle">
          Creación, manipulación y coloración probabilística de grafos.
        </p>
      </header>

      <main className="graph-layout">
        <aside className="graph-layout__sidebar">
          <ControlPanelView
            maxNodes={150}
            currentNodes={graphState.nodes.length}
            onAddNode={handleAddNode}
            onGenerateRandomGraph={handleGenerateRandomGraph}
            onReset={handleReset}
            onColorGraph={handleColorGraph}
            coloringStats={graphState.coloringStats}
            onPauseDynamic={handlePauseDynamic}
            onResumeDynamic={handleResumeDynamic}
          />
        </aside>

        <section className="graph-layout__canvas">
          <GraphCanvasView
            graph={graphState}
            onConnectNodes={(sourceId, targetId) =>
              graphController.connectNodes(sourceId, targetId)
            }
            onMoveNode={(nodeId, x, y) =>
              graphController.moveNode(nodeId, x, y)
            }
            onDeleteEdge={(sourceId, targetId) =>
              graphController.deleteEdge(sourceId, targetId)
            }
          />
        </section>
      </main>
    </div>
  );
}
