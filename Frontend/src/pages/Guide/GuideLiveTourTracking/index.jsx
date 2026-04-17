import GuideLiveTourTrackingFooterActions from "./GuideLiveTourTrackingFooterActions";
import GuideLiveTourTrackingSidebar from "./GuideLiveTourTrackingSidebar";
import GuideLiveTourTrackingTimeline from "./GuideLiveTourTrackingTimeline";

export default function GuideLiveTourTracking() {
  return (
    <div className="space-y-8 px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <div className="flex flex-col gap-8 md:flex-row">
          <GuideLiveTourTrackingTimeline />
          <GuideLiveTourTrackingSidebar />
        </div>

        <GuideLiveTourTrackingFooterActions />
      </div>
    </div>
  );
}
