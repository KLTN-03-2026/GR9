import { ShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserProfileEditDialog from "@/components/Profile/UserProfileEditDialog";

export default function AdminProfileHeader({ profile, onUpdateProfile }) {
  const fullName = profile?.fullName || "System Admin";
  const email = profile?.email || "admin@voyager.ai";
  const avatarUrl = profile?.avatarUrl || "";
  const avatarFallback = fullName.trim().charAt(0).toUpperCase() || "A";

  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardContent className="flex flex-col gap-6 p-6 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16 border border-outline-variant/30 bg-teal-50">
            <AvatarImage src={avatarUrl} alt={fullName} />
            <AvatarFallback className="text-xl font-bold text-teal-800">
              {avatarFallback}
            </AvatarFallback>
          </Avatar>

          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-950">
                {fullName}
              </h1>
              <Badge variant="success">Root Access</Badge>
            </div>
            <p className="text-sm text-slate-500">{email}</p>
            <p className="mt-1 text-sm font-medium text-teal-700">
              Global system privileges enabled
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <UserProfileEditDialog
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            title="Edit Admin Profile"
            description="Update admin account information."
            triggerVariant="outline"
          />
          <Button>
            <ShieldCheck className="h-4 w-4" />
            Security Review
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
