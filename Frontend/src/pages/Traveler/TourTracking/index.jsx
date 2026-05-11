import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { getTravelerTracking } from "@/services/api/tracking";
import TourTrackingHeader from "./TourTrackingHeader";
import TourTrackingOverviewSection from "./TourTrackingOverviewSection";
import TourTrackingItinerarySection from "./TourTrackingItinerarySection";
import TourTrackingSidebar from "./TourTrackingSidebar";
import { TrackingPageSkeleton } from "@/components/shared/page-skeletons";

export default function TourTracking() {
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    getTravelerTracking(searchParams.get("bookingId"))
      .then((response) => setTracking(response.data.data?.selected || null))
      .catch((error) =>
        toast.error(error?.response?.data?.message || "Cannot load tour tracking"),
      )
      .finally(() => setLoading(false));
  }, [searchParams]);

  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-6 pb-12 pt-24 md:px-10">
        <TourTrackingHeader tracking={tracking} />

        {loading ? (
          <TrackingPageSkeleton />
        ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-8">
            <TourTrackingOverviewSection tracking={tracking} />
            <TourTrackingItinerarySection tracking={tracking} />
          </div>

          <TourTrackingSidebar tracking={tracking} />
        </div>
        )}
      </div>
    </main>
  );
}
