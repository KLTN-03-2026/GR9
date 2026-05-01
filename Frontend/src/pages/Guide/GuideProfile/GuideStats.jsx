import { History, Languages, Star } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    label: "Average Rating",
    value: "4.9",
    note: "From 1,240 verified reviews",
    icon: Star,
  },
  {
    label: "Total Tours",
    value: "482",
    note: "100% completion rate",
    icon: History,
  },
  {
    label: "Languages",
    value: "3",
    note: "VN, EN, KR supported",
    icon: Languages,
  },
];

export default function GuideStats() {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => {
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
