import GuideLiveTourTrackingFooterActions from "./GuideLiveTourTrackingFooterActions";
import GuideLiveTourTrackingSidebar from "./GuideLiveTourTrackingSidebar";
import GuideLiveTourTrackingTimeline from "./GuideLiveTourTrackingTimeline";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/page-hero";

export default function GuideLiveTourTracking() {
  return (
    <div className="space-y-8 px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 pb-12 pt-16">
        <PageHero
          eyebrow="Live Operations"
          heading={
            <>
              Tour{" "}
              <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
                Tracking
              </span>
            </>
          }
          description="Coordinate live checkpoints, monitor route progress, and respond to field changes from a single tracking workspace."
          actions={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-outline-variant/30 bg-white px-5 font-semibold text-slate-600"
              >
                Contact Operations
              </Button>
              <Button className="h-11 rounded-2xl bg-primary px-5 font-semibold text-on-primary shadow-md shadow-primary/10">
                Mark Tour Active
              </Button>
            </div>
          }
        />
        <div className="flex flex-col gap-8 md:flex-row">
          <GuideLiveTourTrackingTimeline />
          <GuideLiveTourTrackingSidebar />
        </div>

        <GuideLiveTourTrackingFooterActions />
      </div>
    </div>
  );
}
