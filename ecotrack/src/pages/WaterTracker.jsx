import React, { useState, useEffect, useCallback } from "react";
import {
  Container,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import CounterDisplay from "../components/CounterDisplay";

const WaterTracker = () => {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(8);
  const [tip, setTip] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved count
  useEffect(() => {
    const saved = localStorage.getItem("waterCount");
    if (saved) setCount(Number(saved));
  }, []);

  // Save count
  useEffect(() => {
    localStorage.setItem("waterCount", count);
  }, [count]);

  // Fetch health tip
  const fetchTip = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("https://api.adviceslip.com/advice");
      const data = await res.json();
      setTip(data.slip.advice);
    } catch (err) {
      setError("Failed to fetch tip.");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchTip();
  }, []);

  // Optimized functions
  const increase = useCallback(() => {
    setCount((prev) => prev + 1);
  }, []);

  const decrease = useCallback(() => {
    setCount((prev) => (prev > 0 ? prev - 1 : 0));
  }, []);

  const reset = useCallback(() => {
    setCount(0);
  }, []);

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Card elevation={4}>
        <CardContent>
          <Typography variant="h4" align="center" gutterBottom>
            💧 Daily Water Tracker
          </Typography>

          <CounterDisplay count={count} goal={goal} />

          <Box display="flex" justifyContent="center" gap={2} mt={3}>
            <Button variant="contained" color="primary" onClick={increase}>
              <Add />
            </Button>
            <Button variant="contained" color="secondary" onClick={decrease}>
              <Remove />
            </Button>
            <Button variant="outlined" color="error" onClick={reset}>
              Reset
            </Button>
          </Box>

          <Box mt={3}>
            <TextField
              label="Daily Goal"
              type="number"
              value={goal}
              onChange={(e) => setGoal(Number(e.target.value))}
              fullWidth
            />
          </Box>

          {count >= goal && (
            <Alert severity="success" sx={{ mt: 3 }}>
              🎉 Goal Reached!
            </Alert>
          )}

          <Box mt={4}>
            <Typography variant="h6">Today's Health Tip</Typography>
            {loading && <CircularProgress size={25} />}
            {error && <Alert severity="error">{error}</Alert>}
            {!loading && !error && (
              <Typography mt={1}>{tip}</Typography>
            )}
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
};

export default WaterTracker;