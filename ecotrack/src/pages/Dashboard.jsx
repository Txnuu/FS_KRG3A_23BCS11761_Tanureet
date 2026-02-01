import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Dashboard = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <h2 style={{ color: "green" }}>Dashboard</h2>

      <nav>
        <Link to="" style={{ marginRight: "10px" }}>Home</Link>
        <Link to="overview" style={{ marginRight: "10px" }}>Overview</Link>
        <Link to="reports" style={{ marginRight: "10px" }}>Reports</Link>
        <button onClick={handleLogout} style={{ color: "red" }}>
          Logout
        </button>
      </nav>

      <hr />

      {/* CHILD ROUTES */}
      <Outlet />
    </div>
  );
};

export default Dashboard;
