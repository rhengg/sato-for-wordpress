import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import "./style.css";
import "@wordpress/components/build-style/style.css";
import "@wordpress/dataviews/build-style/style.css";
import "@fontsource/material-symbols-outlined/400.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <div className="sato-player">
        <App />
      </div>
    </BrowserRouter>
  </React.StrictMode>,
);
