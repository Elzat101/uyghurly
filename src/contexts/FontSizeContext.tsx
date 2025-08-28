"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type FontSize = "small" | "medium" | "large";

interface FontSizeContextType {
  fontSize: FontSize;
  setFontSize: (fontSize: FontSize) => void;
}

const FontSizeContext = createContext<FontSizeContextType | undefined>(
  undefined
);

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
  const [fontSize, setFontSizeState] = useState<FontSize>("medium");

  // Initialize font size from localStorage
  useEffect(() => {
    const savedFontSize = localStorage.getItem(
      "uyghurly-font-size"
    ) as FontSize;
    if (savedFontSize && ["small", "medium", "large"].includes(savedFontSize)) {
      setFontSizeState(savedFontSize);
    }
  }, []);

  // Update font size and apply to document
  const setFontSize = (newFontSize: FontSize) => {
    setFontSizeState(newFontSize);
    localStorage.setItem("uyghurly-font-size", newFontSize);

    // Apply font size to document
    const root = document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");

    switch (newFontSize) {
      case "small":
        root.classList.add("text-sm");
        break;
      case "medium":
        root.classList.add("text-base");
        break;
      case "large":
        root.classList.add("text-lg");
        break;
    }
  };

  // Apply font size to document on mount and when fontSize changes
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("text-sm", "text-base", "text-lg");

    switch (fontSize) {
      case "small":
        root.classList.add("text-sm");
        break;
      case "medium":
        root.classList.add("text-base");
        break;
      case "large":
        root.classList.add("text-lg");
        break;
    }
  }, [fontSize]);

  return (
    <FontSizeContext.Provider value={{ fontSize, setFontSize }}>
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
