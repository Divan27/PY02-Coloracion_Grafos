import React, { useState } from "react";
import GraphController from "../controllers/GraphController";

export default function ControlPanelView() {
  const [kColors, setKColors] = useState(3);
  const [algorithm, setAlgorithm] = useState("lasvegas");

  return (
    <div>
      <h2>Panel de Control</h2>

      <div>
        <label>Número de colores (k): </label>
        <input
          type="number"
          min="3"
          value={kColors}
          onChange={(e) => setKColors(Number(e.target.value))}
        />
      </div>

      <div style={{ marginTop: "15px" }}>
        <h3>Algoritmo</h3>

        <select
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="lasvegas">Las Vegas</option>
          <option value="montecarlo">Monte Carlo</option>
        </select>
      </div>

      <button
        style={{ marginTop: "20px", padding: "10px", width: "100%" }}
        onClick={() => GraphController.addNode()}
      >
        Crear nodo
      </button>

      <button
        style={{ marginTop: "10px", padding: "10px", width: "100%" }}
        onClick={() => GraphController.colorGraph(algorithm, kColors)}
      >
        Colorear Grafo
      </button>
    </div>
  );
}
