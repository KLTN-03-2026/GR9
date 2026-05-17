import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import BrandLogo from "@/components/shared/brand-logo";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/i18n/I18nProvider";
import { getGuestBookingSuccess } from "@/services/api/guest";

import BookingSuccessConfirmation from "./BookingSuccessConfirmation";
import BookingSuccessDetailsCard from "./BookingSuccessDetailsCard";
import BookingSuccessSidebar from "./BookingSuccessSidebar";
import BookingSuccessTrackingCard from "./BookingSuccessTrackingCard";

export default function BookingSuccess() {
  const { t } = useI18n();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const orderCode = searchParams.get("orderCode");
  const trackingCode = searchParams.get("trackingCode");

  useEffect(() => {
    const loadBookingSuccess = async () => {
      if (!orderCode && !trackingCode) {
        setLoading(false);
        return;
      }

      try {
        const response = await getGuestBookingSuccess({ orderCode, trackingCode });
        const bookingData = response.data.data;

        if (orderCode && bookingData?.status !== "CONFIRMED") {
          navigate("/traveler/my-booking-traveler", { replace: true });
          return;
        }

        setBooking(bookingData);
      } catch (error) {
        toast.error(error?.response?.data?.message || t("bookingSuccessPage.loadError"));
      } finally {
        setLoading(false);
      }
    };

    loadBookingSuccess();
  }, [navigate, orderCode, trackingCode, t]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-16 dark:bg-background sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 text-slate-600 shadow-sm dark:bg-surface-container-lowest dark:text-on-surface-variant">
          {t("bookingSuccessPage.loading")}
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#f8fafc] px-4 py-16 dark:bg-background sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl rounded-3xl bg-white p-8 shadow-sm dark:bg-surface-container-lowest">
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-slate-950 dark:text-on-surface">
              {t("bookingSuccessPage.notFoundTitle")}
            </h1>
            <p className="text-slate-600 dark:text-on-surface-variant">
              {t("bookingSuccessPage.notFoundDescription")}
            </p>
            <Link className="font-bold text-teal-700 dark:text-primary" to="/traveler/my-booking-traveler">
              {t("bookingSuccessPage.backToMyBooking")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8fafc] pb-24 dark:bg-background md:pb-12">
      <div className="mx-auto w-full max-w-7xl px-4 pt-16 md:px-8 md:pt-24">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-full border border-slate-200 bg-white px-4 text-slate-700 hover:bg-slate-100 dark:border-outline-variant dark:bg-surface-container-lowest dark:text-on-surface dark:hover:bg-surface-container"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("bookingSuccessPage.backToMyBooking")}
          </Button>

          <BrandLogo
            variant="editorial"
            className="gap-3"
            iconClassName="size-10"
            showTagline
            subLabel="Vietnam"
          />
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-12 lg:gap-8">
          <section className="space-y-8 lg:col-span-7">
            <BookingSuccessConfirmation booking={booking} />
            <BookingSuccessDetailsCard booking={booking} />
            <BookingSuccessTrackingCard booking={booking} />
          </section>

          <BookingSuccessSidebar booking={booking} />
        </div>
      </div>
    </main>
  );
}
