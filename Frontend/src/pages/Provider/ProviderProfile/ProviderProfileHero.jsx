import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import UserProfileEditDialog from "@/components/Profile/UserProfileEditDialog";

const profile = {
  badge: "Provider Profile",
  name: "Skyline Tours",
  description:
    "Curating breathtaking aerial and mountain experiences across Vietnam's most iconic coastal horizons.",
  imageAlt: "Skyline view of Da Nang",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBZ1sYAY_s4vribM_EUrzBNV-FAMlS9OSyRnNe-KuD9VAlh18DZ2eBhYE4ypQJWStntYMz0k0bicjJPZpnioiIb2zePCd9nfVQPT9QDpVzXA1_4cfAv-zIWPGwIRseP_YcaOZXD3PIpFeolMUaDl6JvVYX0pjV4BBdoEh4spIBZkAvMjiBlPKo4Nmdyt9422sIPmucNK_rvHjUy9hWghzeK1ocQw44I_tKYYK_OxUUwJh2HBWppMSnRsKr8BXGlzG82o8ODpLLCDAPT",
};

export default function ProviderProfileHero({ profile: userProfile, onUpdateProfile }) {
  const providerProfile = {
    ...profile,
    name: userProfile?.fullName || profile.name,
    description:
      userProfile?.address ||
      profile.description,
    imageAlt: userProfile?.fullName || profile.imageAlt,
    imageUrl: userProfile?.avatarUrl || profile.imageUrl,
  };

  return (
    <Card className="relative overflow-hidden rounded-[2rem] border-none bg-surface-container-low py-0 shadow-[0_24px_60px_rgba(25,28,30,0.06)]">
      <div className="absolute -right-20 -bottom-20 h-96 w-96 rounded-full bg-primary-fixed-dim/20 blur-3xl" />

      <CardContent className="relative grid grid-cols-1 gap-8 p-8 md:p-12 lg:grid-cols-[1.35fr_0.9fr] lg:items-center">
        <div className="max-w-2xl">
          <Badge className="mb-6 rounded-full bg-tertiary-container px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-on-tertiary-fixed">
            {providerProfile.badge}
          </Badge>

          <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            {providerProfile.name}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-on-surface-variant">
            {providerProfile.description}
          </p>
          <div className="mt-6">
            <UserProfileEditDialog
              profile={userProfile}
              onUpdateProfile={onUpdateProfile}
              title="Edit Provider Profile"
              description="Update provider account information."
            />
          </div>
        </div>

        <div className="justify-self-end">
          <div className="overflow-hidden rounded-[1.75rem] shadow-[0_20px_50px_rgba(25,28,30,0.18)] ring-4 ring-white/70">
            <img
              alt={providerProfile.imageAlt}
              className="h-[280px] w-full object-cover md:w-[320px] lg:w-[340px] lg:rotate-3"
              src={providerProfile.imageUrl}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}