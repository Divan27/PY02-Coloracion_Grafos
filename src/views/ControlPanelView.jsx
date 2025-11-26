// src/views/ControlPanelView.jsx
import React, { useState } from "react";

export default function ControlPanelView({
  maxNodes,
  currentNodes,
  onAddNode,
  onGenerateRandomGraph,
  onReset
}) {
  const [randomNodes, setRandomNodes] = useState(10);

  const handleGenerateClick = () => {
    let num = Number(randomNodes);
    if (Number.isNaN(num)) {
      window.alert("Ingrese un número válido de nodos.");
      return;
    }
    if (num < 1) {
      window.alert("La cantidad mínima de nodos es 1.");
      return;
    }
    if (num > maxNodes) {
      window.alert(`La cantidad máxima de nodos es ${maxNodes}.`);
      num = maxNodes;
    }
    onGenerateRandomGraph?.(num);
  };

  const handleAddNodeClick = () => {
    if (currentNodes >= maxNodes) {
      window.alert(`No se pueden agregar más de ${maxNodes} nodos.`);
      return;
    }
    onAddNode?.();  // ← aquí se agrega el nodo
  };

  const handleResetClick = () => {
    onReset?.();    // ← aquí se elimina el grafo
  };

  return (
    <div className="control-panel">
      <h2 className="control-panel__title">
        Panel de control
      </h2>

      {/* Contador de nodos */}
      <div className="control-panel__stats">
        <div className="control-panel__stats-main">
          <span className="control-panel__stats-label">
            Nodos
          </span>
          <span className="control-panel__stats-value">
            {currentNodes} / {maxNodes}
          </span>
        </div>
      </div>

      {/* Construcción manual */}
      <section className="control-panel__section">
        <h3 className="control-panel__section-title">
          Construcción manual
        </h3>
        <p className="control-panel__section-text">
          Puede añadir nodos y conectarlos con aristas para formar un grafo.
        </p>
        <button
          className="control-panel__button control-panel__button--primary"
          onClick={handleAddNodeClick}
        >
          Añadir Nodo
        </button>
      </section>

      {/* Grafo aleatorio */}
      <section className="control-panel__section control-panel__section--bordered">
        <h3 className="control-panel__section-title control-panel__section-title--green">
          Grafo aleatorio conectado
        </h3>

        <label className="control-panel__field">
          <span className="control-panel__field-label">
            Cantidad de nodos
          </span>
          <input
            type="number"
            min={1}
            max={maxNodes}
            value={randomNodes}
            onChange={(e) => setRandomNodes(e.target.value)}
            className="control-panel__input"
          />
        </label>

        <button
          className="control-panel__button control-panel__button--success"
          onClick={handleGenerateClick}
        >
          Generar grafo aleatorio
        </button>
      </section>

      {/* Reset */}
      <section className="control-panel__section control-panel__section--bordered">
        <h3 className="control-panel__section-title control-panel__section-title--danger">
          Reiniciar
        </h3>
        <button
          className="control-panel__button control-panel__button--danger"
          onClick={handleResetClick}
        >
          Reiniciar grafo
        </button>
      </section>
    </div>
  );
}
