import { ChevronRight } from "lucide-react";

import PageHero from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";

export default function TrackingLinkHero({ tracking }) {
  const tourName = tracking?.tour?.name || "No paid tour yet";
  const [firstWord, ...restWords] = tourName.split(" ");

  return (
    <PageHero
      eyebrow="Tracking Access"
      heading={
        <>
          {firstWord || "Tracking"}{" "}
          <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
            {restWords.join(" ") || "Management"}
          </span>
        </>
      }
      description={
        tracking
          ? `${tracking.tour.location} • ${tracking.schedule.startDay || "-"} - ${
              tracking.schedule.endDay || "-"
            }`
          : "Paid bookings will appear here after checkout."
      }
      meta={
        <div className="space-y-4">
          <nav
            aria-label="Breadcrumb"
            className="flex items-center gap-2 text-sm text-on-surface-variant"
          >
            <span>My Tours</span>
            <ChevronRight className="size-4" />
            <span className="font-medium text-primary">
              Booking {tracking?.bookingCode || "-"}
            </span>
          </nav>

          <div className="flex flex-wrap gap-2">
            <Badge className="rounded-full bg-primary-fixed px-3 py-1 text-on-primary-fixed">
              {tracking?.status || "No booking"}
            </Badge>
            <Badge className="rounded-full bg-secondary-container px-3 py-1 text-on-secondary-container">
              Shareable live tracking
            </Badge>
          </div>
        </div>
      }
    />
  );
}
