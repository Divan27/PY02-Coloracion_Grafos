import React from "react";
import ControlPanelView from "./ControlPanelView";
import GraphCanvasView from "./GraphCanvasView";

const MainLayout = ({
    graphs,
    onCreateGraph,
    onRunMonteCarlo,
    onRunLasVegas
}) => {
    return (
        <div style={{ display: "flex" }}>
            <ControlPanelView
                onCreateGraph={onCreateGraph}
                onRunMonteCarlo={onRunMonteCarlo}
                onRunLasVegas={onRunLasVegas}
            />

            <div style={{ flex: 1 }}>
                <GraphCanvasView graphs={graphs} />
            </div>
        </div>
    );
};

export default MainLayout;
