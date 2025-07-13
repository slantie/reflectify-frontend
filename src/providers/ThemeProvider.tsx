/**
 * @file src/providers/ThemeProvider.tsx
 * @description Theme context and provider for dark/light mode
 */

"use client";

import React, { useState, useEffect, createContext, useContext } from "react";

// Theme context type
interface ThemeContextType {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: React.ReactNode;
}

// ThemeProvider for dark/light mode
export function ThemeProvider({ children }: ThemeProviderProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Initialize theme from localStorage or system preference
  useEffect(() => {
    setMounted(true);
    const storedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    const initialMode = storedTheme === "dark" || (!storedTheme && prefersDark);
    setIsDarkMode(initialMode);
    if (initialMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Update theme when isDarkMode changes
  useEffect(() => {
    if (!mounted) return;
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [isDarkMode, mounted]);

  // Toggle theme
  const toggleTheme = () => {
    setIsDarkMode((prevMode) => !prevMode);
  };

  const contextValue = { isDarkMode, toggleTheme };

  // Render children only after mount to prevent hydration mismatches
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}

// Custom hook to use theme context
export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
