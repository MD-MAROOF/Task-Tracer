import React, { useState } from "react";
import Header from "../Layout/Header";
import TaskList from "../Tasks/TaskList";
import Analytics from "../Analytics/Analytics";

const Dashboard = () => {
  const [activeView, setActiveView] = useState("tasks");

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background 0.3s" }}>
      <Header activeView={activeView} onViewChange={setActiveView} />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "28px 24px" }}>
        {activeView === "analytics" ? <Analytics /> : <TaskList />}
      </main>
    </div>
  );
};

export default Dashboard;
