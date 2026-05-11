import { ChevronRight } from "lucide-react";

import PageHero from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import { useI18n } from "@/i18n/I18nProvider";

export default function TrackingLinkHero({ tracking }) {
  const { t } = useI18n();
  const tourName = tracking?.tour?.name || t("trackingLink.noPaidTour");
  const [firstWord, ...restWords] = tourName.split(" ");

  return (
    <PageHero
      eyebrow={t("trackingLink.access")}
      heading={
        <>
          {firstWord || t("trackingLink.tracking")}{" "}
          <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
            {restWords.join(" ") || t("trackingLink.management")}
          </span>
        </>
      }
      description={
        tracking
          ? `${tracking.tour.location} • ${tracking.schedule.startDay || "-"} - ${
              tracking.schedule.endDay || "-"
            }`
          : t("trackingLink.paidBookingsHint")
      }
      meta={
        <div className="space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-on-surface-variant"
          >
            <span>{t("trackingLink.myTours")}</span>
            <ChevronRight className="size-4" />
            <span className="font-medium text-primary">
              {t("trackingLink.booking")} {tracking?.bookingCode || "-"}
            </span>
          </nav>

          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-primary-fixed px-3 py-1 text-on-primary-fixed">
              {tracking?.status || t("trackingLink.noBooking")}
            </Badge>
            <Badge className="rounded-full bg-secondary-container px-3 py-1 text-on-secondary-container">
              {t("trackingLink.shareable")}
            </Badge>
          </div>
        </div>
      }
    />
  );
}
