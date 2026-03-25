import React from "react";
import { FiCheck, FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import { STATUS_COLORS, PRIORITY_COLORS } from "../../utils/constants";

const TaskCard = ({ task, onEdit, onDelete, onToggle }) => {
  const isOverdue =
    task.status !== "Done" &&
    new Date(task.dueDate) < new Date(new Date().toDateString());

  const dueLabel = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <div
      className="card"
      style={{
        padding: "20px 22px",
        transition: "transform 0.2s, box-shadow 0.2s",
        position: "relative",
        overflow: "hidden",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "none";
        e.currentTarget.style.boxShadow = "var(--shadow)";
      }}
    >
      {/* Priority indicator stripe */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: "100%",
          background: PRIORITY_COLORS[task.priority],
          borderRadius: "4px 0 0 4px",
        }}
      />

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 12,
        }}
      >
        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3
            style={{
              margin: "0 0 6px",
              fontSize: 16,
              fontWeight: 600,
              color: task.status === "Done" ? "var(--text3)" : "var(--text)",
              textDecoration: task.status === "Done" ? "line-through" : "none",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {task.title}
          </h3>

          {task.description && (
            <p
              style={{
                margin: "0 0 12px",
                fontSize: 13,
                color: "var(--text2)",
                lineHeight: 1.5,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {task.description}
            </p>
          )}

          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              alignItems: "center",
            }}
          >
            <span
              className="badge"
              style={{
                background: STATUS_COLORS[task.status] + "18",
                color: STATUS_COLORS[task.status],
              }}
            >
              {task.status}
            </span>
            <span
              className="badge"
              style={{
                background: PRIORITY_COLORS[task.priority] + "18",
                color: PRIORITY_COLORS[task.priority],
              }}
            >
              {task.priority}
            </span>
            {dueLabel && (
              <span
                className="badge"
                style={{
                  background: isOverdue ? "#fef2f2" : "var(--bg3)",
                  color: isOverdue ? "var(--danger)" : "var(--text2)",
                  gap: 5,
                }}
              >
                <FiCalendar size={12} />
                {dueLabel}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", gap: 4, flexShrink: 0 }}>
          <button
            className="btn-icon-sm"
            onClick={() => onToggle(task)}
            title={task.status === "Done" ? "Reopen" : "Mark Complete"}
            style={{
              color:
                task.status === "Done" ? "var(--success)" : "var(--text3)",
            }}
          >
            <FiCheck size={16} />
          </button>
          <button
            className="btn-icon-sm"
            onClick={() => onEdit(task)}
            title="Edit"
          >
            <FiEdit2 size={16} />
          </button>
          <button
            className="btn-icon-sm"
            onClick={() => onDelete(task._id)}
            title="Delete"
          >
            <FiTrash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
