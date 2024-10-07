// src/index.js
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { UserProvider } from "./store/UserContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <UserProvider>
    <App />
  </UserProvider>
);
