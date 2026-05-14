import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import bayHero from "@/assets/redesign/bay-hero.png";
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
      <main className="min-h-screen bg-[#f6f1e7] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-[#e8ded0] bg-white/90 p-8 text-[#61645f] shadow-[0_24px_70px_rgba(38,33,28,0.08)]">
          {t("bookingSuccessPage.loading")}
        </div>
      </main>
    );
  }

  if (!booking) {
    return (
      <main className="min-h-screen bg-[#f6f1e7] px-4 py-16 sm:px-6 sm:py-24">
        <div className="mx-auto max-w-7xl rounded-[30px] border border-[#e8ded0] bg-white/92 p-8 shadow-[0_24px_70px_rgba(38,33,28,0.08)]">
          <div className="space-y-4">
            <h1 className="text-2xl font-black text-[#233236]">
              {t("bookingSuccessPage.notFoundTitle")}
            </h1>
            <p className="text-[#61645f]">
              {t("bookingSuccessPage.notFoundDescription")}
            </p>
            <Link className="font-bold text-[#0b8c87]" to="/traveler/my-booking-traveler">
              {t("bookingSuccessPage.backToMyBooking")}
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#f6f1e7] text-[#213033]">
      <div className="absolute inset-x-0 top-0 h-[24rem] overflow-hidden">
        <img
          src={bayHero}
          alt=""
          className="h-full w-full object-cover object-center opacity-35"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(246,241,231,0.08)_0%,rgba(246,241,231,0.55)_42%,#f6f1e7_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(246,210,165,0.38),transparent_26%),radial-gradient(circle_at_top_right,rgba(11,140,135,0.16),transparent_22%)]" />
      </div>

      <div className="relative mx-auto w-full max-w-7xl px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pt-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate(-1)}
            className="rounded-full border border-[#ddd0bf] bg-white/55 px-4 text-[#324347] hover:bg-white/80"
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
