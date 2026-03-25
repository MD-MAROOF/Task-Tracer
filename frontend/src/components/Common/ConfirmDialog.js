import React from "react";

const ConfirmDialog = ({ emoji = "!", title, message, confirmLabel = "Confirm", cancelLabel = "Cancel", onConfirm, onCancel, danger = false }) => (
  <div className="modal-overlay" onClick={onCancel}>
    <div
      className="modal-content"
      onClick={(e) => e.stopPropagation()}
      style={{ maxWidth: 380, textAlign: "center" }}
    >
      <div style={{ fontSize: 40, marginBottom: 16 }}>{emoji}</div>
      <h3 style={{ margin: "0 0 8px", color: "var(--text)", fontSize: 18 }}>
        {title}
      </h3>
      <p style={{ color: "var(--text2)", margin: "0 0 24px", fontSize: 14 }}>
        {message}
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <button className="btn-secondary" onClick={onCancel} style={{ flex: 1 }}>
          {cancelLabel}
        </button>
        <button
          className="btn-primary"
          onClick={onConfirm}
          style={{
            flex: 1,
            background: danger ? "var(--danger)" : undefined,
          }}
        >
          {confirmLabel}
        </button>
      </div>
    </div>
  </div>
);

export default ConfirmDialog;
