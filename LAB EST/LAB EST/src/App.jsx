import React from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { AuthProvider, useAuth, ProtectedRoute, LoginPage, DashboardPage } from './context/Question3';
import Profile from './components/Profile';

// ============================================
// QUESTION 1: User Context with Profile
// ============================================

// Intermediate components to demonstrate "deep in the tree"
const Layout = ({ children }) => (
  <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
    <h1>App Layout</h1>
    {children}
  </div>
);

const Dashboard = ({ children }) => (
  <div style={{ marginTop: '1rem', padding: '1rem', background: '#fff', borderRadius: '8px' }}>
    <h3>Dashboard</h3>
    {children}
  </div>
);

const DashboardContent = ({ children }) => (
  <div style={{ marginTop: '1rem' }}>
    <h4>Dashboard Content</h4>
    {children}
  </div>
);

// ============================================
// Combined Main App with both Questions
// ============================================

function App() {
  return (
    <UserProvider>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '800px', margin: '50px auto' }}>
            <h1>React Context Demo</h1>
            <p>Both Question 1 and Question 3 implemented</p>

            <nav style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#f5f5f5' }}>
              <Link to="/" style={{ marginRight: '20px' }}>Home (Q1)</Link>
              <Link to="/q1-dashboard" style={{ marginRight: '20px' }}>Q1 Dashboard</Link>
              <Link to="/login" style={{ marginRight: '20px' }}>Login (Q3)</Link>
              <Link to="/dashboard">Dashboard (Q3)</Link>
            </nav>

            <Routes>
              {/* Question 1 Routes */}
              <Route path="/" element={
                <div>
                  <h2>Question 1: User Context</h2>
                  <p>Profile component consumes context directly without props:</p>
                  <Profile />
                </div>
              } />
              <Route path="/q1-dashboard" element={
                <UserProvider>
                  <Layout>
                    <Dashboard>
                      <DashboardContent>
                        <Profile />
                      </DashboardContent>
                    </Dashboard>
                  </Layout>
                </UserProvider>
              } />

              {/* Question 3 Routes */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </AuthProvider>
    </UserProvider>
  );
}

export default App;

