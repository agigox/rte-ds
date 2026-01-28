import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "@rte-ds/react/style.css";
import "@rte-ds/core/css/rte-fonts.css";
import "@rte-ds/core/css/bleu_iceberg.css";
import App from "./App.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
