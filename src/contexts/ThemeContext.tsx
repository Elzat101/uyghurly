"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "auto";

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("light");
  const [isDark, setIsDark] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem("uyghurly-theme") as Theme;
    if (savedTheme) {
      setThemeState(savedTheme);
    } else {
      // Check system preference
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setThemeState(systemPrefersDark ? "dark" : "light");
    }
  }, []);

  // Update theme and apply to document
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("uyghurly-theme", newTheme);
  };

  // Apply theme to document
  useEffect(() => {
    const root = document.documentElement;

    if (theme === "auto") {
      const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDark(systemPrefersDark);
      root.classList.toggle("dark", systemPrefersDark);
    } else {
      const shouldBeDark = theme === "dark";
      setIsDark(shouldBeDark);
      root.classList.toggle("dark", shouldBeDark);
    }
  }, [theme]);

  // Listen for system theme changes when in auto mode
  useEffect(() => {
    if (theme === "auto") {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e: MediaQueryListEvent) => {
        setIsDark(e.matches);
        document.documentElement.classList.toggle("dark", e.matches);
      };

      mediaQuery.addEventListener("change", handleChange);
      return () => mediaQuery.removeEventListener("change", handleChange);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
