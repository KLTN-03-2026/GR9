import { BadgeCheck, CalendarDays } from "lucide-react";

import UserProfileEditDialog from "@/components/Profile/UserProfileEditDialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

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
  const { t } = useI18n();
  const displayGuide = {
    ...guide,
    avatarFallback:
      profile?.fullName?.trim()?.charAt(0)?.toUpperCase() ||
      guide.avatarFallback,
    avatarUrl: profile?.avatarUrl || guide.avatarUrl,
    fullName: profile?.fullName || guide.fullName,
    title: profile?.specialty || t("guidePages.profile.defaultTitle"),
    location: profile?.address || t("guidePages.profile.defaultLocation"),
    bio: profile?.bio || t("guidePages.profile.defaultBio"),
  };

  return (
    <Card className="overflow-hidden rounded-[2rem] border border-[#e8ded0] bg-[radial-gradient(circle_at_top_left,rgba(246,210,165,0.28),transparent_30%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(251,247,240,0.98))] py-0 shadow-[0_24px_70px_rgba(38,33,28,0.08)]">
      <CardContent className="grid gap-6 p-6 md:grid-cols-[auto_1fr_auto] md:items-center md:p-8">
        <div className="relative">
          <Avatar className="h-28 w-28 rounded-[1.5rem] ring-4 ring-white/80">
            <AvatarImage src={displayGuide.avatarUrl} alt={displayGuide.fullName} />
            <AvatarFallback>{displayGuide.avatarFallback}</AvatarFallback>
          </Avatar>
          <Badge className="absolute -bottom-2 -right-2 gap-1 rounded-full bg-[#0b8c87] text-white">
            <BadgeCheck className="h-3.5 w-3.5" />
            {t("guidePages.profile.verified")}
          </Badge>
        </div>

        <div>
          <h1 className="[font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.2rem] leading-[0.98] tracking-[-0.04em] text-[#1f2d2f] md:text-[3.2rem]">
            {displayGuide.fullName}
          </h1>
          <p className="mt-2 font-semibold text-[#0b8c87]">
            {displayGuide.title} · {displayGuide.location}
          </p>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-[#666a65]">
            {displayGuide.bio}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {displayGuide.specialties.map((specialty) => (
              <Badge
                key={specialty}
                variant="secondary"
                className="rounded-full bg-white/76 px-3 py-1 text-[#485557]"
              >
                {specialty}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 md:justify-end">
          <UserProfileEditDialog
            profile={profile}
            onUpdateProfile={onUpdateProfile}
            title={t("guidePages.profile.editTitle")}
            description={t("guidePages.profile.editDescription")}
          />
          <Button
            variant="outline"
            className="rounded-full border-[#d8cab6] bg-white px-4 text-[#324347] hover:bg-[#f8f4ec]"
          >
            <CalendarDays className="h-4 w-4" />
            {t("guidePages.profile.scheduleInterview")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
