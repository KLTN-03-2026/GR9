import { MapPinned, Quote } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

const review = {
  name: "Sarah Jenkins",
  origin: "San Francisco, USA - Guided in Oct 2023",
  context: "Recent traveler feedback",
  avatarUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAMKH6d-xCaSr6-SF7vP3d5XlZvx6gUzl10KuaW8oatw6KYNm2y4sxEkFP5M6-YIqUlgGkzGunHM9akNB281909wq1gbUYBlEbFFnazShPnlqv-wRh1DTqkmCMoqw_21lSwPirXmZRncvAl8XxNTUWsIcH5PAiSakrKakNXGHPGPXYYgEvHc1FBuaLRbDnFPijAXBu81N98NNgmuKJ0PTbOEv1EfDEqCptzbUurhgQDkh3rDZkT52r9RskH180QOyoMfxrtQiEzZrWs",
  text: "Alex provided the most incredible sunrise tour of My Son Sanctuary. His knowledge of Cham culture is unparalleled.",
};

const region = {
  name: "Da Nang, Vietnam",
  label: "Central Coast Hub",
  description: "Primary operating region",
  imageUrl:
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBq05Qfr_RjvTvQz35N8DqN5xxj1Aw53u4OEyIku_Jo7bS60cl23cyI7MQ2AE8MDJnXTrJfLpxGLcewXlduj-e5bVuHaWxg3n5GvnJy4PNIlZaGS2SbGohgX9Df_l1sy7pFxZP1ojR41PtfyTQrJ3wTpeLkCJTZNZ3-6VxAM1FAf8t-HFsEGwursg5dqDxj6A_Io_IfafxH36DjGOT0eqjvN2PM6cDVIe46TTyvAf0sgwssTDHywelrxw5YgrtzwEpdpBoiKJbjv6E-",
};

export default function GuideReviewRegion() {
  const { t } = useI18n();
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card className="border-outline-variant/20 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Quote className="h-5 w-5 text-teal-700" />
            {t("guidePages.profile.latestReview")}
          </CardTitle>
          <CardDescription>{t("guidePages.profile.recentFeedback")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-3">
            <Avatar>
              <AvatarImage src={review.avatarUrl} alt={review.name} />
              <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-bold text-slate-950">{review.name}</p>
              <p className="text-xs text-slate-500">{review.origin}</p>
            </div>
          </div>
          <p className="text-sm italic leading-6 text-slate-600">"{review.text}"</p>
        </CardContent>
      </Card>

      <Card className="border-outline-variant/20 bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPinned className="h-5 w-5 text-teal-700" />
            {t("guidePages.profile.primaryRegion")}
          </CardTitle>
          <CardDescription>{t("guidePages.profile.primaryRegionDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-xl">
            <img
              src={region.imageUrl}
              alt={region.name}
              className="h-56 w-full object-cover"
            />
          </div>
          <p className="mt-4 font-bold text-slate-950">{region.name}</p>
          <p className="text-sm text-slate-500">{t("guidePages.profile.centralCoastHub")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
