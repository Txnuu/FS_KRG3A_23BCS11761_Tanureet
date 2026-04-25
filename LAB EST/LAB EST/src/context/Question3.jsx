import React, { createContext, useState, useContext } from "react";
import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";

// ============================================
// QUESTION 3: Protected Route
// ============================================

// Create Auth Context
const AuthContext = createContext();

// Auth Provider
export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const toggleAuth = () => {
    setIsAuthenticated((prev) => !prev);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, toggleAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom hook
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Protected Route component
export function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// Login Page
export function LoginPage() {
  const { isAuthenticated, toggleAuth } = useAuth();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h2>Login Page</h2>
      <p>
        Current Status:{" "}
        <strong>{isAuthenticated ? "Logged In" : "Logged Out"}</strong>
      </p>
      <button
        onClick={toggleAuth}
        style={{ padding: "10px 20px", fontSize: "16px", cursor: "pointer" }}
      >
        {isAuthenticated ? "Logout" : "Login"}
      </button>
      <p style={{ marginTop: "20px" }}>
        <Link to="/dashboard">Go to Dashboard</Link>
      </p>
    </div>
  );
}

// Dashboard Page (Protected)
export function DashboardPage() {
  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h2>Dashboard (Protected)</h2>
      <p>This is a protected route. Only visible when logged in.</p>
      <p>You have successfully accessed the dashboard!</p>
      <div style={{ marginTop: "20px" }}>
        <Link to="/login">Go to Login</Link>
      </div>
    </div>
  );
}

// Main App for Question 3
export function AppQ3() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div
          style={{
            fontFamily: "Arial, sans-serif",
            maxWidth: "600px",
            margin: "50px auto",
          }}
        >
          <h1>Protected Route Demo (Q3)</h1>

          <nav
            style={{
              marginBottom: "20px",
              padding: "10px",
              backgroundColor: "#f5f5f5",
            }}
          >
            <Link to="/login" style={{ marginRight: "20px" }}>
              Login
            </Link>
            <Link to="/dashboard">Dashboard</Link>
          </nav>

          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AuthContext;
