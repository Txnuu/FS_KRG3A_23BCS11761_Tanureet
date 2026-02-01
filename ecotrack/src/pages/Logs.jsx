import { use, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLogs } from '../redux/logsSlice';

const Logs = () => {
  const dispatch = useDispatch();
  const { data, status, error } = useSelector((state) => state.logs);

  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchLogs());
    }
  }, [status, dispatch]);

  if (status === 'loading') {
    return <div>Loading logs...</div>;
  }

  return (
  <div style={{ padding: "1rem" }}>
    <h3>Daily Logs - redux</h3>
    <ul>
      {data.map((log) => (
        <li key={log.id}>
          {log.activity} - {log.carbon} Kg
        </li>
      ))}
    </ul>
  </div>
);

}

export default Logs;

