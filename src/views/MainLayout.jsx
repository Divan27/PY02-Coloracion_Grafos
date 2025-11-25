import React from "react";
import ControlPanelView from "./ControlPanelView";
import GraphCanvasView from "./GraphCanvasView";

const layoutStyle = {
  display: "flex",
  height: "100vh",
  width: "100vw",
  overflow: "hidden",
};

const leftPanelStyle = {
  width: "280px",
  background: "#1f1f1f",
  color: "white",
  padding: "20px",
};

const rightPanelStyle = {
  flex: 1,
  background: "#fafafa",
  position: "relative",
};

export default function MainLayout() {
  return (
    <div style={layoutStyle}>
      <div style={leftPanelStyle}>
        <ControlPanelView />
      </div>

      <div style={rightPanelStyle}>
        <GraphCanvasView />
      </div>
    </div>
  );
}
