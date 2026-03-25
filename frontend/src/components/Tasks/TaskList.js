import React, { useState, useEffect, useCallback } from "react";
import { tasksAPI } from "../../utils/api";
import { ITEMS_PER_PAGE } from "../../utils/constants";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import TaskFilters from "./TaskFilters";
import Pagination from "./Pagination";
import Loader from "../Common/Loader";
import EmptyState from "../Common/EmptyState";
import ConfirmDialog from "../Common/ConfirmDialog";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Filters & Search
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("dueDate");
  const [sortDir, setSortDir] = useState("asc");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });

  // Modals
  const [modal, setModal] = useState(null); // null | "new" | task object
  const [deleteId, setDeleteId] = useState(null);

  // ── Fetch tasks ──
  const fetchTasks = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        limit: ITEMS_PER_PAGE,
        sortBy,
        sortDir,
      };
      if (search) params.search = search;
      if (filterStatus !== "All") params.status = filterStatus;
      if (filterPriority !== "All") params.priority = filterPriority;

      const { data } = await tasksAPI.getAll(params);
      // Backend: { success, data: tasks[], pagination }
      setTasks(Array.isArray(data.data) ? data.data : []);
      setPagination(
        data.pagination ?? { total: 0, pages: 1, page: 1, limit: ITEMS_PER_PAGE }
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch tasks");
    } finally {
      setLoading(false);
    }
  }, [page, search, filterStatus, filterPriority, sortBy, sortDir]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Reset page when filters change
  useEffect(() => {
    setPage(1);
  }, [search, filterStatus, filterPriority, sortBy, sortDir]);

  // ── Create or Update task ──
  const handleSave = async (formData) => {
    try {
      setSaving(true);
      if (modal && modal._id) {
        await tasksAPI.update(modal._id, formData);
      } else {
        await tasksAPI.create(formData);
      }
      setModal(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to save task");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete task ──
  const handleDelete = async () => {
    try {
      await tasksAPI.delete(deleteId);
      setDeleteId(null);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete task");
    }
  };

  // ── Toggle complete ──
  const handleToggle = async (task) => {
    try {
      await tasksAPI.toggle(task._id);
      fetchTasks();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update task");
    }
  };

  // ── Sort toggle ──
  const handleSortChange = (field) => {
    if (sortBy === field) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortBy(field);
      // Priority: default to high → Low (desc on rank); Date/Title: ascending
      setSortDir(field === "priority" ? "desc" : "asc");
    }
  };

  const from = Math.min(pagination.total, (page - 1) * ITEMS_PER_PAGE + 1);
  const to = Math.min(pagination.total, page * ITEMS_PER_PAGE);

  return (
    <div className="fade-in">
      {/* Filters toolbar */}
      <TaskFilters
        search={search}
        onSearchChange={setSearch}
        filterStatus={filterStatus}
        onFilterStatusChange={setFilterStatus}
        filterPriority={filterPriority}
        onFilterPriorityChange={setFilterPriority}
        sortBy={sortBy}
        sortDir={sortDir}
        onSortChange={handleSortChange}
        onNewTask={() => setModal("new")}
      />

      {/* Error state */}
      {error && (
        <div
          style={{
            background: "#fef2f2",
            color: "#dc2626",
            padding: "12px 16px",
            borderRadius: 12,
            fontSize: 14,
            marginBottom: 20,
            border: "1px solid #fecaca",
          }}
        >
          {error}{" "}
          <button
            onClick={fetchTasks}
            style={{
              background: "none",
              border: "none",
              color: "#dc2626",
              fontWeight: 600,
              cursor: "pointer",
              textDecoration: "underline",
            }}
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading state */}
      {loading ? (
        <Loader text="Loading tasks..." />
      ) : tasks.length === 0 ? (
        <EmptyState
          title={
            pagination.total === 0
              ? "No tasks yet. Create your first task!"
              : "No tasks match your filters."
          }
          subtitle={
            pagination.total === 0
              ? "Click 'New Task' to get started"
              : "Try adjusting your search or filters"
          }
        />
      ) : (
        <>
          {/* Task list */}
          <div style={{ display: "grid", gap: 12 }}>
            {tasks.map((task) => (
              <TaskCard
                key={task._id}
                task={task}
                onEdit={(t) => setModal(t)}
                onDelete={(id) => setDeleteId(id)}
                onToggle={handleToggle}
              />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            page={page}
            totalPages={pagination.pages}
            total={pagination.total}
            from={from}
            to={to}
            onPageChange={setPage}
          />
        </>
      )}

      {/* Task Modal */}
      {modal && (
        <TaskModal
          task={modal === "new" ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
          loading={saving}
        />
      )}

      {/* Delete Confirm */}
      {deleteId && (
        <ConfirmDialog
          emoji="🗑️"
          title="Delete Task?"
          message="This action cannot be undone."
          confirmLabel="Delete"
          onConfirm={handleDelete}
          onCancel={() => setDeleteId(null)}
          danger
        />
      )}
    </div>
  );
};

export default TaskList;
