import React from "react";
import ReactDOM from "react-dom/client";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";
import "./index.css";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <MantineProvider
      theme={{
        primaryColor: "blue",
        colors: {
          brand: [
            "#e3f2fd",
            "#bbdefb",
            "#90caf9",
            "#64b5f6",
            "#42a5f5",
            "#2196f3",
            "#1e88e5",
            "#1976d2",
            "#1565c0",
            "#0d47a1",
          ],
        },
      }}
    >
      <Notifications position="top-right" />
      <AuthProvider>
        <App />
      </AuthProvider>
    </MantineProvider>
  </React.StrictMode>,
);
