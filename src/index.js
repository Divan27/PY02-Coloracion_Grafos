import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

import "./index.css"; // estilos base
import "./App.css";   // toda la temática espacial y layout

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<App />);
