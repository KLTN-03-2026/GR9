import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useI18n } from "@/i18n/I18nProvider";

const FALLBACK_TOUR_IMAGE =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF";

const TourHeroCard = ({ tracking }) => {
  const { t } = useI18n();
  const progress = tracking?.progress?.percent || 0;
  const imageUrl = tracking?.tour?.imageUrl || FALLBACK_TOUR_IMAGE;

  return (
    <Card className="rounded-3xl border-none shadow-sm overflow-hidden bg-white">
      <CardContent className="p-8 flex flex-col md:flex-row gap-8 items-start relative">
        <div className="w-full md:w-1/3 aspect-[4/5] rounded-2xl overflow-hidden shadow-md">
          <img 
            alt="Tour" 
            className="w-full h-full object-cover" 
            src={imageUrl}
          />
        </div>
        
        <div className="flex-1 space-y-6 w-full">
          <div className="flex justify-between items-start gap-4">
            <div>
              <span className="text-[11px] font-bold tracking-widest uppercase text-teal-600 mb-1 block">
                {tracking?.tour?.location || t("publicTrackingPage.trackingFallback")}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                {tracking?.tour?.name || t("publicTrackingPage.titleFallback")}
              </h1>
            </div>
            <Badge className="bg-teal-50 text-teal-700 border-teal-100 hover:bg-teal-50 gap-1.5 px-3 py-1 rounded-full">
              <span className="w-2 h-2 bg-teal-600 rounded-full animate-pulse" />
              {t(`publicTrackingPage.status.${tracking?.status || "ongoing"}`) || t("publicTrackingPage.badgeFallback")}
            </Badge>
          </div>

          <div className="flex items-center gap-4 py-4 border-y border-slate-100">
            <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
              <AvatarImage src={tracking?.guide?.avatarUrl} />
              <AvatarFallback>
                {(tracking?.guide?.name || "GD").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-[11px] text-slate-500 font-bold uppercase tracking-wider">{t("publicTrackingPage.guideLabel")}</p>
              <p className="font-bold text-slate-900">
                {tracking?.guide?.name || t("publicTrackingPage.guideFallback")}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between items-end">
              <span className="text-sm font-bold text-slate-900">
                {t("publicTrackingPage.dayOf", {
                  current: tracking?.schedule?.currentDay || 1,
                  total: tracking?.tour?.numberOfDay || 1,
                })}
              </span>
              <span className="text-xs font-bold text-teal-600">
                {t("publicTrackingPage.progressCompleted", { percent: progress })}
              </span>
            </div>
            <Progress value={progress} className="h-2.5 bg-slate-100" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TourHeroCard;
