import { CalendarDays, MapPinned, Plane, Trophy } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

const formatNumber = (value) => {
  const number = Number(value) || 0;

  if (number >= 1000) {
    return `${(number / 1000).toFixed(number >= 10000 ? 0 : 1)}k`;
  }

  return String(number);
};

const getStats = (stats) => [
  {
    label: "Cities Visited",
    value: formatNumber(stats?.citiesVisited),
    icon: MapPinned,
  },
  {
    label: "Upcoming Trips",
    value: formatNumber(stats?.upcomingTrips),
    icon: CalendarDays,
  },
  {
    label: "Completed Tours",
    value: formatNumber(stats?.completedTours),
    icon: Plane,
  },
  {
    label: "Reward Points",
    value: formatNumber(stats?.rewardPoints),
    icon: Trophy,
  },
];

export default function TravelerStats({ stats }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {getStats(stats).map((stat) => {
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
