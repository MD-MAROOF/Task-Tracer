import React from "react";

const EmptyState = ({ emoji = "!", title, subtitle, action }) => (
  <div
    style={{
      textAlign: "center",
      padding: "60px 20px",
      color: "var(--text3)",
    }}
  >
    <div style={{ fontSize: 48, marginBottom: 16 }}>{emoji}</div>
    <p style={{ fontSize: 16, fontWeight: 500, color: "var(--text2)", marginBottom: 6 }}>
      {title}
    </p>
    {subtitle && (
      <p style={{ fontSize: 14, marginBottom: 20 }}>{subtitle}</p>
    )}
    {action}
  </div>
);

export default EmptyState;
