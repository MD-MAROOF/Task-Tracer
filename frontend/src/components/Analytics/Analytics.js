import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { FiList, FiCheck, FiCalendar, FiBarChart2 } from "react-icons/fi";
import { tasksAPI } from "../../utils/api";
import { STATUS_COLORS, PRIORITY_COLORS } from "../../utils/constants";
import Loader from "../Common/Loader";

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const { data: res } = await tasksAPI.analytics();
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load analytics");
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <Loader text="Loading analytics..." />;

  if (error) {
    return (
      <div
        style={{
          background: "#fef2f2",
          color: "#dc2626",
          padding: "12px 16px",
          borderRadius: 12,
          fontSize: 14,
          border: "1px solid #fecaca",
        }}
      >
        {error}
      </div>
    );
  }

  if (!data) return null;

  const {
    total = 0,
    completed = 0,
    pending = 0,
    todo = 0,
    inProgress = 0,
    completionPercentage = 0,
    highPriority = 0,
    mediumPriority = 0,
    lowPriority = 0,
    weeklyActivity = [],
  } = data;

  const statusData = [
    { name: "Todo", value: todo, color: STATUS_COLORS.Todo },
    { name: "In Progress", value: inProgress, color: STATUS_COLORS["In Progress"] },
    { name: "Done", value: completed, color: STATUS_COLORS.Done },
  ];

  const priorityData = [
    { name: "Low", count: lowPriority, fill: PRIORITY_COLORS.Low },
    { name: "Medium", count: mediumPriority, fill: PRIORITY_COLORS.Medium },
    { name: "High", count: highPriority, fill: PRIORITY_COLORS.High },
  ];

  const weeklyData = weeklyActivity.map((d) => ({
    label: new Date(d._id + "T12:00:00").toLocaleDateString("en-US", {
      weekday: "short",
    }),
    created: d.created,
    completed: d.completed,
  }));

  const statCards = [
    { label: "Total Tasks", value: total, color: "var(--accent)", icon: <FiList /> },
    { label: "Completed", value: completed, color: "var(--success)", icon: <FiCheck /> },
    { label: "Pending", value: pending, color: "var(--warning)", icon: <FiCalendar /> },
    { label: "Completion", value: completionPercentage + "%", color: "#8b5cf6", icon: <FiBarChart2 /> },
  ];

  return (
    <div className="fade-in">
      {/* Stats Cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 16,
          marginBottom: 28,
        }}
      >
        {statCards.map((s, i) => (
          <div
            key={i}
            className="card"
            style={{
              padding: "22px 20px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -10,
                right: -10,
                width: 60,
                height: 60,
                borderRadius: "50%",
                background: s.color + "12",
              }}
            />
            <div
              style={{
                fontSize: 13,
                color: "var(--text2)",
                fontWeight: 500,
                marginBottom: 8,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span style={{ color: s.color }}>{s.icon}</span>
              {s.label}
            </div>
            <div
              style={{
                fontSize: 32,
                fontWeight: 800,
                color: s.color,
                letterSpacing: "-1px",
                fontFamily: "'Playfair Display', serif",
              }}
            >
              {s.value}
            </div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 20,
        }}
      >
        {/* Progress Ring */}
        <div className="card" style={{ padding: 24 }}>
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            Overall Progress
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <svg width="160" height="160" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="none"
                stroke="var(--bg3)"
                strokeWidth="12"
              />
              <circle
                cx="80"
                cy="80"
                r="64"
                fill="none"
                stroke="var(--accent)"
                strokeWidth="12"
                strokeDasharray={`${completionPercentage * 4.02} 402`}
                strokeLinecap="round"
                transform="rotate(-90 80 80)"
                style={{ transition: "stroke-dasharray 0.8s ease" }}
              />
              <text
                x="80"
                y="74"
                textAnchor="middle"
                fontSize="28"
                fontWeight="800"
                fill="var(--text)"
                fontFamily="'Playfair Display', serif"
              >
                {completionPercentage}%
              </text>
              <text
                x="80"
                y="96"
                textAnchor="middle"
                fontSize="12"
                fill="var(--text2)"
              >
                complete
              </text>
            </svg>
          </div>
        </div>

        {/* Status Pie */}
        <div className="card" style={{ padding: 24 }}>
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            Tasks by Status
          </h3>
          {total === 0 ? (
            <p
              style={{
                color: "var(--text3)",
                textAlign: "center",
                padding: 30,
              }}
            >
              No tasks yet
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={65}
                  dataKey="value"
                  strokeWidth={0}
                >
                  {statusData.map((e, i) => (
                    <Cell key={i} fill={e.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
              marginTop: 8,
              flexWrap: "wrap",
            }}
          >
            {statusData.map((s) => (
              <span
                key={s.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 12,
                  color: "var(--text2)",
                }}
              >
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: s.color,
                    display: "inline-block",
                  }}
                />
                {s.name}: {s.value}
              </span>
            ))}
          </div>
        </div>

        {/* Priority Bar Chart */}
        <div className="card" style={{ padding: 24 }}>
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            Tasks by Priority
          </h3>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={priorityData} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 12, fill: "var(--text2)" }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 12, fill: "var(--text2)" }}
                axisLine={false}
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--bg2)",
                  border: "1px solid var(--border)",
                  borderRadius: 10,
                  fontSize: 13,
                }}
              />
              <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                {priorityData.map((e, i) => (
                  <Cell key={i} fill={e.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Activity */}
        <div className="card" style={{ padding: 24 }}>
          <h3
            style={{
              margin: "0 0 20px",
              fontSize: 15,
              fontWeight: 600,
              color: "var(--text)",
            }}
          >
            Weekly Activity
          </h3>
          {weeklyData.length === 0 ? (
            <p
              style={{
                color: "var(--text3)",
                textAlign: "center",
                padding: 30,
              }}
            >
              No recent activity
            </p>
          ) : (
            <ResponsiveContainer width="100%" height={160}>
              <LineChart data={weeklyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 12, fill: "var(--text2)" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 12, fill: "var(--text2)" }}
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: "var(--bg2)",
                    border: "1px solid var(--border)",
                    borderRadius: 10,
                    fontSize: 13,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="created"
                  stroke="var(--accent)"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Created"
                />
                <Line
                  type="monotone"
                  dataKey="completed"
                  stroke="var(--success)"
                  strokeWidth={2.5}
                  dot={{ r: 4 }}
                  name="Completed"
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
