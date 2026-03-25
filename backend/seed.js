const mongoose = require("mongoose");
const dotenv = require("dotenv");
const User = require("./models/User");
const Task = require("./models/Task");

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(" Connected to MongoDB");

    // Clear existing data
    await User.deleteMany({});
    await Task.deleteMany({});
    console.log(" Cleared existing data");

    // Create demo user
    const user = await User.create({
      name: "Demo User",
      email: "demo@tasktracer.com",
      password: "password123",
    });
    console.log(" Created demo user: demo@tasktracer.com / password123");

    // Create sample tasks
    const tasks = [
      {
        title: "Set up project repository",
        description: "Initialize Git repo, add README, and configure CI/CD pipeline",
        status: "Done",
        priority: "High",
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
      {
        title: "Design database schema",
        description: "Create MongoDB schemas for Users and Tasks with proper indexing",
        status: "Done",
        priority: "High",
        dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
      {
        title: "Implement authentication",
        description: "JWT-based signup and login with bcrypt password hashing",
        status: "In Progress",
        priority: "High",
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
      {
        title: "Build task CRUD API",
        description: "Create, Read, Update, Delete endpoints for tasks",
        status: "In Progress",
        priority: "Medium",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
      {
        title: "Create React frontend",
        description: "Build responsive UI with task list, forms, and dashboard",
        status: "Todo",
        priority: "High",
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
      {
        title: "Add filtering and search",
        description: "Filter by status, priority and search by title",
        status: "Todo",
        priority: "Medium",
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
      {
        title: "Build analytics dashboard",
        description: "Charts showing task completion, priority distribution, weekly trends",
        status: "Todo",
        priority: "Medium",
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
      {
        title: "Add dark mode support",
        description: "Implement theme toggle with CSS variables",
        status: "Todo",
        priority: "Low",
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
      {
        title: "Write unit tests",
        description: "Test API endpoints and React components",
        status: "Todo",
        priority: "Low",
        dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
      {
        title: "Deploy to production",
        description: "Deploy backend to Render and frontend to Vercel",
        status: "Todo",
        priority: "Medium",
        dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        user: user._id,
      },
    ];

    await Task.insertMany(tasks);
    console.log(` Created ${tasks.length} sample tasks`);

    console.log("\n🎉 Seed complete! You can now login with:");
    console.log("   Email:    demo@tasktracer.com");
    console.log("   Password: password123\n");

    process.exit(0);
  } catch (error) {
    console.error(" Seed failed:", error.message);
    process.exit(1);
  }
};

seedData();
