const express = require("express");
const { body } = require("express-validator");
const {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
  getAnalytics,
} = require("../controllers/taskController");
const { protect } = require("../middleware/auth");

const router = express.Router();

// All routes below require authentication
router.use(protect);

// Task validation rules
const taskValidation = [
  body("title").trim().notEmpty().withMessage("Task title is required"),
  body("status")
    .optional()
    .isIn(["Todo", "In Progress", "Done"])
    .withMessage("Status must be Todo, In Progress, or Done"),
  body("priority")
    .optional()
    .isIn(["Low", "Medium", "High"])
    .withMessage("Priority must be Low, Medium, or High"),
  body("dueDate").notEmpty().withMessage("Due date is required"),
];

// GET  /api/tasks/analytics — Must be before /:id route
router.get("/analytics", getAnalytics);

// GET  /api/tasks          — List all tasks (with filters, search, pagination)
// POST /api/tasks          — Create a task
router.route("/").get(getTasks).post(taskValidation, createTask);

// GET    /api/tasks/:id       — Get single task
// PUT    /api/tasks/:id       — Update a task
// DELETE /api/tasks/:id       — Delete a task
router.route("/:id").get(getTask).put(taskValidation, updateTask).delete(deleteTask);

// PATCH  /api/tasks/:id/toggle — Toggle task completion
router.patch("/:id/toggle", toggleTask);

module.exports = router;
