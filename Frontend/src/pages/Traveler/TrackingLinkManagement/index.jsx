import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import {
  getTravelerTracking,
  regenerateTrackingLink,
} from "@/services/api/tracking";
import TrackingLinkHero from "./TrackingLinkHero";
import TrackingLinkOverviewSection from "./TrackingLinkOverviewSection";
import TrackingLinkAccessCard from "./TrackingLinkAccessCard";
import TrackingLinkPrivacyNote from "./TrackingLinkPrivacyNote";
import TrackingTourSelector from "../TrackingTourSelector";
import { TrackingPageSkeleton } from "@/components/shared/page-skeletons";
import { useI18n } from "@/i18n/I18nProvider";

export default function TrackingLinkManagement() {
  const { t } = useI18n();
  const [tracking, setTracking] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();

  const loadTracking = async () => {
    try {
      setLoading(true);
      const response = await getTravelerTracking(searchParams.get("bookingId"));
      const data = response.data.data || {};
      setTracking(data.selected || null);
      setBookings(data.bookings || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || t("trackingLink.cannotLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracking();
  }, [searchParams]);

  const handleRegenerate = async () => {
    if (!tracking?.bookingId) return;

    try {
      const response = await regenerateTrackingLink(tracking.bookingId);
      setTracking((prev) => ({
        ...prev,
        trackingCode: response.data.data?.trackingCode,
        trackingUrl: response.data.data?.trackingUrl,
      }));
      toast.success(t("trackingLink.regenerated"));
    } catch (error) {
      toast.error(error?.response?.data?.message || t("trackingLink.cannotRegenerate"));
    }
  };

  const handleSelectBooking = (bookingId) => {
    if (!bookingId || bookingId === tracking?.bookingId) return;
    setSearchParams({ bookingId });
  };

  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
      <div className="mx-auto w-full max-w-[1600px] space-y-8 px-4 pb-10 pt-6 text-on-surface sm:px-6 md:px-10 md:pt-24 lg:space-y-10">
        <TrackingLinkHero tracking={tracking} />

        {loading ? (
          <TrackingPageSkeleton />
        ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="space-y-8 lg:col-span-7">
            <TrackingTourSelector
              bookings={bookings}
              selectedBookingId={tracking?.bookingId}
              onSelect={handleSelectBooking}
              eyebrow={t("trackingLink.management")}
              title={t("tracking.myTrackedTours")}
              description={t("tracking.selectTourHint")}
            />

            <TrackingLinkOverviewSection tracking={tracking} />
          </section>

          <aside className="space-y-8 lg:col-span-5">
            <TrackingLinkAccessCard
              tracking={tracking}
              onRegenerate={handleRegenerate}
            />
            <TrackingLinkPrivacyNote />
          </aside>
        </div>
        )}
      </div>
    </main>
  );
}
