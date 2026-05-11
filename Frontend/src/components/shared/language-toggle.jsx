import { Languages } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";

export default function LanguageToggle({ className = "" }) {
  const { language, toggleLanguage, t } = useI18n();

  return (
    <Button
      type="button"
      variant="outline"
      onClick={toggleLanguage}
      title={t("common.language")}
      className={`h-10 rounded-full border-outline-variant/35 bg-white px-3 text-xs font-extrabold text-on-surface hover:bg-surface-container-low ${className}`}
    >
      <Languages className="mr-1.5 h-4 w-4" />
      {language.toUpperCase()}
    </Button>
  );
}
