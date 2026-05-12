import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { getGuestTracking } from "@/services/api/guest";
import TourHeroCard from './TourHeroCard';
import CurrentLocationMap from './CurrentLocationMap';
import LatestUpdateBanner from './LatestUpdateBanner';
import ActivityTimeline from './ActivityTimeline';
import EmergencySupport from './EmergencySupport';
import { TrackingPageSkeleton } from "@/components/shared/page-skeletons";
import { useI18n } from "@/i18n/I18nProvider";

const PublicTourTracking = () => {
  const { t } = useI18n();
  const [searchParams] = useSearchParams();
  const [tracking, setTracking] = useState(null);
  const trackingCode = searchParams.get("trackingCode");
  const [loading, setLoading] = useState(Boolean(trackingCode));

  useEffect(() => {
    if (!trackingCode) {
      return;
    }

    getGuestTracking(trackingCode)
      .then((response) => setTracking(response.data.data))
      .catch((error) =>
        toast.error(error?.response?.data?.message || t("guestHeader.loadTrackingError")),
      )
      .finally(() => setLoading(false));
  }, [trackingCode, t]);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <TrackingPageSkeleton />
      </main>
    );
  }

  if (!tracking) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="space-y-4 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            {t("guestHeader.invalidTrackingTitle")}
          </h1>
          <p className="text-slate-600">
            {t("guestHeader.invalidTrackingDescription")}
          </p>
          <Link className="font-bold text-teal-700" to="/">
            {t("guestHeader.backHome")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-12">
      <main className="mx-auto grid max-w-7xl grid-cols-1 gap-6 px-4 pt-16 md:px-8 md:pt-24 lg:grid-cols-12 lg:gap-8">
        
        <div className="lg:col-span-8 flex flex-col gap-8">
          <TourHeroCard tracking={tracking} />
          <CurrentLocationMap tracking={tracking} />
          <LatestUpdateBanner tracking={tracking} />
        </div>

        <div className="lg:col-span-4 flex flex-col gap-8">
          <ActivityTimeline tracking={tracking} />
          <EmergencySupport />
        </div>
        
      </main>
    </div>
  );
};

export default PublicTourTracking;
