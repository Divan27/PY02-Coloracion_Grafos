// src/views/GraphCanvasView.jsx
import React, { useState, useRef } from "react";

const COLOR_MAP = {
  blue: "#38bdf8",
  red: "#ef4444",
  green: "#22c55e",
};

export default function GraphCanvasView({
  graph,
  onConnectNodes,
  onMoveNode,
  onDeleteEdge,
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const svgRef = useRef(null);

  // Construir set de aristas en conflicto
  const conflictSet = new Set();
  (graph.conflictEdges || []).forEach((e) => {
    const key1 = `${e.sourceId}-${e.targetId}`;
    const key2 = `${e.targetId}-${e.sourceId}`;
    conflictSet.add(key1);
    conflictSet.add(key2);
  });

  const svgPointFromEvent = (evt) => {
    const svg = svgRef.current;
    if (!svg) return { xNorm: 0, yNorm: 0 };

    const pt = svg.createSVGPoint();
    pt.x = evt.clientX;
    pt.y = evt.clientY;

    const svgPoint = pt.matrixTransform(svg.getScreenCTM().inverse());

    let xNorm = svgPoint.x / 100;
    let yNorm = svgPoint.y / 100;

    xNorm = Math.min(Math.max(xNorm, 0), 1);
    yNorm = Math.min(Math.max(yNorm, 0), 1);

    return { xNorm, yNorm };
  };

  const handleNodeClick = (evt, nodeId) => {
    evt.stopPropagation();

    if (selectedNodeId === null) {
      setSelectedNodeId(nodeId);
    } else if (selectedNodeId === nodeId) {
      setSelectedNodeId(null);
    } else {
      onConnectNodes?.(selectedNodeId, nodeId);
      setSelectedNodeId(null);
    }
  };

  const handleNodeMouseDown = (evt, nodeId) => {
    evt.stopPropagation();
    setDraggingNodeId(nodeId);
  };

  const handleSvgMouseMove = (evt) => {
    if (draggingNodeId === null) return;
    const { xNorm, yNorm } = svgPointFromEvent(evt);
    onMoveNode?.(draggingNodeId, xNorm, yNorm);
  };

  const handleSvgMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleSvgMouseLeave = () => {
    setDraggingNodeId(null);
  };

  const handleSvgBackgroundClick = () => {
    setSelectedNodeId(null);
  };

  const handleEdgeClick = (evt, edge) => {
    evt.stopPropagation();
    onDeleteEdge?.(edge.sourceId, edge.targetId);
  };

  return (
    <div className="graph-canvas">
      <div className="graph-canvas__stars graph-canvas__stars--layer1" />
      <div className="graph-canvas__stars graph-canvas__stars--layer2" />

      <svg
        ref={svgRef}
        className="graph-canvas__svg"
        viewBox="0 0 100 100"
        onClick={handleSvgBackgroundClick}
        onMouseMove={handleSvgMouseMove}
        onMouseUp={handleSvgMouseUp}
        onMouseLeave={handleSvgMouseLeave}
      >
        {/* Aristas (rojas si conflicto) */}
        {graph.edges.map((edge, idx) => {
          const source = graph.nodes.find((n) => n.id === edge.sourceId);
          const target = graph.nodes.find((n) => n.id === edge.targetId);
          if (!source || !target) return null;

          const key = `${edge.sourceId}-${edge.targetId}`;
          const isConflict = conflictSet.has(key);

          return (
            <line
              key={idx}
              x1={source.x * 100}
              y1={source.y * 100}
              x2={target.x * 100}
              y2={target.y * 100}
              stroke={
                isConflict
                  ? "rgba(248, 113, 113, 0.95)" // rojo intenso
                  : "rgba(148, 163, 184, 0.8)"
              }
              strokeWidth={isConflict ? 0.5 : 0.25}
              onClick={(evt) => handleEdgeClick(evt, edge)}
            />
          );
        })}

        {/* Nodos coloreados */}
        {graph.nodes.map((node) => {
          const baseColor = node.color
            ? COLOR_MAP[node.color] || "#e5e7eb"
            : "#e5e7eb";

          const fillColor =
            selectedNodeId === node.id ? "#facc15" : baseColor;

          return (
            <g
              key={node.id}
              onClick={(evt) => handleNodeClick(evt, node.id)}
              onMouseDown={(evt) => handleNodeMouseDown(evt, node.id)}
            >
              <circle
                cx={node.x * 100}
                cy={node.y * 100}
                r={selectedNodeId === node.id ? 1.8 : 1.4}
                fill={fillColor}
                stroke="#020617"
                strokeWidth="0.25"
              />
              <text
                x={node.x * 100}
                y={node.y * 100 - 2.4}
                fontSize="1.8"
                textAnchor="middle"
                fill="#e5e7eb"
              >
                {node.id}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
