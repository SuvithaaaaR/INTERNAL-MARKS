import React, { createContext, useState, useContext, useEffect } from "react";

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
  const [colorScheme, setColorScheme] = useState(() => {
    return localStorage.getItem("color-scheme") || "light";
  });

  useEffect(() => {
    localStorage.setItem("color-scheme", colorScheme);
    document.documentElement.setAttribute(
      "data-mantine-color-scheme",
      colorScheme,
    );
  }, [colorScheme]);

  const toggleColorScheme = () => {
    setColorScheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  return (
    <ThemeContext.Provider value={{ colorScheme, toggleColorScheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeContext must be used within a ThemeProvider");
  }
  return context;
};
