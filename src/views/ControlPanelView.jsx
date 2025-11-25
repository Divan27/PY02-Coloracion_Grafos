import React from "react";

const ControlPanelView = ({ onCreateGraph, onRunMonteCarlo, onRunLasVegas }) => {
    return (
        <div style={{
            width: "250px",
            padding: "20px",
            background: "#f4f4f4",
            borderRight: "2px solid #ccc",
            height: "100vh"
        }}>
            <h2>Panel de Control</h2>

            <button onClick={onCreateGraph}>Crear Grafo</button>
            <br /><br />

            <button onClick={onRunMonteCarlo}>Ejecutar Monte Carlo</button>
            <br /><br />

            <button onClick={onRunLasVegas}>Ejecutar Las Vegas</button>
        </div>
    );
};

export default ControlPanelView;

