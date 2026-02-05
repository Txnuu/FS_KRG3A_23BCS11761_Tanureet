import { lazy, Suspense } from "react";                  
import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./routes/ProtectedRoute";

// Lazy load pages 
const Dashboard       = lazy(() => import("./pages/Dashboard"));
const DashboardHome   = lazy(() => import("./pages/DashboardHome"));
const Overview        = lazy(() => import("./pages/Overview"));
const Reports         = lazy(() => import("./pages/Reports"));
const Login           = lazy(() => import("./pages/Login"));

const App = () => {
  return (
    <Suspense fallback={
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh' 
      }}>
        Loading application...
      </div>
    }>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="overview" element={<Overview />} />
          <Route path="reports" element={<Reports />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Suspense>
  );
};

export default App;