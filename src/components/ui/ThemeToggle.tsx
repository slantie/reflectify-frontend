// src/components/ui/ThemeToggle.tsx
"use client";

import React from "react"; // No need for useState, useEffect here anymore
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils"; // Import the cn utility
import { useTheme } from "@/providers/ThemeProvider"; // Import useTheme hook

function ThemeToggle() {
    const { isDarkMode, toggleTheme } = useTheme(); // Use the hook to get state and toggle function

    // We no longer need `mounted` state here because the `ThemeProvider` handles it
    // and ensures the `useTheme` hook is only called in a mounted context.
    // The logic for displaying a placeholder during SSR is now handled by the ThemeProvider,
    // or `useTheme` will only be called after hydration.

    // If you *still* want a placeholder specifically for the toggle, you can retain this.
    // However, with `ThemeProvider` managing the `document.documentElement.classList`,
    // the initial render of your app's components should already reflect the system theme
    // (or localStorage theme if applied very early in the HTML head), mitigating the need here.

    return (
        <button
            onClick={toggleTheme}
            className={cn(
                "p-2 rounded-lg border-2 transition-colors duration-300",
                "bg-secondary-lighter dark:bg-dark-secondary",
                "border-secondary-light/20 dark:border-dark-secondary/20",
                "hover:border-primary-main dark:hover:border-primary-light"
            )}
            aria-label="Toggle theme"
        >
            {isDarkMode ? (
                <Sun className="w-4 h-4 text-primary-main dark:text-primary-light" />
            ) : (
                <Moon className="w-4 h-4 text-secondary-dark dark:text-dark-text" />
            )}
        </button>
    );
}

export default ThemeToggle;
