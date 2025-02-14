import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./Home/AuthContext"; // Import AuthProvider
import Login from "./components/Login";
import Home from "./components/HomePage";
import "bootstrap/dist/js/bootstrap.bundle.min";
import "bootstrap/dist/css/bootstrap.min.css";

// ✅ PrivateRoute to protect pages from unauthorized users
const PrivateRoute = ({ children }) => {
  const authToken = localStorage.getItem("authToken"); // ✅ Correct key
  return authToken ? children : <Navigate to="/login" />;
};

const root = createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter> {/* ✅ Wrap entire app with BrowserRouter */}
    <AuthProvider> {/* ✅ AuthProvider is now inside BrowserRouter */}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);