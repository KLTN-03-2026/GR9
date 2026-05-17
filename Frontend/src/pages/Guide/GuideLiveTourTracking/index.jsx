import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useSearchParams } from "react-router-dom";
import GuideLiveTourTrackingFooterActions from "./GuideLiveTourTrackingFooterActions";
import GuideLiveTourTrackingSidebar from "./GuideLiveTourTrackingSidebar";
import GuideLiveTourTrackingTimeline from "./GuideLiveTourTrackingTimeline";
import { Button } from "@/components/ui/button";
import PageHero from "@/components/shared/page-hero";
import { TrackingPageSkeleton } from "@/components/shared/page-skeletons";
import {
  getGuideLiveTracking,
  updateGuideLiveActivityStatus,
} from "@/services/api/guide";
import { useI18n } from "@/i18n/I18nProvider";

export default function GuideLiveTourTracking() {
  const { t } = useI18n();
  const [tracking, setTracking] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingActivityId, setUpdatingActivityId] = useState(null);
  const [searchParams] = useSearchParams();

  const loadTracking = async (bookingId) => {
    setLoading(true);
    try {
      const response = await getGuideLiveTracking(bookingId);
      setTracking(response.data.data?.selected || null);
      setTours(response.data.data?.tours || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || t("guidePages.liveTracking.loadError"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTracking(searchParams.get("bookingId"));
  }, [searchParams]);

  const handleUpdateActivityStatus = async (activityId, statusActivity) => {
    if (!tracking?.bookingId || !activityId) return;
    if (tracking.status === "completed") {
      toast.error("Tour đã kết thúc, không thể cập nhật live tracking");
      return;
    }

    setUpdatingActivityId(activityId);
    try {
      const response = await updateGuideLiveActivityStatus(
        tracking.bookingId,
        activityId,
        statusActivity,
      );
      setTracking(response.data.data);
      toast.success(
        statusActivity === "DONE"
          ? "Đã đánh dấu hoàn thành hoạt động"
          : "Đã mở lại hoạt động",
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || t("guidePages.liveTracking.updateError"));
    } finally {
      setUpdatingActivityId(null);
    }
  };

  return (
    <div className="space-y-8 px-4 py-8 md:px-8">
      <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-8 pb-12 pt-16">
        <PageHero
          eyebrow={t("guidePages.liveTracking.heroEyebrow")}
          heading={
            <>
              {t("guidePages.liveTracking.headingA")}{" "}
              <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
                {t("guidePages.liveTracking.headingB")}
              </span>
            </>
          }
          description={t("guidePages.liveTracking.description")}
          actions={
            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                variant="outline"
                className="h-11 rounded-2xl border-outline-variant/30 bg-white px-5 font-semibold text-slate-600"
              >
                {t("guidePages.liveTracking.contactOperations")}
              </Button>
              <Button className="h-11 rounded-2xl bg-primary px-5 font-semibold text-on-primary shadow-md shadow-primary/10">
                {tracking?.status === "completed"
                  ? "Tour đã kết thúc"
                  : tracking?.status === "ongoing"
                    ? t("guidePages.liveTracking.tourActive")
                    : t("guidePages.liveTracking.upcomingTour")}
              </Button>
            </div>
          }
        />

        {loading ? (
          <TrackingPageSkeleton />
        ) : !tracking ? (
          <div className="rounded-2xl bg-white p-8 text-on-surface-variant shadow-sm">
            {t("guidePages.liveTracking.noActiveTour")}
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-8 md:flex-row">
              <GuideLiveTourTrackingTimeline
                tracking={tracking}
                onUpdateActivityStatus={handleUpdateActivityStatus}
                updatingActivityId={updatingActivityId}
              />
              <GuideLiveTourTrackingSidebar
                tracking={tracking}
                tours={tours}
                onSelectTour={(bookingId) => loadTracking(bookingId)}
              />
            </div>

            <GuideLiveTourTrackingFooterActions tracking={tracking} />
          </>
        )}
      </div>
    </div>
  );
}
