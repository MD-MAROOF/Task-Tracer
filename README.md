# TaskTracer — Task Management System

A full-stack Task Management Web App built with **React**, **Node.js + Express**, and **MongoDB**.

---

## Features

- **Authentication** — Signup / Login with JWT tokens and bcrypt password hashing
- **Task CRUD** — Create, view, update, delete tasks with title, description, status, priority, due date
- **Mark Complete** — One-click toggle between Done / Todo
- **Filtering** — Filter tasks by status (Todo / In Progress / Done) and priority (Low / Medium / High)
- **Search** — Search tasks by title (case-insensitive)
- **Sorting** — Sort by due date, priority, or title (asc / desc)
- **Pagination** — Server-side pagination (6 tasks per page)
- **Analytics Dashboard** — Stats cards, completion ring, pie chart, bar chart, weekly activity line chart
- **Dark Mode** — Toggle between light and dark themes
- **Responsive Design** — Works on desktop, tablet, and mobile
- **Error Handling** — Global error middleware, validation errors, loading & error states in UI
- **Optimized Queries** — MongoDB indexes on user, status, priority, dueDate, and text search

---

## Tech Stack

| Layer      | Technology                          |
| ---------- | ----------------------------------- |
| Frontend   | React 18, Recharts, React Icons, Axios |
| Backend    | Node.js, Express.js                 |
| Database   | MongoDB + Mongoose                  |
| Auth       | JWT (jsonwebtoken) + bcryptjs       |
| Validation | express-validator                   |

---

## Project Structure

```
task-tracer/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js    # Signup, Login, GetMe
│   │   └── taskController.js    # CRUD, Toggle, Analytics
│   ├── middleware/
│   │   ├── auth.js              # JWT verification middleware
│   │   └── error.js             # Global error handler + 404
│   ├── models/
│   │   ├── User.js              # User schema (bcrypt, JWT)
│   │   └── Task.js              # Task schema (indexed)
│   ├── routes/
│   │   ├── auth.js              # Auth routes + validation
│   │   └── tasks.js             # Task routes + validation
│   ├── .env                     # Environment variables
│   ├── package.json
│   ├── seed.js                  # Sample data seeder
│   └── server.js                # Express app entry point
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Analytics/
│   │   │   │   └── Analytics.js       # Charts + stats dashboard
│   │   │   ├── Auth/
│   │   │   │   └── Login.js           # Login / Signup form
│   │   │   ├── Common/
│   │   │   │   ├── ConfirmDialog.js   # Delete confirmation modal
│   │   │   │   ├── EmptyState.js      # Empty state placeholder
│   │   │   │   └── Loader.js          # Loading spinner
│   │   │   ├── Dashboard/
│   │   │   │   └── Dashboard.js       # Main authenticated layout
│   │   │   ├── Layout/
│   │   │   │   └── Header.js          # Navbar with theme toggle
│   │   │   └── Tasks/
│   │   │       ├── TaskCard.js        # Individual task card
│   │   │       ├── TaskFilters.js     # Search + filter toolbar
│   │   │       ├── TaskList.js        # Task list page container
│   │   │       ├── TaskModal.js       # Create / Edit form modal
│   │   │       └── Pagination.js      # Page navigation
│   │   ├── context/
│   │   │   ├── AuthContext.js         # Auth state + API calls
│   │   │   └── ThemeContext.js        # Dark mode state
│   │   ├── styles/
│   │   │   └── index.css             # Global styles + CSS vars
│   │   ├── utils/
│   │   │   ├── api.js                # Axios instance + interceptors
│   │   │   └── constants.js          # Colors, statuses, config
│   │   ├── App.js                    # Root component
│   │   └── index.js                  # React entry point
│   └── package.json
│
├── .gitignore
├── package.json                      # Root scripts (concurrently)
└── README.md
```

---

## Prerequisites

Make sure you have installed:

- **Node.js** (v16 or higher) — https://nodejs.org
- **MongoDB** (v6 or higher) — https://www.mongodb.com/try/download/community
  - _Or use MongoDB Atlas (free cloud):_ https://www.mongodb.com/atlas

---

## How to Run

### 1. Clone / Download the project

```bash
cd task-tracer
```

### 2. Configure environment variables

Edit `backend/.env` and update if needed:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/tasktracer
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
NODE_ENV=development
```

> If using **MongoDB Atlas**, replace `MONGODB_URI` with your connection string.

### 3. Install all dependencies

```bash
# From the root folder — installs both backend & frontend
npm install
npm run install-all
```

Or install individually:

```bash
cd backend && npm install
cd ../frontend && npm install
cd ..
```

### 4. Start MongoDB

Make sure MongoDB is running locally:

```bash
# macOS (Homebrew)
brew services start mongodb-community

# Ubuntu
sudo systemctl start mongod

# Windows
net start MongoDB


This creates a demo user (`demo@tasktracer.com` / `password123`) with 10 sample tasks.

### 6. Run the application

```bash
# From the root folder — starts both backend (port 5000) & frontend (port 3000)
npm run dev
```

