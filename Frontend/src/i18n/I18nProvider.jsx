import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { translations } from "./translations";

const STORAGE_KEY = "travel_ai_language";
const SUPPORTED_LANGUAGES = ["vi", "en"];

const I18nContext = createContext(null);

function getStoredLanguage() {
  if (typeof window === "undefined") return "vi";
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return SUPPORTED_LANGUAGES.includes(stored) ? stored : "vi";
}

function getByPath(source, path) {
  return String(path)
    .split(".")
    .reduce((value, key) => (value && Object.prototype.hasOwnProperty.call(value, key) ? value[key] : undefined), source);
}

function interpolate(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}

export function I18nProvider({ children }) {
  const [language, setLanguageState] = useState(getStoredLanguage);

  const setLanguage = useCallback((nextLanguage) => {
    const normalized = SUPPORTED_LANGUAGES.includes(nextLanguage) ? nextLanguage : "vi";
    setLanguageState(normalized);
    window.localStorage.setItem(STORAGE_KEY, normalized);
  }, []);

  const toggleLanguage = useCallback(() => {
    setLanguage(language === "vi" ? "en" : "vi");
  }, [language, setLanguage]);

  const t = useCallback(
    (key, params) => {
      const value =
        getByPath(translations[language], key) ??
        getByPath(translations.vi, key) ??
        getByPath(translations.en, key) ??
        key;

      return typeof value === "string" ? interpolate(value, params) : key;
    },
    [language],
  );

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo(
    () => ({ language, setLanguage, toggleLanguage, t }),
    [language, setLanguage, toggleLanguage, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used inside I18nProvider");
  }
  return context;
}
