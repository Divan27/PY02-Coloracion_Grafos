// src/views/ControlPanelView.jsx
import React, { useState } from "react";

export default function ControlPanelView({
  maxNodes,
  currentNodes,
  onAddNode,
  onGenerateRandomGraph,
  onReset,
  onColorGraph,
  coloringStats,
  onPauseDynamic,
  onResumeDynamic,
}) {
  const [randomNodes, setRandomNodes] = useState(60);

  // Opciones de coloración
  const [algorithm, setAlgorithm] = useState("lasvegas"); // "lasvegas" | "montecarlo"
  const [iterations, setIterations] = useState(1000);     // solo Monte Carlo
  const [speed, setSpeed] = useState("fast");             // "fast" | "slow"

  const handleAddNodeClick = () => {
    if (currentNodes >= maxNodes) {
      window.alert(`No se pueden agregar más de ${maxNodes} nodos.`);
      return;
    }
    onAddNode?.();
  };

  const handleGenerateClick = () => {
    let n = Number(randomNodes);
    if (Number.isNaN(n)) return;
    if (n < 1) n = 1;
    if (n > maxNodes) n = maxNodes;
    onGenerateRandomGraph?.(n);
  };

  const handleResetClick = () => {
    onReset?.();
  };

  const handleColorClick = () => {
    if (algorithm === "lasvegas") {
      // Las Vegas = modo solución válida, sin elegir iteraciones
      onColorGraph?.({
        algorithm: "lasvegas-dynamic",
        speed,
      });
    } else {
      // Monte Carlo = iteraciones limitadas, usuario elige iteraciones
      const it = Number(iterations);
      if (Number.isNaN(it) || it < 1) {
        window.alert("Las iteraciones deben ser un número entero positivo.");
        return;
      }
      onColorGraph?.({
        algorithm: "montecarlo-dynamic",
        iterations: it,
        speed,
      });
    }
  };

  // Estado dinámico para cualquier algoritmo probabilístico
  const isDynamic = coloringStats && coloringStats.dynamic;
  const progress = isDynamic ? coloringStats.progress || 0 : 0;
  const isRunning = isDynamic && coloringStats.isRunning;
  const isPaused = isDynamic && coloringStats.isPaused;

  return (
    <div className="control-panel">
      {/* Título */}
      <h2 className="control-panel__title">Panel de Control</h2>

      {/* Estadísticas de nodos */}
      <div className="control-panel__stats">
        <div className="control-panel__stats-main">
          <span className="control-panel__stats-label">Nodos</span>
          <span className="control-panel__stats-value">
            {currentNodes} / {maxNodes}
          </span>
        </div>
      </div>

      {/* Construcción manual */}
      <section className="control-panel__section">
        <h3 className="control-panel__section-title">Construcción manual</h3>
        <p className="control-panel__section-text">
          Añade nodos manualmente y conéctalos entre sí.
        </p>

        <button
          className="control-panel__button control-panel__button--primary"
          onClick={handleAddNodeClick}
        >
          Añadir nodo
        </button>
      </section>

      {/* Grafo aleatorio */}
      <section className="control-panel__section control-panel__section--bordered">
        <h3 className="control-panel__section-title control-panel__section-title--green">
          Grafo aleatorio
        </h3>

        <div className="control-panel__field">
          <label className="control-panel__field-label">
            Cantidad de nodos
          </label>
          <input
            type="number"
            min={1}
            max={maxNodes}
            value={randomNodes}
            onChange={(e) => setRandomNodes(e.target.value)}
            className="control-panel__input"
          />
        </div>

        <button
          className="control-panel__button control-panel__button--success"
          onClick={handleGenerateClick}
        >
          Generar grafo aleatorio
        </button>
      </section>

      {/* Coloración de grafos */}
      <section className="control-panel__section control-panel__section--bordered">
        <h3 className="control-panel__section-title">Coloración</h3>

        {/* Tipo de algoritmo */}
        <div className="control-panel__field">
          <label className="control-panel__field-label">Algoritmo</label>
          <select
            className="control-panel__input"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="lasvegas">Las Vegas (solución válida)</option>
            <option value="montecarlo">Monte Carlo (iteraciones)</option>
          </select>
        </div>

        {/* Iteraciones solo para Monte Carlo */}
        {algorithm === "montecarlo" && (
          <div className="control-panel__field">
            <label className="control-panel__field-label">
              Iteraciones
            </label>
            <input
              type="number"
              min={1}
              value={iterations}
              onChange={(e) => setIterations(e.target.value)}
              className="control-panel__input"
            />
          </div>
        )}

        {/* Velocidad (aplica a ambos algoritmos) */}
        <div className="control-panel__field">
          <label className="control-panel__field-label">
            Velocidad
          </label>
          <select
            className="control-panel__input"
            value={speed}
            onChange={(e) => setSpeed(e.target.value)}
          >
            <option value="fast">Rápida</option>
            <option value="slow">Lenta</option>
          </select>
        </div>

        {/* Botones de ejecución */}
        <div className="control-panel__buttons-row">
          <button
            className="control-panel__button control-panel__button--primary"
            onClick={handleColorClick}
          >
            Colorear grafo
          </button>

          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onPauseDynamic}
            disabled={!isDynamic || !isRunning}
          >
            Pausar
          </button>

          <button
            className="control-panel__button control-panel__button--secondary"
            onClick={onResumeDynamic}
            disabled={!isDynamic || !isPaused}
          >
            Continuar
          </button>
        </div>

        {/* Barra de progreso */}
        {isDynamic && (
          <div className="control-panel__progress-wrapper">
            <div className="control-panel__progress-bar">
              <div
                className="control-panel__progress-bar-fill"
                style={{ width: `${(progress * 100).toFixed(1)}%` }}
              />
            </div>
            <div className="control-panel__progress-label">
              {(progress * 100).toFixed(1)}%
            </div>
          </div>
        )}
      </section>

      {/* Estadísticas del algoritmo */}
      {coloringStats && (
        <section className="control-panel__section control-panel__section--bordered">
          <h3 className="control-panel__section-title">Resultados</h3>
          <p className="control-panel__section-text">
            <strong>Algoritmo:</strong> {coloringStats.algorithm}
            <br />
            {coloringStats.iterations && (
              <>
                <strong>Iteraciones / intentos:</strong>{" "}
                {coloringStats.iterations}
                <br />
              </>
            )}
            <strong>Intentos realizados:</strong>{" "}
            {coloringStats.attempts}
            <br />
            {typeof coloringStats.meanConflicts === "number" && (
              <>
                <strong>Conflictos promedio:</strong>{" "}
                {coloringStats.meanConflicts.toFixed(2)}
                <br />
              </>
            )}
            <strong>Conflictos (mejor solución):</strong>{" "}
            {coloringStats.conflicts}
            <br />
            <strong>Tasa de éxito estimada:</strong>{" "}
            {(coloringStats.successRate * 100).toFixed(1)}%
            <br />
            <strong>Tiempo:</strong>{" "}
            {coloringStats.timeMs?.toFixed(2)} ms
          </p>
        </section>
      )}

      {/* Reiniciar */}
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
