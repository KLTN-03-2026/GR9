import { Download, Lightbulb, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

export default function BookingSuccessSidebar({ booking }) {
  const { t } = useI18n();
  return (
    <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-5">
      <div className="relative overflow-hidden rounded-[28px] shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
        <img
          alt={booking?.tour?.name || t("bookingSuccessPage.heroFallbackAlt")}
          className="aspect-[4/5] w-full object-cover"
          src={
            booking?.tour?.imageUrl ||
            "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80"
          }
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 space-y-3 p-8 text-white">
          <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
            <Sparkles className="size-4 text-emerald-300" />
            <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-100">
              {t("bookingSuccessPage.heroBadge")}
            </span>
          </div>
          <div>
            <h3 className="text-3xl font-black tracking-tight">
              {booking?.tour?.name || t("bookingSuccessPage.heroFallbackTitle")}
            </h3>
            <p className="mt-2 text-sm font-medium text-white/80">
              {booking?.tour?.location || t("bookingSuccessPage.heroFallbackLocation")} • {t("bookingSuccessPage.daysLabel", { days: booking?.tour?.numberOfDay || 1 })}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <Button
          variant="ghost"
          className="h-14 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
        >
          <Download className="size-4" />
          {t("bookingSuccessPage.downloadReceipt")}
        </Button>
      </div>

      <Card className="border border-orange-200/70 bg-gradient-to-br from-orange-50 to-amber-50 py-0 shadow-[0_18px_50px_rgba(245,158,11,0.10)]">
        <CardContent className="p-6">
          <div className="mb-3 flex items-center gap-2 text-orange-700">
            <Lightbulb className="size-5" />
            <span className="text-xs font-bold uppercase tracking-[0.2em]">
              {t("bookingSuccessPage.tipBadge")}
            </span>
          </div>
          <p className="leading-7 text-orange-950/80">
            {t("bookingSuccessPage.tipDescription")}
          </p>
        </CardContent>
      </Card>
    </aside>
  );
}
