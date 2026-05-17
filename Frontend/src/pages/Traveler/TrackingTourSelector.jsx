import { CalendarDays, CheckCircle2, Circle, MapPin } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { cn } from "@/lib/utils";

const STATUS_TONE = {
  completed: "bg-surface-container-high text-on-surface-variant",
  cancelled: "bg-surface-container-high text-on-surface-variant",
  refunded: "bg-surface-container-high text-on-surface-variant",
  ongoing: "bg-primary-fixed text-on-primary-fixed",
  upcoming: "bg-secondary-container text-on-secondary-container",
};

export default function TrackingTourSelector({
  bookings = [],
  selectedBookingId,
  onSelect,
  title,
  eyebrow,
  description,
}) {
  const { t } = useI18n();

  if (!bookings.length) return null;

  const statusLabel = {
    ongoing: t("tracking.statuses.ongoing"),
    upcoming: t("tracking.statuses.upcoming"),
    completed: t("tracking.statuses.completed"),
    cancelled: t("tracking.statuses.cancelled"),
    refunded: t("tracking.statuses.refunded"),
  };

  return (
    <section className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest p-5 shadow-[0_18px_40px_rgba(25,28,30,0.06)]">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.22em] text-primary">
            {eyebrow || t("tracking.selectTour")}
          </p>
          <h2 className="mt-1 font-headline text-xl font-bold text-on-surface">
            {title || t("tracking.myTrackedTours")}
          </h2>
          {description ? (
            <p className="mt-1 text-sm text-on-surface-variant">{description}</p>
          ) : null}
        </div>
        <Badge className="w-fit rounded-full bg-secondary-container px-3 py-1 text-on-secondary-container">
          {t("tracking.tourCount", { count: bookings.length })}
        </Badge>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {bookings.map((booking) => {
          const isSelected = booking.bookingId === selectedBookingId;
          const tone = STATUS_TONE[booking.status] || STATUS_TONE.upcoming;

          return (
            <Button
              key={booking.bookingId}
              type="button"
              variant="ghost"
              onClick={() => onSelect?.(booking.bookingId)}
              className={cn(
                "h-auto justify-start rounded-2xl border p-4 text-left transition-all",
                isSelected
                  ? "border-primary/35 bg-primary/10 text-primary shadow-sm"
                  : "border-outline-variant/20 bg-surface-container-low text-on-surface hover:bg-surface-container",
              )}
            >
              <div className="flex w-full min-w-0 gap-3">
                <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  {isSelected ? (
                    <CheckCircle2 className="size-5" />
                  ) : (
                    <Circle className="size-4" />
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-3">
                    <p className="truncate text-sm font-black">
                      {booking.tourName || t("tracking.tour")}
                    </p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        tone,
                      )}
                    >
                      {statusLabel[booking.status] || booking.status}
                    </span>
                  </div>

                  <p className="mt-2 flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
                    <MapPin className="size-3.5" />
                    <span className="truncate">{booking.location || "-"}</span>
                  </p>
                  <p className="mt-1 flex items-center gap-1 text-xs font-semibold text-on-surface-variant">
                    <CalendarDays className="size-3.5" />
                    <span className="truncate">
                      {booking.startDay || "-"} · {booking.bookingCode || "-"}
                    </span>
                  </p>
                </div>
              </div>
            </Button>
          );
        })}
      </div>
    </section>
  );
}
