import React, { createContext, useState, useContext } from "react";

// Create the context
const UserContext = createContext();

// Provider component with mock values
export function UserProvider({ children }) {
  const [username, setUsername] = useState("Arjun");
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  return (
    <UserContext.Provider
      value={{ username, isLoggedIn, setUsername, setIsLoggedIn }}
    >
      {children}
    </UserContext.Provider>
  );
}

// Custom hook for easy context consumption
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

// ============================================
// QUESTION 1: Profile component deep in tree
// ============================================

export function Profile() {
  const { username, isLoggedIn } = useUser();

  return (
    <div
      style={{ padding: "20px", border: "1px solid #ccc", borderRadius: "8px" }}
    >
      <h2>User Profile</h2>
      <p>
        <strong>Username:</strong> {username}
      </p>
      <p>
        <strong>Logged In:</strong> {isLoggedIn ? "Yes" : "No"}
      </p>
    </div>
  );
}

// Dashboard that uses Profile deep in the tree
export function UserDashboard() {
  return (
    <div style={{ padding: "10px" }}>
      <h3>Dashboard</h3>
      <Profile />
    </div>
  );
}

export default UserContext;
