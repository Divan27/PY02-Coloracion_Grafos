import React, { useEffect, useRef } from "react";
import GraphController from "../controllers/GraphController";

export default function GraphCanvasView() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    GraphController.setCanvas(canvas);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={1600}
      height={900}
      style={{
        background: "white",
        border: "1px solid #ccc",
        display: "block",
        margin: "10px auto",
      }}
    ></canvas>
  );
}
