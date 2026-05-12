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
import { useI18n } from "@/i18n/I18nProvider";

export default function GuideSecurity({ onChangePassword }) {
  const { t } = useI18n();
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
    <Card className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest py-0 shadow-[0_18px_40px_rgba(25,28,30,0.04)]">
      <CardHeader className="p-8 pb-0">
        <CardTitle className="font-headline text-2xl font-bold">
          {t("guidePages.profile.securityTitle")}
        </CardTitle>
        <CardDescription>{t("guidePages.profile.securityDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5 p-8">
        <div className="flex flex-col gap-4 rounded-[1.5rem] bg-surface-container-low p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <LockKeyhole className="size-5" />
            </div>
            <div>
              <p className="font-bold text-on-surface">
                {t("guidePages.profile.passwordTitle")}
              </p>
              <p className="text-xs text-on-surface-variant">
                {t("guidePages.profile.passwordDescription")}
              </p>
            </div>
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">{t("guidePages.profile.changePassword")}</Button>
            </DialogTrigger>
            <DialogContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <DialogHeader>
                  <DialogTitle>{t("guidePages.profile.changePasswordTitle")}</DialogTitle>
                  <DialogDescription>
                    {t("guidePages.profile.changePasswordDescription")}
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="guide-current-password">
                      {t("guidePages.profile.currentPassword")}
                    </Label>
                    <Input
                      id="guide-current-password"
                      type="password"
                      value={form.currentPassword}
                      onChange={(event) =>
                        handleChange("currentPassword", event.target.value)
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guide-new-password">{t("guidePages.profile.newPassword")}</Label>
                    <Input
                      id="guide-new-password"
                      type="password"
                      value={form.password}
                      onChange={(event) =>
                        handleChange("password", event.target.value)
                      }
                      disabled={saving}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="guide-confirm-password">
                      {t("guidePages.profile.confirmPassword")}
                    </Label>
                    <Input
                      id="guide-confirm-password"
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
                    {saving ? t("guidePages.profile.changing") : t("guidePages.profile.changePassword")}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-on-surface-variant">
            <ShieldCheck className="h-4 w-4 text-emerald-600" />
            {t("guidePages.profile.protectedLabel")}
          </div>
          <Badge variant="success">{t("guidePages.profile.enabled")}</Badge>
        </div>
      </CardContent>
    </Card>
  );
}
