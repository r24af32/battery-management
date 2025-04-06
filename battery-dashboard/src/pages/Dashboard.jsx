import React, { useEffect, useState } from 'react';
import './Dashboard.css';
import BatteryChart from '../components/BatteryChart';
import API_BASE_URL from '../config';

const Dashboard = () => {
  const [batteryData, setBatteryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [chartData, setChartData] = useState([]); // ✅ Moved here

  // ✅ Fetch latest battery data
  useEffect(() => {
    const fetchLatestData = () => {
      fetch(`${API_BASE_URL}/api/latest`)
        .then((res) => {
          if (!res.ok) throw new Error('Network response was not ok');
          return res.json();
        })
        .then((data) => {
          setBatteryData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching battery data:", err);
          setError(true);
          setLoading(false);
        });
    };
  
    fetchLatestData(); // Initial fetch
    const interval = setInterval(fetchLatestData, 5000); // Auto-refresh every 5 seconds
  
    return () => clearInterval(interval); // Cleanup
  }, []);
  

  // ✅ Fetch historical battery chart data
  useEffect(() => {
    const fetchHistoryData = () => {
      fetch(`${API_BASE_URL}/api/history`)
        .then(res => res.json())
        .then(data => {
          const formatted = data.map(item => ({
            voltage: item.voltage,
            current: item.current,
            timestamp: new Date(item.timestamp).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
            }),
          }));
          setChartData(formatted);
        })
        .catch(err => console.error("Error fetching chart data:", err));
    };
  
    fetchHistoryData(); // Initial fetch
    const interval = setInterval(fetchHistoryData, 15000); // Refresh every 15 seconds
  
    return () => clearInterval(interval); // Cleanup
  }, []);
  

  return (
    <div className="dashboard">
      <h1>Battery Monitoring Dashboard</h1>

      {loading ? (
        <p className="loading">Loading battery data...</p>
      ) : error ? (
        <p className="error">⚠️ Unable to load battery data. Please try again later.</p>
      ) : (
        batteryData && (
          <div className="grid">
            <div className="card voltage">
              <p>Voltage</p>
              <h2>{batteryData.voltage ?? '-'} V</h2>
            </div>
            <div className="card current">
              <p>Current</p>
              <h2>{batteryData.current ?? '-'} A</h2>
            </div>
            <div className="card temperature">
              <p>Temperature</p>
              <h2>{batteryData.temperature ?? '-'} °C</h2>
            </div>
            <div className="card percentage">
              <p>Battery</p>
              <h2>{batteryData.percentage ?? '-'} %</h2>
            </div>
          </div>
        )
      )}

      <div style={{ marginTop: '40px' }}>
        <BatteryChart chartData={chartData} />
      </div>
    </div>
  );
};

export default Dashboard;
