import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getGuestBookingSuccess } from "@/services/api/guest";
import BookingSuccessConfirmation from "./BookingSuccessConfirmation";
import BookingSuccessDetailsCard from "./BookingSuccessDetailsCard";
import BookingSuccessTrackingCard from "./BookingSuccessTrackingCard";
import BookingSuccessSidebar from "./BookingSuccessSidebar";
import { useI18n } from "@/i18n/I18nProvider";

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
        toast.error(
          error?.response?.data?.message ||
            t("bookingSuccessPage.loadError"),
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookingSuccess();
  }, [navigate, orderCode, trackingCode, t]);

  if (loading) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="rounded-3xl bg-white p-8 text-slate-600 shadow-sm">
          {t("bookingSuccessPage.loading")}
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24">
        <div className="space-y-4 rounded-3xl bg-white p-8 shadow-sm">
          <h1 className="text-2xl font-black text-slate-950">
            {t("bookingSuccessPage.notFoundTitle")}
          </h1>
          <p className="text-slate-600">
            {t("bookingSuccessPage.notFoundDescription")}
          </p>
          <Link
            className="font-bold text-emerald-700"
            to="/traveler/my-booking-traveler"
          >
            {t("bookingSuccessPage.backToMyBooking")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <div>
      <main className="mx-auto grid w-full max-w-7xl gap-6 px-4 pb-16 sm:px-6 lg:grid-cols-12 lg:gap-8">
        <section className="space-y-8 lg:col-span-7">
          <BookingSuccessConfirmation booking={booking} />
          <BookingSuccessDetailsCard booking={booking} />
          <BookingSuccessTrackingCard booking={booking} />
        </section>

        <BookingSuccessSidebar booking={booking} />
      </main>
    </div>
  );
}
