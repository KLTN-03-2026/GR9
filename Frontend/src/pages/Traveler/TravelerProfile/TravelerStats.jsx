import { CalendarDays, MapPinned, Plane, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const stats = [
  { label: "Cities Visited", value: "24", icon: MapPinned },
  { label: "Upcoming Trips", value: "12", icon: CalendarDays },
  { label: "Completed Tours", value: "38", icon: Plane },
  { label: "Reward Points", value: "8.4k", icon: Trophy },
];

export default function TravelerStats() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon;

        return (
          <Card key={stat.label} className="border-outline-variant/20 bg-white shadow-sm">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="text-2xl font-black text-slate-950">{stat.value}</p>
                <p className="text-xs font-semibold text-slate-500">{stat.label}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
