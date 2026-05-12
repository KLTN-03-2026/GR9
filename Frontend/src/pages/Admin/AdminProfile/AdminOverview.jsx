import { ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const mfa = {
  title: "Multi-Factor Authentication",
  description:
    "This account is protected by authenticator app and hardware key.",
  status: "ACTIVE",
  score: 92,
};

export default function AdminOverview({ profile }) {
  const profileFields = [
    { label: "Full Name", value: profile?.fullName || "System Admin" },
    { label: "Email", value: profile?.email || "admin@smarttravel.ai" },
    { label: "Phone", value: profile?.phone || "Not provided" },
    { label: "Address", value: profile?.address || "Not provided" },
    { label: "Gender", value: profile?.gender || "OTHER" },
    { label: "Auth Type", value: profile?.authType || "LOCAL" },
    { label: "Role", value: profile?.role || "ADMIN" },
    { label: "Status", value: profile?.isActive ? "Active" : "Inactive" },
    { label: "Admin ID", value: profile?.id || "UID-990-2104-SYS" },
    { label: "Department", value: profile?.specialty || "Infrastructure & Security" },
    {
      label: "Email Verified At",
      value: profile?.emailVerifiedAt
        ? new Date(profile.emailVerifiedAt).toLocaleString("vi-VN")
        : "Not available",
    },
    {
      label: "Created At",
      value: profile?.createdAt
        ? new Date(profile.createdAt).toLocaleString("vi-VN")
        : "Not available",
    },
    {
      label: "Last Login",
      value: profile?.updatedAt
        ? new Date(profile.updatedAt).toLocaleString("vi-VN")
        : "Apr 29, 2026 - 08:42 AM",
    },
  ];

  return (
    <div className="grid gap-6 lg:grid-cols-12">
      <Card className="border-outline-variant/20 bg-white shadow-sm lg:col-span-8">
        <CardHeader>
          <CardTitle>Administrator Profile</CardTitle>
          <CardDescription>
            Core identity and platform responsibility details.
          </CardDescription>
          <CardAction>
            <Button variant="link" className="px-0 text-teal-700">
              Edit details
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 sm:grid-cols-2">
            {profileFields.map((field) => (
              <div
                key={field.label}
                className="space-y-1 rounded-lg border border-outline-variant/20 bg-slate-50 px-4 py-3"
              >
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  {field.label}
                </p>
                <p className="text-base font-semibold text-slate-900">
                  {field.value}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-teal-200 bg-teal-700 text-white shadow-sm lg:col-span-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <ShieldCheck className="h-5 w-5" />
            {mfa.title}
          </CardTitle>
          <CardDescription className="text-teal-50/80">
            {mfa.description}
          </CardDescription>
          <CardAction>
            <Badge className="border-white/20 bg-white/15 text-white">
              {mfa.status}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-5">
          <div>
            <div className="mb-2 flex items-center justify-between text-sm font-semibold">
              <span>Security posture</span>
              <span>{mfa.score}%</span>
            </div>
            <Progress
              value={mfa.score}
              className="bg-white/20 [&_[data-slot=progress-indicator]]:bg-white"
            />
          </div>
          <Button variant="secondary" className="w-full">
            Manage MFA Methods
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
