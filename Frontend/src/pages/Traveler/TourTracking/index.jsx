import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import { getTravelerTracking } from "@/services/api/tracking";
import TourTrackingHeader from "./TourTrackingHeader";
import TourTrackingOverviewSection from "./TourTrackingOverviewSection";
import TourTrackingItinerarySection from "./TourTrackingItinerarySection";
import TourTrackingSidebar from "./TourTrackingSidebar";
import TrackingTourSelector from "../TrackingTourSelector";
import { TrackingPageSkeleton } from "@/components/shared/page-skeletons";
import { useI18n } from "@/i18n/I18nProvider";

export default function TourTracking() {
  const { t } = useI18n();
  const [tracking, setTracking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    getTravelerTracking(searchParams.get("bookingId"))
      .then((response) => {
        const data = response.data.data || {};
        setTracking(data.selected || null);
        setBookings(data.bookings || []);
      })
      .catch((error) =>
        toast.error(error?.response?.data?.message || t("tracking.cannotLoad")),
      )
      .finally(() => setLoading(false));
  }, [searchParams, t]);

  const handleSelectBooking = (bookingId) => {
    if (!bookingId || bookingId === tracking?.bookingId) return;
    setSearchParams({ bookingId });
  };

  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 pb-10 pt-6 sm:px-6 md:px-10 md:pt-24">
        <TourTrackingHeader tracking={tracking} />

        {loading ? (
          <TrackingPageSkeleton />
        ) : (
          <div className="space-y-8">
            <TrackingTourSelector
              bookings={bookings}
              selectedBookingId={tracking?.bookingId}
              onSelect={handleSelectBooking}
              title={t("tracking.myTrackedTours")}
              description={t("tracking.selectTourHint")}
            />

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
              <div className="space-y-8 lg:col-span-8">
                <TourTrackingOverviewSection tracking={tracking} />
                <TourTrackingItinerarySection tracking={tracking} />
              </div>

              <TourTrackingSidebar tracking={tracking} />
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
