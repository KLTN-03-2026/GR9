import { CalendarDays, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyVND } from "@/utils/formatPrice";
import { useI18n } from "@/i18n/I18nProvider";

const formatDate = (value, language, fallback) => {
  if (!value) return fallback;
  return new Intl.DateTimeFormat(language === "en" ? "en-GB" : "vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

export default function BookingSuccessDetailsCard({ booking }) {
  const { language, t } = useI18n();
  return (
    <Card className="overflow-hidden border-0 bg-white py-0 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
      <CardContent className="space-y-6 p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              {t("bookingSuccessPage.reservationId")}
            </p>
            <p className="text-2xl font-black tracking-tight text-slate-950">
              {booking?.bookingCode || "-"}
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            {booking?.status || "CONFIRMED"}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t("bookingSuccessPage.dateTime")}</p>
              <p className="font-semibold text-slate-900">
                {formatDate(booking?.startDate, language, t("bookingSuccessPage.noDepartureDate"))} • {t("bookingSuccessPage.daysLabel", { days: booking?.tour?.numberOfDay || 1 })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">{t("bookingSuccessPage.meetingPoint")}</p>
              <p className="font-semibold text-slate-900">
                {booking?.tour?.location || t("bookingSuccessPage.itineraryFallback")}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-200/80" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">{t("bookingSuccessPage.totalAmountPaid")}</span>
          <span className="text-3xl font-black tracking-tight text-emerald-700">
            {formatCurrencyVND(booking?.totalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
