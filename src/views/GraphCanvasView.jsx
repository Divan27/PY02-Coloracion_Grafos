// src/views/GraphCanvasView.jsx
import React, { useState, useRef } from "react";

export default function GraphCanvasView({
  graph,
  onConnectNodes,
  onMoveNode
}) {
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const svgRef = useRef(null);

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

    // Conectar nodos con clics consecutivos
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
        {/* Aristas */}
        {graph.edges.map((edge, idx) => {
          const source = graph.nodes.find((n) => n.id === edge.sourceId);
          const target = graph.nodes.find((n) => n.id === edge.targetId);
          if (!source || !target) return null;

          return (
            <line
              key={idx}
              x1={source.x * 100}
              y1={source.y * 100}
              x2={target.x * 100}
              y2={target.y * 100}
              stroke="rgba(148, 163, 184, 0.7)"
              strokeWidth="0.4"
            />
          );
        })}

        {/* Nodos */}
        {graph.nodes.map((node) => (
          <g
            key={node.id}
            onClick={(evt) => handleNodeClick(evt, node.id)}
            onMouseDown={(evt) => handleNodeMouseDown(evt, node.id)}
          >
            <circle
              cx={node.x * 100}
              cy={node.y * 100}
              r={selectedNodeId === node.id ? 2.3 : 1.9}
              fill={selectedNodeId === node.id ? "#38bdf8" : "#e5e7eb"}
              stroke="#020617"
              strokeWidth="0.3"
            />
            <text
              x={node.x * 100}
              y={node.y * 100 - 2.8}
              fontSize="2.2"
              textAnchor="middle"
              fill="#e5e7eb"
            >
              {node.id}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
