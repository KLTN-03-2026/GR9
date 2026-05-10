import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useSearchParams } from "react-router-dom";
import { getPublicTracking } from "@/services/api/tracking";
import TourHeroCard from './TourHeroCard';
import CurrentLocationMap from './CurrentLocationMap';
import LatestUpdateBanner from './LatestUpdateBanner';
import ActivityTimeline from './ActivityTimeline';
import EmergencySupport from './EmergencySupport';

const PublicTourTracking = () => {
  const [searchParams] = useSearchParams();
  const [tracking, setTracking] = useState(null);
  const [loading, setLoading] = useState(true);
  const trackingCode = searchParams.get("trackingCode");

  useEffect(() => {
    if (!trackingCode) {
      setLoading(false);
      return;
    }

    getPublicTracking(trackingCode)
      .then((response) => setTracking(response.data.data))
      .catch((error) =>
        toast.error(error?.response?.data?.message || "Không thể tải tracking public"),
      )
      .finally(() => setLoading(false));
  }, [trackingCode]);

  if (loading) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-24">
        <div className="rounded-3xl bg-white p-8 text-slate-600 shadow-sm">
          Đang tải public tour tracking...
        </div>
      </main>
    );
  }

  if (!tracking) {
    return (
      <main className="mx-auto min-h-screen max-w-7xl px-6 py-24">
        <div className="space-y-4 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            Tracking link không hợp lệ
          </h1>
          <p className="text-slate-600">
            Link có thể đã bị tắt, chưa thanh toán thành công hoặc thiếu mã tracking.
          </p>
          <Link className="font-bold text-teal-700" to="/">
            Về trang chủ
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen pb-24 md:pb-12">
      <main className="pt-24 px-4 md:px-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
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
