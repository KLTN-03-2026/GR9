import { CalendarDays, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useI18n } from "@/i18n/I18nProvider";
import { formatCurrencyVND } from "@/utils/formatPrice";

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
    <Card className="overflow-hidden rounded-[30px] border border-[#e8ded0] bg-white/92 py-0 shadow-[0_24px_70px_rgba(38,33,28,0.08)]">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.24em] text-[#8b857c]">
              {t("bookingSuccessPage.reservationId")}
            </p>
            <p className="text-2xl font-black tracking-tight text-[#233236]">
              {booking?.bookingCode || "-"}
            </p>
          </div>

          <span className="inline-flex w-fit items-center rounded-full bg-[#f6eee1] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#9f7d52]">
            {booking?.status || "CONFIRMED"}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-[18px] bg-[#0b8c87]/10 text-[#0b8c87]">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <p className="text-sm text-[#7a7d78]">
                {t("bookingSuccessPage.dateTime")}
              </p>
              <p className="font-semibold text-[#243437]">
                {formatDate(
                  booking?.startDate,
                  language,
                  t("bookingSuccessPage.noDepartureDate"),
                )}{" "}
                · {t("bookingSuccessPage.daysLabel", { days: booking?.tour?.numberOfDay || 1 })}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-[18px] bg-[#0b8c87]/10 text-[#0b8c87]">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-sm text-[#7a7d78]">
                {t("bookingSuccessPage.meetingPoint")}
              </p>
              <p className="font-semibold text-[#243437]">
                {booking?.tour?.location || t("bookingSuccessPage.itineraryFallback")}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-[#ede4d7]" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-[#6c6f6a]">
            {t("bookingSuccessPage.totalAmountPaid")}
          </span>
          <span className="text-3xl font-black tracking-tight text-[#0b8c87]">
            {formatCurrencyVND(booking?.totalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
