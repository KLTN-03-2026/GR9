import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { I18nProvider } from "./i18n/I18nProvider.jsx";
import { ThemeProvider } from "./theme/ThemeProvider.jsx";

const storedThemeMode = window.localStorage.getItem("travel_ai_theme_mode");
document.documentElement.classList.toggle("dark", storedThemeMode === "dark");
document.documentElement.style.colorScheme = storedThemeMode === "dark" ? "dark" : "light";

createRoot(document.getElementById("root")).render(
    <ThemeProvider>
        <I18nProvider>
            <App />
        </I18nProvider>
    </ThemeProvider>,
);
