import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

const Login = () => {
  const { login, signup, loading } = useAuth();
  const { dark, toggleTheme } = useTheme();

  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Client-side validation
    if (!form.email.includes("@") || !form.email.includes(".")) {
      return setError("Enter a valid email address");
    }
    if (form.password.length < 6) {
      return setError("Password must be at least 6 characters");
    }
    if (!isLogin && !form.name.trim()) {
      return setError("Name is required");
    }

    const result = isLogin
      ? await login({ email: form.email, password: form.password })
      : await signup(form);

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        transition: "background 0.3s",
      }}
    >
      {/* Theme toggle */}
      <div style={{ position: "absolute", top: 20, right: 20 }}>
        <button className="btn-icon" onClick={toggleTheme}>
          {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: 420 }} className="fade-in">
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "var(--accent)",
              letterSpacing: "-2px",
              fontFamily: "'Playfair Display', serif",
            }}
          >
            TaskTracer
          </div>
          <p style={{ color: "var(--text2)", marginTop: 8, fontSize: 15 }}>
            Manage your work. Track your progress.
          </p>
        </div>

        {/* Form card */}
        <div className="card" style={{ padding: "36px 32px" }}>
          <h2
            style={{
              margin: "0 0 24px",
              fontSize: 22,
              fontWeight: 700,
              color: "var(--text)",
            }}
          >
            {isLogin ? "Welcome back" : "Create account"}
          </h2>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div style={{ marginBottom: 16 }}>
                <label className="form-label">Full Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                />
              </div>
            )}

            <div style={{ marginBottom: 16 }}>
              <label className="form-label">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label className="form-label">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  color: "#dc2626",
                  padding: "10px 14px",
                  borderRadius: 10,
                  fontSize: 13,
                  marginBottom: 16,
                  border: "1px solid #fecaca",
                }}
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%" }}
            >
              {loading
                ? "Please wait..."
                : isLogin
                ? "Sign In"
                : "Create Account"}
            </button>
          </form>

          <p
            style={{
              textAlign: "center",
              marginTop: 20,
              fontSize: 14,
              color: "var(--text2)",
            }}
          >
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              style={{
                background: "none",
                border: "none",
                color: "var(--accent)",
                cursor: "pointer",
                fontWeight: 600,
                fontSize: 14,
                padding: 0,
              }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
