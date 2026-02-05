import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    login();
    navigate("/dashboard"); 
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      alignItems: 'center', 
      justifyContent: 'center', 
      minHeight: '100vh',
      p: 3 
    }}>
      <Typography variant="h4" gutterBottom>
        Welcome to EcoTrack
      </Typography>
      <Button 
        variant="contained" 
        color="primary" 
        size="large" 
        onClick={handleLogin}
        sx={{ mt: 3, px: 6, py: 1.5 }}
      >
        Login to EcoTrack
      </Button>
    </Box>
  );
};

export default Login;