import React from "react";

const Dashboard = () => {
  const [data, setData] = React.useState(null);

  React.useEffect(() => {
    setTimeout(() => {
      setData("Eco Data Loaded");
    }, 500);
  }, []);

  return <div>{data ? data : "Loading..."}</div>;
};

export default Dashboard;