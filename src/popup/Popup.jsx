import React, { useState } from "react";
import Dashboard from "../dashboard/Dashboard";

export default function Popup() {
  const [isDashboardOpen, setIsDashboardOpen] = useState(false);

  const toggleDashboard = () => {
    setIsDashboardOpen(!isDashboardOpen);
  };

  return (
    <div style={{ padding: 16, width: 360, minHeight: 360 }}>
      <h3 style={{ marginBottom: 4 }}>Screen Time Tracker</h3>
      <button
        style={{
          marginBottom: 16,
          padding: "8px 12px",
          borderRadius: 6,
          border: "none",
          background: "#333",
          color: "white",
          cursor: "pointer",
        }}
        onClick={toggleDashboard}
      >
        Open Dashboard
      </button>

      {isDashboardOpen && <Dashboard />}
    </div>
  );
}
