import React, { useEffect, useState, useMemo } from "react";
import { useLogs } from "../context/LogContext";
import { Link, useNavigate } from "react-router-dom";
import NavBar from "../Navbar";
import styles from "./Dashboard.module.css";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";


const Dashboard = () => {
  const navigate = useNavigate();
  const { logs } = useLogs();
  const [stats, setStats] = useState({
    total: 0,
    info: 0,
    warning: 0,
    error: 0,
  });

  
  useEffect(()=>{
    if(!localStorage.getItem("token")){
      setTimeout(() => {
        navigate("/login")
      }, 1000);
    };
  });

  // Compute log counts when logs change
  useEffect(() => {
    const counts = { info: 0, warning: 0, error: 0 };
    logs.forEach((log) => {
      if (log.level === "info") counts.info++;
      else if (log.level === "warning") counts.warning++;
      else if (log.level === "error") counts.error++;
    });
    setStats({ total: logs.length, ...counts });
  }, [logs]);

  // Generate chart data efficiently
  const chartData = useMemo(
    () => [
      { name: "Info", count: stats.info },
      { name: "Warning", count: stats.warning },
      { name: "Error", count: stats.error },
    ],
    [stats]
  );

  return (
    <>
      <NavBar/>
      <div className={styles.container}>
        <h2 className={styles.title}>📊 Live Log Dashboard</h2>

        {/* Summary Cards */}
        <div className={styles.cards}>
          <div className={`${styles.card} ${styles.info}`}>
            <h3>Info</h3>
            <p>{stats.info}</p>
          </div>
          <div className={`${styles.card} ${styles.warning}`}>
            <h3>Warning</h3>
            <p>{stats.warning}</p>
          </div>
          <div className={`${styles.card} ${styles.error}`}>
            <h3>Error</h3>
            <p>{stats.error}</p>
          </div>
          <div className={`${styles.card} ${styles.total}`}>
            <h3>Total Logs</h3>
            <p>{stats.total}</p>
          </div>
        </div>

        {/* Chart Section */}
        <div className={styles.chartContainer}>
          <h3>Logs by Level</h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#36cfc9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
