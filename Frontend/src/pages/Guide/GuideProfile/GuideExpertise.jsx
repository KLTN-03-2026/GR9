import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useI18n } from "@/i18n/I18nProvider";

const languages = [
  { name: "Vietnamese", level: "Native", score: 100 },
  { name: "English", level: "Fluent", score: 95 },
  { name: "Korean", level: "Conversational", score: 75 },
];

export default function GuideExpertise({ profile }) {
  const { t } = useI18n();
  const profileFields = [
    { label: t("guidePages.profile.email"), value: profile?.email || t("guidePages.profile.notProvided") },
    { label: t("guidePages.profile.phone"), value: profile?.phone || t("guidePages.profile.notProvided") },
    { label: t("guidePages.profile.address"), value: profile?.address || t("guidePages.profile.notProvided") },
    { label: t("guidePages.profile.gender"), value: profile?.gender || "OTHER" },
    { label: t("guidePages.profile.authType"), value: profile?.authType || "LOCAL" },
    { label: t("guidePages.profile.status"), value: profile?.isActive ? t("guidePages.profile.active") : t("guidePages.profile.inactive") },
  ];

  const displayLanguages = [
    { ...languages[0], name: t("guidePages.profile.vietnamese"), level: t("guidePages.profile.native") },
    { ...languages[1], name: t("guidePages.profile.english"), level: t("guidePages.profile.fluent") },
    { ...languages[2], name: t("guidePages.profile.korean"), level: t("guidePages.profile.conversational") },
  ];

  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{t("guidePages.profile.expertiseTitle")}</CardTitle>
        <CardDescription>{t("guidePages.profile.expertiseDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2">
          {profileFields.map((field) => (
            <div
              key={field.label}
              className="rounded-xl border border-outline-variant/20 bg-slate-50 p-3"
            >
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {field.label}
              </p>
              <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                {field.value}
              </p>
            </div>
          ))}
        </div>
        {displayLanguages.map((language) => (
          <div key={language.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-semibold text-slate-800">{language.name}</span>
              <span className="font-bold text-teal-700">{language.level}</span>
            </div>
            <Progress value={language.score} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
