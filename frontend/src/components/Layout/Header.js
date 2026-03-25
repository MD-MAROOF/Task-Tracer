import React from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import {
  FiSun,
  FiMoon,
  FiLogOut,
  FiUser,
  FiList,
  FiBarChart2,
} from "react-icons/fi";

const Header = ({ activeView, onViewChange }) => {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const tabs = [
    { id: "tasks", label: "Tasks", icon: <FiList size={16} /> },
    { id: "analytics", label: "Analytics", icon: <FiBarChart2 size={16} /> },
  ];

  return (
    <header
      style={{
        background: "var(--bg2)",
        borderBottom: "1px solid var(--border)",
        padding: "0 24px",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 64,
        }}
      >
        {/* Left: Logo + Nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <span
            style={{
              fontSize: 24,
              fontWeight: 800,
              color: "var(--accent)",
              letterSpacing: "-1px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            TaskTracer
          </span>

          <nav style={{ display: "flex", gap: 4 }}>
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onViewChange(tab.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 16px",
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  fontSize: 14,
                  fontWeight: 500,
                  background:
                    activeView === tab.id
                      ? "rgba(99, 102, 241, 0.1)"
                      : "transparent",
                  color:
                    activeView === tab.id ? "var(--accent)" : "var(--text2)",
                  transition: "all 0.2s",
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {tab.icon}
                <span className="hide-mobile">{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Right: User + Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontSize: 13,
              color: "var(--text2)",
              display: "flex",
              alignItems: "center",
              gap: 6,
            }}
          >
            <FiUser size={14} />
            <span className="hide-mobile">{user?.name}</span>
          </span>

          <button className="btn-icon" onClick={toggleTheme} style={{ padding: 8 }}>
            {dark ? <FiSun size={16} /> : <FiMoon size={16} />}
          </button>

          <button
            className="btn-icon"
            onClick={logout}
            style={{ padding: 8, color: "var(--danger)" }}
          >
            <FiLogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
