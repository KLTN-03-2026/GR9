import { Activity, KeyRound, LockKeyhole } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const settings = [
  {
    title: "API Access",
    description:
      "External API calls are restricted to trusted enterprise IP ranges.",
    status: "ENFORCED",
    icon: KeyRound,
  },
  {
    title: "Encryption Protocol",
    description:
      "AES-256 GCM encryption is active for sensitive platform data.",
    status: "VERSION 4.2",
    icon: LockKeyhole,
  },
  {
    title: "Threat Detection",
    description:
      "Login activity is monitored for brute-force and anomaly patterns.",
    status: "MONITORING",
    icon: Activity,
  },
];

export default function AdminSecurity() {
  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Platform Security Settings</CardTitle>
        <CardDescription>
          High-impact controls for admin access and platform protection.
        </CardDescription>
        <CardAction>
          <Badge variant="success">System Health: Optimal</Badge>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-3">
          {settings.map((setting) => {
            const Icon = setting.icon;

            return (
              <div
                key={setting.title}
                className="rounded-xl border border-outline-variant/20 bg-slate-50 p-5"
              >
                <div className="mb-4 flex items-center gap-3 text-teal-700">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-teal-50">
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-slate-950">
                    {setting.title}
                  </h3>
                </div>
                <p className="mb-4 text-sm leading-6 text-slate-500">
                  {setting.description}
                </p>
                <Badge variant="outline">{setting.status}</Badge>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
