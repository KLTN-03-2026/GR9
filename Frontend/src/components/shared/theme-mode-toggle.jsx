import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/theme/ThemeProvider";

export default function ThemeModeToggle({ className = "" }) {
  const { isDark, toggleThemeMode } = useTheme();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleThemeMode}
      title={isDark ? "Chuyển sang giao diện sáng" : "Chuyển sang giao diện tối"}
      className={`relative h-10 w-[74px] shrink-0 overflow-hidden rounded-full border-outline-variant/35 bg-surface-container-lowest p-1 shadow-sm transition-all hover:shadow-md ${className}`}
    >
      <span
        className={`absolute left-1 top-1 h-8 w-8 rounded-full bg-primary shadow-lg shadow-primary/20 transition-transform duration-300 ${
          isDark ? "translate-x-[34px]" : "translate-x-0"
        }`}
      />
      <span className="relative z-10 grid h-8 w-full grid-cols-2 items-center">
        <span
          className={`flex h-8 w-8 items-center justify-center transition-colors ${
            isDark ? "text-on-surface-variant" : "text-primary-foreground"
          }`}
        >
          <Sun className="h-4 w-4" />
        </span>
        <span
          className={`flex h-8 w-8 items-center justify-center transition-colors ${
            isDark ? "text-primary-foreground" : "text-on-surface-variant"
          }`}
        >
          <Moon className="h-4 w-4" />
        </span>
      </span>
    </Button>
  );
}
