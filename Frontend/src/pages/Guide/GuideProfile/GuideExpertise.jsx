import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const about =
  "Born and raised in Da Nang, Alex connects traditional Vietnamese heritage with the modern coastal lifestyle through sustainable, local-first tours.";

const languages = [
  { name: "Vietnamese", level: "Native", score: 100 },
  { name: "English", level: "Fluent", score: 95 },
  { name: "Korean", level: "Conversational", score: 75 },
];

export default function GuideExpertise({ profile }) {
  const profileFields = [
    { label: "Email", value: profile?.email || "Not provided" },
    { label: "Phone", value: profile?.phone || "Not provided" },
    { label: "Address", value: profile?.address || "Not provided" },
    { label: "Gender", value: profile?.gender || "OTHER" },
    { label: "Auth Type", value: profile?.authType || "LOCAL" },
    { label: "Status", value: profile?.isActive ? "Active" : "Inactive" },
  ];

  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Professional Expertise</CardTitle>
        <CardDescription>{about}</CardDescription>
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
        {languages.map((language) => (
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
