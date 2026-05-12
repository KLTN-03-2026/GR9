import { useEffect, useState } from "react";
import { Camera, Edit3 } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

export default function TravelerProfileHeader({ profile, onUpdateProfile }) {
  const fullName = profile?.fullName || "Alex Rivera";
  const email = profile?.email || "alex.rivera@smarttravel.ai";
  const phone = profile?.phone || "";
  const address = profile?.address || "";
  const gender = profile?.gender || "OTHER";
  const avatarUrl =
    profile?.avatarUrl ||
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCY5JVDhNhqyBliBUKiHYgd7XRpJsV87-6UjxwNX0LuwOP8VgqohPRslgh1gKzgPwetj7qzijfPsdw3LjuLw1vD5c9ljrt8icF9Sk7W2llkf2I9k-uLVEsPuJKja-EOBZ4G7LC3DAsXW_ZjSJNNb-_-b6ObGp0mbKAFhdZhZ6gKJOZ4btONV7xZ_gsfV5SXVLtzWTPhjdac9oS60xaMPrkOOXu4ZrrA3wigo9eD2hd80Qy8yQoBm2nATJ5zQEmflPD6PdDadOexf9el";
  const avatarFallback = fullName.trim().charAt(0).toUpperCase() || "T";
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    fullName,
    avatarUrl,
    phone,
    address,
    gender,
  });

  useEffect(() => {
    setForm({
      fullName,
      avatarUrl,
      phone,
      address,
      gender,
    });
  }, [address, avatarUrl, fullName, gender, phone]);

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
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Avatar className="h-20 w-20 border-4 border-teal-50">
              <AvatarImage src={avatarUrl} alt={fullName} />
              <AvatarFallback className="text-xl font-bold text-teal-800">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <Button
              size="icon-sm"
              className="absolute -bottom-1 -right-1 rounded-full"
            >
              <Camera className="h-4 w-4" />
            </Button>
          </div>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-950">
                {fullName}
              </h1>
              <Badge variant="success">Platinum Member</Badge>
            </div>
            <p className="text-sm text-slate-500">{email}</p>
            <p className="mt-1 text-sm font-medium text-teal-700">
              Personalized journeys, saved preferences, and secure bookings.
            </p>
          </div>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Edit3 className="h-4 w-4" />
              Edit Profile
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Edit Traveler Profile</DialogTitle>
                <DialogDescription>
                  Update the information shown on your traveler profile.
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="traveler-full-name">Full Name</Label>
                  <Input
                    id="traveler-full-name"
                    value={form.fullName}
                    onChange={(event) =>
                      handleChange("fullName", event.target.value)
                    }
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="traveler-avatar-url">Avatar URL</Label>
                  <Input
                    id="traveler-avatar-url"
                    value={form.avatarUrl}
                    onChange={(event) =>
                      handleChange("avatarUrl", event.target.value)
                    }
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traveler-phone">Phone</Label>
                  <Input
                    id="traveler-phone"
                    value={form.phone}
                    onChange={(event) =>
                      handleChange("phone", event.target.value)
                    }
                    disabled={saving}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="traveler-email">Email</Label>
                  <Input id="traveler-email" value={email} disabled />
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
                  <Label htmlFor="traveler-address">Address</Label>
                  <Textarea
                    id="traveler-address"
                    value={form.address}
                    onChange={(event) =>
                      handleChange("address", event.target.value)
                    }
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
      </CardContent>
    </Card>
  );
}
