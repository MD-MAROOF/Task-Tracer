import React from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const Pagination = ({ page, totalPages, total, from, to, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div style={{ marginTop: 28 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 8,
        }}
      >
        <button
          className="btn-icon"
          onClick={() => onPageChange(page - 1)}
          disabled={page === 1}
          style={{ opacity: page === 1 ? 0.3 : 1 }}
        >
          <FiChevronLeft size={16} />
        </button>

        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              border: "none",
              cursor: "pointer",
              fontSize: 14,
              fontWeight: page === i + 1 ? 700 : 400,
              background: page === i + 1 ? "var(--accent)" : "var(--bg3)",
              color: page === i + 1 ? "#fff" : "var(--text2)",
              transition: "all 0.2s",
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            {i + 1}
          </button>
        ))}

        <button
          className="btn-icon"
          onClick={() => onPageChange(page + 1)}
          disabled={page === totalPages}
          style={{ opacity: page === totalPages ? 0.3 : 1 }}
        >
          <FiChevronRight size={16} />
        </button>
      </div>

      <div
        style={{
          textAlign: "center",
          marginTop: 12,
          fontSize: 13,
          color: "var(--text3)",
        }}
      >
        Showing {from}–{to} of {total} tasks
      </div>
    </div>
  );
};

export default Pagination;
