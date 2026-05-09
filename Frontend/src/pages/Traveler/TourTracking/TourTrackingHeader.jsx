import PageHero from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TourTrackingHeader({ tracking }) {
  const tourName = tracking?.tour?.name || "No active tour";
  const [firstWord, ...restWords] = tourName.split(" ");
  const startDay = tracking?.schedule?.startDay;

  return (
    <PageHero
      eyebrow="Live Tracking"
      heading={
        <>
          {firstWord || "Tour"}{" "}
          <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
            {restWords.join(" ") || "Tracking"}
          </span>
        </>
      }
      description={
        tracking
          ? `${tracking.tour.location} • Start date: ${startDay || "-"} • Day ${
              tracking.schedule.currentDay
            } of ${tracking.tour.numberOfDay}`
          : "Paid tour tracking will appear here."
      }
      meta={
        <Badge className="inline-flex rounded-full border-0 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-700">
          <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-teal-500" />
          {tracking?.status || "No tour"}
        </Badge>
      }
      actions={
        <>
          <Button
            type="button"
            variant="outline"
            className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-lowest px-5 font-semibold text-on-surface hover:bg-surface-container"
          >
            <span className="material-symbols-outlined mr-2">
              contact_emergency
            </span>
            Emergency Protocol
          </Button>

          <Button
            type="button"
            className="h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
          >
            <span className="material-symbols-outlined mr-2">
              send_to_mobile
            </span>
            Broadcast Update
          </Button>
        </>
      }
    />
  );
}
