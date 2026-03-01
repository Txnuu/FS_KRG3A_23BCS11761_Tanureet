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
      p: 3,
      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
      color: 'white'
    }}>
      <Typography variant="h4" gutterBottom>
        Welcome to EcoTrack
      </Typography>

      <Typography variant="subtitle1" sx={{ mb: 3 }}>
        Developed by Tanureet Kaur
      </Typography>

      <Button 
        variant="contained" 
        size="large" 
        onClick={handleLogin}
        sx={{ 
          mt: 2, 
          px: 6, 
          py: 1.5,
          backgroundColor: 'white',
          color: '#2E7D32',
          fontWeight: 'bold',
          '&:hover': {
            backgroundColor: '#e8f5e9'
          }
        }}
      >
        Login as Tanureet
      </Button>
    </Box>
  );
};

export default Login;