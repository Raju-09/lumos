"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider, ThemeProviderProps } from "next-themes"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
    React.useEffect(() => {
        // Force apply theme on mount
        const theme = localStorage.getItem('lumos-theme') || props.defaultTheme || 'dark';
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
    }, []);

    return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}
