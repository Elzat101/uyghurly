"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type FontSize = "small" | "medium" | "large";

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
  getFontSizeValue: () => number;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");

  // Initialize font size from AsyncStorage
  useEffect(() => {
    const loadFontSize = async () => {
      try {
        const savedFontSize = await AsyncStorage.getItem(
          "uyghurly-font-size"
        ) as FontSize;
        if (savedFontSize && ["small", "medium", "large"].includes(savedFontSize)) {
          setFontSizeState(savedFontSize);
        }
      } catch (error) {
        console.error("Error loading font size:", error);
      }
    };

    loadFontSize();
  }, []);

  // Update font size and save to AsyncStorage
  const setFontSize = async (newFontSize: FontSize) => {
    setFontSizeState(newFontSize);
    try {
      await AsyncStorage.setItem("uyghurly-font-size", newFontSize);
    } catch (error) {
      console.error("Error saving font size:", error);
    }
  };

  // Get numeric font size value for React Native styles
  const getFontSizeValue = () => {
    switch (fontSize) {
      case "small":
        return 14;
      case "medium":
        return 16;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize, getFontSizeValue }}>
      {children}
    </FontSizeContext.Provider>
  );
}

export function useFontSize() {
  const context = useContext(FontSizeContext);
  if (context === undefined) {
    throw new Error("useFontSize must be used within a FontSizeProvider");
  }
  return context;
}
