import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyVND } from "@/utils/formatPrice";
import { useI18n } from "@/i18n/I18nProvider";

const getDisplayStatus = (booking) => booking.displayStatus || booking.status;

export default function BookingStatsSection({ bookings = [], loading = false }) {
  const { t } = useI18n();

  const confirmedCount = bookings.filter(
    (booking) => getDisplayStatus(booking) === "CONFIRMED",
  ).length;
  const pendingCount = bookings.filter(
    (booking) =>
      getDisplayStatus(booking) === "PENDING" || booking.payment === "UNPAID",
  ).length;
  const totalSpent = bookings
    .filter((booking) => booking.payment === "PAID")
    .reduce((total, booking) => total + Number(booking.totalAmount || 0), 0);

  return (
    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.04)]">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-on-surface-variant">
              {t("bookingPage.confirmed")}
            </span>
            <span className="material-symbols-outlined text-primary">
              check_circle
            </span>
          </div>
          <div className="brand-font text-3xl font-bold">
            {loading ? "..." : confirmedCount}
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            {t("bookingPage.upcomingExperiences")}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.04)]">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-on-surface-variant">{t("bookingPage.pending")}</span>
            <span className="material-symbols-outlined text-tertiary">
              hourglass_empty
            </span>
          </div>
          <div className="brand-font text-3xl font-bold">
            {loading ? "..." : pendingCount}
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            {t("bookingPage.awaitingProvider")}
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.04)]">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-on-surface-variant">
              {t("bookingPage.totalSpent")}
            </span>
            <span className="material-symbols-outlined text-teal-600">
              account_balance_wallet
            </span>
          </div>
          <div className="brand-font text-3xl font-bold">
            {loading ? "..." : formatCurrencyVND(totalSpent)}
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            {t("bookingPage.acrossPaid")}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
