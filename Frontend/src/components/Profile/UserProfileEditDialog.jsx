import { useEffect, useState } from "react";
import { Edit3 } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

export default function UserProfileEditDialog({
  profile,
  onUpdateProfile,
  title = "Edit Profile",
  description = "Update your profile information.",
  triggerLabel = "Edit Profile",
  triggerVariant = "default",
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName: "",
    avatarUrl: "",
    phone: "",
    address: "",
    gender: "OTHER",
  });

  useEffect(() => {
    setForm({
      fullName: profile?.fullName || "",
      avatarUrl: profile?.avatarUrl || "",
      phone: profile?.phone || "",
      address: profile?.address || "",
      gender: profile?.gender || "OTHER",
    });
  }, [profile]);

  const handleChange = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    try {
      await onUpdateProfile(form);
      setOpen(false);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant={triggerVariant}>
          <Edit3 className="h-4 w-4" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-full-name">Full Name</Label>
              <Input
                id="profile-full-name"
                value={form.fullName}
                onChange={(event) => handleChange("fullName", event.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-avatar-url">Avatar URL</Label>
              <Input
                id="profile-avatar-url"
                value={form.avatarUrl}
                onChange={(event) => handleChange("avatarUrl", event.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="profile-phone">Phone</Label>
              <Input
                id="profile-phone"
                value={form.phone}
                onChange={(event) => handleChange("phone", event.target.value)}
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <Label>Gender</Label>
              <Select
                value={form.gender}
                onValueChange={(value) => handleChange("gender", value)}
                disabled={saving}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="profile-address">Address</Label>
              <Textarea
                id="profile-address"
                value={form.address}
                onChange={(event) => handleChange("address", event.target.value)}
                disabled={saving}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
