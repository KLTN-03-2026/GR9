import {
  CalendarDays,
  CheckCircle2,
  Home,
  IdCard,
  Mail,
  Phone,
  ShieldCheck,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formatDate = (value) => {
  if (!value) return "Not available";
  return new Date(value).toLocaleString("vi-VN");
};

export default function TravelerProfileDetails({ profile }) {
  const details = [
    {
      label: "Full Name",
      value: profile?.fullName || "Not provided",
      icon: UserRound,
    },
    {
      label: "Email Address",
      value: profile?.email || "Not provided",
      icon: Mail,
    },
    {
      label: "Phone Number",
      value: profile?.phone || "Not provided",
      icon: Phone,
    },
    {
      label: "Address",
      value: profile?.address || "Not provided",
      icon: Home,
    },
    {
      label: "Gender",
      value: profile?.gender || "Not provided",
      icon: IdCard,
    },
    {
      label: "Authentication",
      value: profile?.authType || "LOCAL",
      icon: ShieldCheck,
    },
    {
      label: "Email Verified At",
      value: formatDate(profile?.emailVerifiedAt),
      icon: CheckCircle2,
    },
    {
      label: "Joined At",
      value: formatDate(profile?.createdAt),
      icon: CalendarDays,
    },
  ];

  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>
              Personal details and account metadata from your Voyager AI user
              profile.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{profile?.role || "TRAVELER"}</Badge>
            <Badge variant={profile?.isActive ? "success" : "warning"}>
              {profile?.isActive ? "Active" : "Inactive"}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 md:grid-cols-2">
          {details.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex gap-3 rounded-xl border border-outline-variant/20 bg-slate-50 p-4"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
