import { History, Languages, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

const formatNumber = (value) => String(Number(value) || 0);

const formatRating = (value) => {
  const rating = Number(value) || 0;
  return rating ? rating.toFixed(1) : "0.0";
};

const getLanguageList = (stats, profile) => {
  if (Array.isArray(stats?.languages) && stats.languages.length > 0) {
    return stats.languages;
  }

  return String(profile?.language || "")
    .split(/[,\s/|]+/)
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
};

const getStats = (stats, profile, t) => {
  const languages = getLanguageList(stats, profile);

  return [
    {
      label: t("guidePages.profile.averageRating"),
      value: formatRating(stats?.averageRating ?? profile?.rate),
      note: t("guidePages.profile.fromReviews", { count: formatNumber(stats?.reviewCount) }),
      icon: Star,
    },
    {
      label: t("guidePages.profile.totalTours"),
      value: formatNumber(stats?.totalTours),
      note: t("guidePages.profile.completionRate", { rate: formatNumber(stats?.completionRate) }),
      icon: History,
    },
    {
      label: t("guidePages.profile.languages"),
      value: formatNumber(stats?.languageCount ?? languages.length),
      note: languages.length
        ? t("guidePages.profile.supported", { languages: languages.join(", ") })
        : t("guidePages.profile.noLanguages"),
      icon: Languages,
    },
  ];
};

export default function GuideStats({ stats, profile }) {
  const { t } = useI18n();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {getStats(stats, profile, t).map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} className="border-outline-variant/20 bg-white shadow-sm">
            <CardContent className="p-5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                <Icon className="h-5 w-5 text-teal-700" />
              </div>
              <p className="text-4xl font-black tracking-tight text-slate-950">
                {stat.value}
              </p>
              <p className="mt-2 text-xs text-slate-500">{stat.note}</p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
