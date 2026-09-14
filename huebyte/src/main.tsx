import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { startBootFailsafe } from "./lib/boot";
import "./styles/global.scss";

startBootFailsafe();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
