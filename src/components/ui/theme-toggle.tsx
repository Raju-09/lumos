"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
        setMounted(true)
        // Force apply theme to html element
        const applyTheme = (newTheme: string) => {
            const root = document.documentElement;
            root.classList.remove('light', 'dark');
            root.classList.add(newTheme);
        };
        
        // Apply current theme on mount
        if (theme) {
            applyTheme(theme);
        }
    }, [theme])

    const handleToggle = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        
        // Immediately apply to html element for instant feedback
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newTheme);
        
        // Also update localStorage directly for persistence
        localStorage.setItem('theme', newTheme);
    }

    if (!mounted) {
        return (
            <button className="w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800">
                <Sun className="h-4 w-4 text-gray-400 dark:text-gray-500" />
            </button>
        )
    }

    return (
        <button
            onClick={handleToggle}
            className="relative w-9 h-9 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-800 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
        >
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-orange-500" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-blue-500" />
            <span className="sr-only">Toggle theme</span>
        </button>
    )
}
