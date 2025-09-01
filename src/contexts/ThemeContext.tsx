"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

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
  const colorScheme = useColorScheme();

  // Initialize theme from AsyncStorage or system preference
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("uyghurly-theme") as Theme;
        if (savedTheme) {
          setThemeState(savedTheme);
        } else {
          // Check system preference
          const systemPrefersDark = colorScheme === 'dark';
          setThemeState(systemPrefersDark ? "dark" : "light");
        }
      } catch (error) {
        console.error("Error loading theme:", error);
        // Fallback to system preference
        const systemPrefersDark = colorScheme === 'dark';
        setThemeState(systemPrefersDark ? "dark" : "light");
      }
    };

    loadTheme();
  }, [colorScheme]);

  // Update theme and save to AsyncStorage
  const setTheme = async (newTheme: Theme) => {
    setThemeState(newTheme);
    try {
      await AsyncStorage.setItem("uyghurly-theme", newTheme);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  // Apply theme based on current setting
  useEffect(() => {
    if (theme === "auto") {
      const systemPrefersDark = colorScheme === 'dark';
      setIsDark(systemPrefersDark);
    } else {
      const shouldBeDark = theme === "dark";
      setIsDark(shouldBeDark);
    }
  }, [theme, colorScheme]);

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
