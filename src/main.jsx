import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app";
import { AuthProvider } from "./context/AuthContext";
import { TwilioProvider } from "./context/TwilioContext";
import "./index.css";

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TwilioProvider>
          <App />
        </TwilioProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
