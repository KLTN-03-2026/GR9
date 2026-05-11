import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "travel_ai_theme_mode";
const THEME_MODES = ["light", "dark"];
const ThemeContext = createContext(null);

function getStoredMode() {
  if (typeof window === "undefined") return "light";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return THEME_MODES.includes(stored) ? stored : "light";
}

function applyThemeMode(mode) {
  const root = document.documentElement;
  root.classList.add("theme-changing");
  root.classList.toggle("dark", mode === "dark");
  root.style.colorScheme = mode === "dark" ? "dark" : "light";

  window.setTimeout(() => {
    root.classList.remove("theme-changing");
  }, 120);
}

export function ThemeProvider({ children }) {
  const [themeMode, setThemeModeState] = useState(getStoredMode);

  const setThemeMode = useCallback((mode) => {
    const nextMode = THEME_MODES.includes(mode) ? mode : "light";
    setThemeModeState(nextMode);
    window.localStorage.setItem(STORAGE_KEY, nextMode);
    applyThemeMode(nextMode);
  }, []);

  const toggleThemeMode = useCallback(() => {
    setThemeMode(themeMode === "dark" ? "light" : "dark");
  }, [setThemeMode, themeMode]);

  useEffect(() => {
    applyThemeMode(themeMode);
  }, [themeMode]);

  const value = useMemo(
    () => ({
      isDark: themeMode === "dark",
      themeMode,
      setThemeMode,
      toggleThemeMode,
    }),
    [setThemeMode, themeMode, toggleThemeMode],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }
  return context;
}
