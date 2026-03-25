import axios from "axios";

const API = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: attach JWT token ──
API.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem("tt_user") || "null");
    if (user?.token) {
      config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: handle 401 ──
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("tt_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ── Auth API ──
export const authAPI = {
  signup: (data) => API.post("/auth/signup", data),
  login: (data) => API.post("/auth/login", data),
  getMe: () => API.get("/auth/me"),
};

// ── Tasks API ──
export const tasksAPI = {
  getAll: (params) => API.get("/tasks", { params }),
  getOne: (id) => API.get(`/tasks/${id}`),
  create: (data) => API.post("/tasks", data),
  update: (id, data) => API.put(`/tasks/${id}`, data),
  delete: (id) => API.delete(`/tasks/${id}`),
  toggle: (id) => API.patch(`/tasks/${id}/toggle`),
  analytics: () => API.get("/tasks/analytics"),
};

export default API;
