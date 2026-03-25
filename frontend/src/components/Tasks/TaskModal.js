import React, { useState } from "react";
import { FiX } from "react-icons/fi";
import { STATUSES, PRIORITIES } from "../../utils/constants";

const TaskModal = ({ task, onSave, onClose, loading }) => {
  const [form, setForm] = useState(
    task || {
      title: "",
      description: "",
      status: "Todo",
      priority: "Medium",
      dueDate: "",
    }
  );
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.dueDate) e.dueDate = "Due date is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSave(form);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: 500, maxHeight: "90vh", overflowY: "auto" }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 24,
          }}
        >
          <h2
            style={{ margin: 0, fontSize: 20, fontWeight: 700, color: "var(--text)" }}
          >
            {task ? "Edit Task" : "New Task"}
          </h2>
          <button className="btn-icon" onClick={onClose}>
            <FiX size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="What needs to be done?"
              style={{
                borderColor: errors.title ? "var(--danger)" : undefined,
              }}
            />
            {errors.title && <span className="form-error">{errors.title}</span>}
          </div>

          <div style={{ marginBottom: 16 }}>
            <label className="form-label">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Add details..."
              rows={3}
            />
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label className="form-label">Status</label>
              <select name="status" value={form.status} onChange={handleChange}>
                {STATUSES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label">Priority</label>
              <select
                name="priority"
                value={form.priority}
                onChange={handleChange}
              >
                {PRIORITIES.map((p) => (
                  <option key={p}>{p}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label className="form-label">Due Date *</label>
            <input
              name="dueDate"
              type="date"
              value={form.dueDate ? form.dueDate.split("T")[0] : ""}
              onChange={handleChange}
              style={{
                borderColor: errors.dueDate ? "var(--danger)" : undefined,
              }}
            />
            {errors.dueDate && (
              <span className="form-error">{errors.dueDate}</span>
            )}
          </div>

          <div style={{ display: "flex", gap: 12 }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onClose}
              style={{ flex: 1 }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading
                ? "Saving..."
                : task
                ? "Update Task"
                : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
