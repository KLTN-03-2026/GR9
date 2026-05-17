import { Download, Lightbulb, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

export default function BookingSuccessSidebar({ booking }) {
  const { t } = useI18n();

  return (
    <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-5">
      <div className="relative overflow-hidden rounded-[30px] border border-[#e6dccd] shadow-[0_28px_90px_rgba(38,33,28,0.18)] dark:border-white/12 dark:shadow-none">
        <img
          alt={booking?.tour?.name || t("bookingSuccessPage.heroFallbackAlt")}
          className="aspect-[4/5] w-full object-cover"
          src={
            booking?.tour?.imageUrl ||
            "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#091519] via-[#0a1c20]/24 to-transparent" />

        <div className="absolute inset-x-0 bottom-0 space-y-3 p-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1.5 backdrop-blur-sm">
            <Sparkles className="size-4 text-[#dfc198]" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-white/82">
              {t("bookingSuccessPage.heroBadge")}
            </span>
          </div>

          <div>
            <h3 className="[font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.15rem] leading-[1] tracking-[-0.04em]">
              {booking?.tour?.name || t("bookingSuccessPage.heroFallbackTitle")}
            </h3>
            <p className="mt-2 text-sm font-medium text-white/80">
              {booking?.tour?.location || t("bookingSuccessPage.heroFallbackLocation")}{" "}
              · {t("bookingSuccessPage.daysLabel", { days: booking?.tour?.numberOfDay || 1 })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <Button
          variant="ghost"
          className="h-14 rounded-full border border-[#d8cab6] bg-white text-[#0b8c87] hover:bg-[#f8f4ec] dark:border-white/12 dark:bg-surface-container-lowest dark:text-primary dark:hover:bg-surface-container"
        >
          <Download className="size-4" />
          {t("bookingSuccessPage.downloadReceipt")}
        </Button>
      </div>

      <Card className="overflow-hidden rounded-[28px] border border-[#ecd9b9] bg-[linear-gradient(135deg,#fff6e7_0%,#f9f0df_100%)] py-0 shadow-[0_18px_50px_rgba(196,148,72,0.12)] dark:border-amber-300/20 dark:bg-[linear-gradient(135deg,rgba(245,158,11,0.16)_0%,rgba(245,158,11,0.08)_100%)] dark:shadow-none">
        <CardContent className="p-6">
          <div className="mb-3 flex items-center gap-2 text-[#a1701b] dark:text-amber-200">
            <Lightbulb className="size-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              {t("bookingSuccessPage.tipBadge")}
            </span>
          </div>
          <p className="leading-7 text-[#6d4d19] dark:text-amber-100/80">
            {t("bookingSuccessPage.tipDescription")}
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}
