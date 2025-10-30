import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import { TwilioProvider } from "./context/TwilioContext";
import "./index.css";

// Use the basename to match Vite's base configuration
// This ensures the app works correctly when deployed at:
// https://devtpm.language-empire.net/ODOverseasPortal/
// All routes (e.g., /login, /dashboard) will be relative to this base
const BASENAME = import.meta.env.VITE_URL_DIR || "/";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter basename={BASENAME}>
      <AuthProvider>
        <TwilioProvider>
          <App />
        </TwilioProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
