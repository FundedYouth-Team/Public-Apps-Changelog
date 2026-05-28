import { useCallback, useEffect, useState } from "react";

export type Theme = "light" | "dark";

const STORAGE_KEY = "fy-theme";

// Read the theme already applied to <html> by the inline no-flash script in index.html.
function getInitialTheme(): Theme {
  if (typeof document !== "undefined" && document.documentElement.classList.contains("dark")) {
    return "dark";
  }
  return "light";
}

/**
 * Class-based dark mode toggle. Persists the user's choice to localStorage and
 * keeps the `.dark` class on <html> in sync. Defaults to the system preference
 * (handled by the inline script in index.html) until the user picks explicitly.
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      /* localStorage may be unavailable (private mode) — ignore */
    }
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }, []);

  return { theme, toggleTheme, isDark: theme === "dark" };
}
