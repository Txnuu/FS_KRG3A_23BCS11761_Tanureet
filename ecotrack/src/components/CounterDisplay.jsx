import React from "react";
import { Typography, Box } from "@mui/material";

const CounterDisplay = ({ count, goal }) => {
  console.log("CounterDisplay Rendered");

  return (
    <Box textAlign="center" mt={2}>
      <Typography variant="h3">
        {count} / {goal}
      </Typography>
      <Typography variant="body1">
        Glasses completed
      </Typography>
    </Box>
  );
};

export default React.memo(CounterDisplay);