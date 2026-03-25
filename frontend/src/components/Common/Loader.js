import React from "react";

const Loader = ({ text = "Loading..." }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
      gap: 16,
    }}
  >
    <div className="spinner" />
    <p style={{ color: "var(--text3)", fontSize: 14 }}>{text}</p>
  </div>
);

export default Loader;
