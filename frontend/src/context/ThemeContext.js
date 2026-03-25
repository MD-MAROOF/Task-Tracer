import React, { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within ThemeProvider");
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [dark, setDark] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("tt_dark") || "false");
    } catch {
      return false;
    }
  });

  useEffect(() => {
    localStorage.setItem("tt_dark", JSON.stringify(dark));
    document.body.setAttribute("data-theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = () => setDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ dark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
