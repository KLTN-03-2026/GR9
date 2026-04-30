import TourTrackingHeader from "./TourTrackingHeader";
import TourTrackingOverviewSection from "./TourTrackingOverviewSection";
import TourTrackingItinerarySection from "./TourTrackingItinerarySection";
import TourTrackingSidebar from "./TourTrackingSidebar";

export default function TourTracking() {
  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface md:ml-64">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-6 pb-12 pt-24 md:px-10">
        <TourTrackingHeader />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <TourTrackingOverviewSection />
            <TourTrackingItinerarySection />
          </div>

          <TourTrackingSidebar />
        </div>
      </div>
    </main>
  );
}
