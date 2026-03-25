import React from "react";
import { FiSearch, FiPlus } from "react-icons/fi";
import { STATUSES, PRIORITIES } from "../../utils/constants";

const TaskFilters = ({
  search,
  onSearchChange,
  filterStatus,
  onFilterStatusChange,
  filterPriority,
  onFilterPriorityChange,
  sortBy,
  sortDir,
  onSortChange,
  onNewTask,
}) => {
  const sortOptions = [
    { key: "dueDate", label: "Date" },
    { key: "priority", label: "Priority" },
    { key: "title", label: "Title" },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        marginBottom: 24,
        alignItems: "center",
      }}
    >
      {/* Search */}
      <div style={{ flex: "1 1 220px", position: "relative" }}>
        <span
          style={{
            position: "absolute",
            left: 12,
            top: "50%",
            transform: "translateY(-50%)",
            color: "var(--text3)",
            display: "flex",
          }}
        >
          <FiSearch size={16} />
        </span>
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search tasks..."
          style={{ paddingLeft: 38 }}
        />
      </div>

      {/* Status filter */}
      <select
        value={filterStatus}
        onChange={(e) => onFilterStatusChange(e.target.value)}
        style={{ flex: "0 1 150px" }}
      >
        <option value="All">All Status</option>
        {STATUSES.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      {/* Priority filter */}
      <select
        value={filterPriority}
        onChange={(e) => onFilterPriorityChange(e.target.value)}
        style={{ flex: "0 1 150px" }}
      >
        <option value="All">All Priority</option>
        {PRIORITIES.map((p) => (
          <option key={p}>{p}</option>
        ))}
      </select>

      {/* Sort chips */}
      <div style={{ display: "flex", gap: 4 }}>
        {sortOptions.map((s) => (
          <button
            key={s.key}
            onClick={() => onSortChange(s.key)}
            style={{
              padding: "6px 12px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              transition: "all 0.2s",
              background:
                sortBy === s.key
                  ? "rgba(99, 102, 241, 0.1)"
                  : "var(--bg3)",
              color: sortBy === s.key ? "var(--accent)" : "var(--text2)",
              fontWeight: sortBy === s.key ? 600 : 400,
            }}
          >
            {s.label}
            {sortBy === s.key && (sortDir === "asc" ? " ↑" : " ↓")}
          </button>
        ))}
      </div>

      {/* New task button */}
      <button className="btn-primary" onClick={onNewTask}>
        <FiPlus size={16} />
        New Task
      </button>
    </div>
  );
};

export default TaskFilters;
