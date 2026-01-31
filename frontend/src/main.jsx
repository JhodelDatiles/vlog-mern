import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-center" // 👈 This makes it slide in from the right
          toastOptions={{
            // This adds a slight slide animation feel
            duration: 3000,
            style: {
              padding: "16px",
              color: "#333",
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
