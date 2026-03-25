const path = require("path");
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const { errorHandler, notFound } = require("./middleware/errorHandler");
const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

// ── Load environment variables ──
dotenv.config();

// ── Connect to MongoDB ──
connectDB();

const app = express();

// ── Middleware ──
const corsOrigin =
  process.env.NODE_ENV === "production"
    ? process.env.CLIENT_URL || true
    : "http://localhost:3000";
app.use(cors({ origin: corsOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// ── API Routes ──
app.use("/api/auth", authRoutes);
app.use("/api/tasks", taskRoutes);

// ── Health check ──
app.get("/api/health", (req, res) => {
  res.json({ success: true, message: "Task Tracer API is running" });
});

// ── Serve React build in production (after /api routes) ──
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
}

// SPA fallback: never send index.html for unknown /api/* (those should 404 as JSON)
app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api")) return next();
  if (process.env.NODE_ENV === "production") {
    return res.sendFile(path.resolve(__dirname, "../frontend/build", "index.html"));
  }
  next();
});

app.use(notFound);
// ── Error handling ──
app.use(errorHandler);

// ── Start server ──
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n Task Tracer API running on port ${PORT}`);
  console.log(` http://localhost:${PORT}/api/health\n`);
});
