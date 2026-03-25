import React, { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api";

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tt_user") || "null");
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  // Persist user to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem("tt_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("tt_user");
    }
  }, [user]);

  const signup = async ({ name, email, password }) => {
    setLoading(true);
    try {
      const { data } = await authAPI.signup({ name, email, password });
      // API: { success, data: { _id, name, email, token } }
      setUser(data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Signup failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const { data } = await authAPI.login({ email, password });
      setUser(data.data);
      return { success: true };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
