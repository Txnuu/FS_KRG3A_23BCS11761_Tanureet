import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/dashboard"); 
  };

  return (
    <div>
      <h2>Login</h2>
      <button onClick={handleLogin}>Login to EcoTrack</button>
    </div>
  );
};

export default Login;
