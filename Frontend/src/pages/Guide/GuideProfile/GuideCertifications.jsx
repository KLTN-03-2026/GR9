import { BadgeCheck, HeartPulse } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

const certifications = [
  {
    title: "Vietnam National Guide License",
    detail: "ID: VN-G-88291 - Exp: 2026",
    icon: BadgeCheck,
  },
  {
    title: "Advanced First Aid & CPR",
    detail: "Red Cross Certified - 2024",
    icon: HeartPulse,
  },
  {
    title: "Sustainable Tourism Specialist",
    detail: "GSTC Recognized Certificate",
    icon: BadgeCheck,
  },
];

export default function GuideCertifications() {
  const { t } = useI18n();
  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>{t("guidePages.profile.certifications")}</CardTitle>
        <CardDescription>{t("guidePages.profile.certificationsDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {certifications.map((certification) => {
          const Icon = certification.icon;

          return (
            <div
              key={certification.title}
              className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-bold text-slate-950">{certification.title}</p>
                <p className="text-xs text-slate-500">{certification.detail}</p>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
