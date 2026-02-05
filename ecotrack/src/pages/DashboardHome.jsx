import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogs } from "../redux/logsSlice";

import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.logs);

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  // Added memoization for derived data
  const { highCarbon, lowCarbon } = useMemo(() => ({
    highCarbon: data.filter(log => log.carbon > 4),
    lowCarbon: data.filter(log => log.carbon <= 4),
  }), [data]);

  if (loading) return <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div>
      <Typography variant="h5" gutterBottom sx={{ mt: 2 }}>
        Total Activities
      </Typography>
      <ul>
        {data.map(log => (
          <li key={log.id}>
            {log.activity}: {log.carbon} Kg
          </li>
        ))}
      </ul>

      <Typography variant="h6" color="error" gutterBottom sx={{ mt: 4 }}>
        High Carbon (&gt; 4 Kg)
      </Typography>
      <ul>
        {highCarbon.map(log => (
          <li key={log.id}>{log.activity}</li>
        ))}
      </ul>

      <Typography variant="h6" color="success.main" gutterBottom sx={{ mt: 4 }}>
        Low Carbon (≤ 4 Kg)
      </Typography>
      <ul>
        {lowCarbon.map(log => (
          <li key={log.id}>{log.activity}</li>
        ))}
      </ul>

      <Button 
        variant="contained" 
        color="primary" 
        onClick={() => dispatch(fetchLogs())}
        sx={{ mt: 3 }}
      >
        Refresh Logs
      </Button>
    </div>
  );
};

export default DashboardHome;