import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLogs } from "../redux/logsSlice";

const DashboardHome = () => {
  const dispatch = useDispatch();
  const { data, loading, error } = useSelector(state => state.logs);

  useEffect(() => {
    dispatch(fetchLogs());
  }, [dispatch]);

  if (loading) return <p>Loading logs...</p>;
  if (error) return <p>{error}</p>;

  const highCarbon = data.filter(log => log.carbon > 4);
  const lowCarbon = data.filter(log => log.carbon <= 4);

  return (
    <div>
      <h3>Total Activities</h3>
      <ul>
        {data.map(log => (
          <li key={log.id}>
            {log.activity}: {log.carbon} Kg
          </li>
        ))}
      </ul>

      <h3 style={{ color: "red" }}>High Carbon (&gt; 4 Kg)</h3>
      <ul>
        {highCarbon.map(log => (
          <li key={log.id}>{log.activity}</li>
        ))}
      </ul>

      <h3 style={{ color: "green" }}>Low Carbon (≤ 4 Kg)</h3>
      <ul>
        {lowCarbon.map(log => (
          <li key={log.id}>{log.activity}</li>
        ))}
      </ul>

      <button onClick={() => dispatch(fetchLogs())}>
        Refresh Logs
      </button>
    </div>
  );
};

export default DashboardHome;
