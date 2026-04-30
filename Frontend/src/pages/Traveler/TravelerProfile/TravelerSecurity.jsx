import { useState } from "react";
import { LockKeyhole, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const security = {
  summary: "Manage login protection and account recovery settings.",
  passwordNote: "Last changed 3 months ago",
  twoFactorLabel: "Two-factor authentication is enabled",
};

export default function TravelerSecurity({ onChangePassword }) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onChangePassword(form);
      setForm({
        currentPassword: "",
        password: "",
        confirmPassword: "",
      });
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardHeader>
        <CardTitle>Account Security</CardTitle>
        <CardDescription>{security.summary}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 rounded-xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-teal-700 shadow-sm">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-950">Update Password</p>
              <p className="text-xs text-slate-500">{security.passwordNote}</p>
            </div>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Change Password</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>Change Password</DialogTitle>
                  <DialogDescription>
                    Enter your current password and choose a new one.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input
                      id="current-password"
                      type="password"
                      value={form.currentPassword}
                      onChange={(event) =>
                        handleChange("currentPassword", event.target.value)
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input
                      id="new-password"
                      type="password"
                      value={form.password}
                      onChange={(event) =>
                        handleChange("password", event.target.value)
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirm-password">Confirm Password</Label>
                    <Input
                      id="confirm-password"
                      type="password"
                      value={form.confirmPassword}
                      onChange={(event) =>
                        handleChange("confirmPassword", event.target.value)
                      }
                      disabled={saving}
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Changing..." : "Change Password"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            {security.twoFactorLabel}
          </div>
          <Badge variant="success">Enabled</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