Or run them in separate terminals:

```bash
# Terminal 1 — Backend
cd backend
npm run dev

# Terminal 2 — Frontend
cd frontend
npm start
```

### 7. Open in browser

Go to **http://localhost:3000**

---

## API Endpoints

### Auth

| Method | Endpoint          | Description       | Auth |
| ------ | ----------------- | ----------------- | ---- |
| POST   | `/api/auth/signup` | Register new user | No   |
| POST   | `/api/auth/login`  | Login user        | No   |
| GET    | `/api/auth/me`     | Get current user  | Yes  |

### Tasks

| Method | Endpoint                  | Description          | Auth |
| ------ | ------------------------- | -------------------- | ---- |
| GET    | `/api/tasks`              | Get all tasks        | Yes  |
| GET    | `/api/tasks/:id`          | Get single task      | Yes  |
| POST   | `/api/tasks`              | Create task          | Yes  |
| PUT    | `/api/tasks/:id`          | Update task          | Yes  |
| DELETE | `/api/tasks/:id`          | Delete task          | Yes  |
| PATCH  | `/api/tasks/:id/toggle`   | Toggle complete      | Yes  |
| GET    | `/api/tasks/analytics`    | Get task analytics   | Yes  |


---


## Design Decisions

### Architecture: MVC Pattern

The backend follows the **Model-View-Controller** pattern for clear separation of concerns:

- **Models** (`models/`) define Mongoose schemas with validation rules, pre-save hooks (password hashing), and instance methods (token generation, password comparison). Indexes are defined at the schema level for query optimization.
- **Controllers** (`controllers/`) contain all business logic — separated into `authController` and `taskController`. Each function handles one responsibility and passes errors to the global middleware via `next(error)`.
- **Routes** (`routes/`) are thin — they only wire HTTP methods to controllers and attach validation/middleware. Input validation uses `express-validator` at the route level so controllers receive clean data.

### Authentication: JWT + bcrypt

JWT was chosen over session-based auth because it's stateless — the server doesn't need to store session data, which simplifies horizontal scaling. Tokens are sent in the `Authorization: Bearer <token>` header. Passwords are hashed with bcrypt (12 salt rounds) and the `password` field uses `select: false` in Mongoose so it's never accidentally returned in queries.

### Database: MongoDB 

MongoDB was chosen for its flexible schema and natural fit with JSON/JavaScript. The Task model has compound indexes on frequently queried field combinations:

- `{ user: 1, status: 1 }` — for filtering a user's tasks by status
- `{ user: 1, priority: 1 }` — for filtering by priority
- `{ user: 1, dueDate: 1 }` — for sorting by due date
- `{ user: 1, title: "text" }` — for text search on task titles
- `{ assignedTo: 1 }` and `{ collaborators: 1 }` — for collaboration queries

These indexes ensure that filtering, sorting, and pagination happen at the database level rather than in application code, even as the dataset grows.

### Collaboration: Assign + Collaborate Model

Rather than building a full team/workspace system (which would be overkill for a mini project), collaboration is implemented through two fields on each task:

- **`assignedTo`** — a single user who is responsible for the task
- **`collaborators`** — an array of users who can view and update the task's status

The task **owner** (creator) has full control — they can edit all fields, reassign, and delete. **Assignees and collaborators** can only update the task's status (Todo → In Progress → Done), which prevents accidental overwrites while still enabling progress tracking. User search is debounced on the frontend to avoid excessive API calls.

### Error Handling: Global Middleware

Instead of try-catch in every route, a single `errorHandler` middleware catches all errors. It detects error types (Mongoose validation, duplicate keys, bad ObjectIds, JWT issues) and returns consistent JSON responses. This approach keeps controller code clean and ensures users never see raw stack traces in production.

### Frontend: Component Architecture

The React frontend is organized by feature rather than by file type:

- `components/Auth/` — login/signup flow
- `components/Tasks/` — task list, card, modal, filters, pagination
- `components/Analytics/` — charts and stats dashboard
- `components/Common/` — reusable UI (loader, empty state, confirm dialog)
- `context/` — AuthContext (user state + API) and ThemeContext (dark mode)
- `utils/` — Axios instance with interceptors, shared constants

State management uses React Context instead of Redux because the app has only two pieces of global state (auth and theme). Task data is fetched per-page and doesn't need global caching. The Axios instance has request interceptors to attach JWT tokens and response interceptors to handle 401s (auto-logout on expired tokens).

### Dark Mode: CSS Variables

Theming is implemented through CSS custom properties on the `:root` and `[data-theme="dark"]` selectors. Every component references these variables instead of hardcoded colors, so toggling the theme is a single `data-theme` attribute change on `<body>`. The preference persists in localStorage.

### Deployment: Single-Service Architecture

For production, the Express server serves the React build as static files (via `express.static`). This means the entire app runs as one Render Web Service instead of two separate deployments. The `*` catch-all route sends `index.html` for any non-API path, enabling React Router's client-side routing.

---