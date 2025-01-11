import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";
import { SplashProvider } from "./context/SplashContext.jsx";
import { LoaderProvider } from "./context/useLoader.jsx";
import { MiscContextProvider } from "./context/MiscContext.jsx";
import { UserProvider } from "./context/UserContext.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <LoaderProvider>
      <SplashProvider>
        <AuthProvider>
          <MiscContextProvider>
            <UserProvider>
              <App />
            </UserProvider>
          </MiscContextProvider>
        </AuthProvider>
      </SplashProvider>
    </LoaderProvider>
  </StrictMode>
);