const { validationResult } = require("express-validator");
const Task = require("../models/Task");

// @description    Create a new task
// @route   POST /api/tasks

const createTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    const task = await Task.create({
      ...req.body,
      user: req.user._id,
    });

    res.status(201).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all tasks for logged-in user (with filtering, search, sort, pagination)
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const {
      status,
      priority,
      search,
      sortBy = "dueDate",
      sortDir = "asc",
      page = 1,
      limit = 10,
    } = req.query;

    // Build query filter
    const filter = { user: req.user._id };

    if (status && status !== "All") {
      filter.status = status;
    }

    if (priority && priority !== "All") {
      filter.priority = priority;
    }

    if (search) {
      filter.title = { $regex: search, $options: "i" };
    }

    const allowedSortFields = ["dueDate", "priority", "title", "createdAt"];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "dueDate";

    // Pagination
    const pageNum = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip = (pageNum - 1) * limitNum;

    const sortOrder = sortDir === "desc" ? -1 : 1;

    // String sort on priority gives High, Low, Medium — use numeric rank instead
    const priorityRankExpr = {
      $switch: {
        branches: [
          { case: { $eq: ["$priority", "High"] }, then: 3 },
          { case: { $eq: ["$priority", "Medium"] }, then: 2 },
          { case: { $eq: ["$priority", "Low"] }, then: 1 },
        ],
        default: 0,
      },
    };

    const tasksPromise =
      sortField === "priority"
        ? Task.aggregate([
            { $match: filter },
            { $addFields: { priorityRank: priorityRankExpr } },
            {
              $sort: {
                priorityRank: sortOrder,
                dueDate: 1,
                title: 1,
              },
            },
            { $skip: skip },
            { $limit: limitNum },
            { $project: { priorityRank: 0 } },
          ])
        : Task.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limitNum)
            .lean();

    const [tasks, total] = await Promise.all([
      tasksPromise,
      Task.countDocuments(filter),
    ]);

    res.status(200).json({
      success: true,
      data: tasks,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        message: errors.array()[0].msg,
        errors: errors.array(),
      });
    }

    let task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle task completion (mark as Done / reopen)
// @route   PATCH /api/tasks/:id/toggle
// @access  Private
const toggleTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    task.status = task.status === "Done" ? "Todo" : "Done";
    await task.save();

    res.status(200).json({
      success: true,
      data: task,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task analytics for the user
// @route   GET /api/tasks/analytics
// @access  Private
const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Aggregate stats in a single query
    const [stats] = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "Done"] }, 1, 0] },
          },
          todo: {
            $sum: { $cond: [{ $eq: ["$status", "Todo"] }, 1, 0] },
          },
          inProgress: {
            $sum: {
              $cond: [{ $eq: ["$status", "In Progress"] }, 1, 0],
            },
          },
          highPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "High"] }, 1, 0] },
          },
          mediumPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "Medium"] }, 1, 0] },
          },
          lowPriority: {
            $sum: { $cond: [{ $eq: ["$priority", "Low"] }, 1, 0] },
          },
        },
      },
    ]);

    const result = stats || {
      total: 0,
      completed: 0,
      todo: 0,
      inProgress: 0,
      highPriority: 0,
      mediumPriority: 0,
      lowPriority: 0,
    };

    result.pending = result.total - result.completed;
    result.completionPercentage =
      result.total > 0
        ? Math.round((result.completed / result.total) * 100)
        : 0;

    // Weekly activity (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const weeklyActivity = await Task.aggregate([
      {
        $match: {
          user: userId,
          createdAt: { $gte: sevenDaysAgo },
        },
      },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$createdAt" },
          },
          created: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "Done"] }, 1, 0] },
          },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        ...result,
        weeklyActivity,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTask,
  getTasks,
  getTask,
  updateTask,
  deleteTask,
  toggleTask,
  getAnalytics,
};
