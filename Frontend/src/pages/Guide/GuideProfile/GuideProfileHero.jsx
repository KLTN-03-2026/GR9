import { BadgeCheck, CalendarDays } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import UserProfileEditDialog from "@/components/Profile/UserProfileEditDialog";

const guide = {
  avatarFallback: "A",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCB-jzJ5G_wqrHBjt-DQTN6mjTTe-hil0MngXxCGzoEChe7LVChcvt6xU_Bm4uahejMsRFpocW_rF19jKrqrY4GbzWOWLU55IVDElkvrMYeAFE_sl1GyJH3qhNorgoV-40gLl8kYjBrkcrWsUTnOINoCSGOItIdad5fv6sU6ACqbWazLcEfZyXwXjoXCuqfkj7_jR9F3nCBOQDyk3riA53OO-qFX17vc3EU-vIIr3xlpSbc6PV0vstkpxLAoLcXoGFocYsx6n8mvxlg",
  fullName: "Alex Rivers",
  title: "Expert Travel Guide",
  location: "Da Nang, Vietnam",
  bio: "Specializing in hidden Da Nang experiences, food walks, heritage routes, and low-impact tours that support local artisans.",
  specialties: ["Cultural Tours", "Food Tours", "Adventure", "Family Travel"],
};

export default function GuideProfileHero({ profile, onUpdateProfile }) {
  const displayGuide = {
    ...guide,
    avatarFallback:
      profile?.fullName?.trim()?.charAt(0)?.toUpperCase() ||
      guide.avatarFallback,
    avatarUrl: profile?.avatarUrl || guide.avatarUrl,
    fullName: profile?.fullName || guide.fullName,
    title: profile?.specialty || guide.title,
    location: profile?.address || guide.location,
  };

  return (
    <Card className="border-outline-variant/20 bg-white shadow-sm">
      <CardContent className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center">
        <div className="relative">
          <Avatar className="h-28 w-28 rounded-2xl">
            <AvatarImage src={displayGuide.avatarUrl} alt={displayGuide.fullName} />
            <AvatarFallback>{displayGuide.avatarFallback}</AvatarFallback>
          </Avatar>
          <Badge className="absolute -bottom-2 -right-2 gap-1 bg-teal-700 text-white">
            <BadgeCheck className="h-3.5 w-3.5" />
            Verified
          </Badge>
        </div>

        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-slate-950">
            {displayGuide.fullName}
          </h1>
          <p className="mt-1 font-semibold text-teal-700">
            {displayGuide.title} - {displayGuide.location}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-500">
            {displayGuide.bio}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {displayGuide.specialties.map((specialty) => (
              <Badge key={specialty} variant="secondary">
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          <UserProfileEditDialog
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            title="Edit Guide Profile"
            description="Update guide contact and profile information."
          />
          <Button variant="outline">
            <CalendarDays className="h-4 w-4" />
            Schedule Interview
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
