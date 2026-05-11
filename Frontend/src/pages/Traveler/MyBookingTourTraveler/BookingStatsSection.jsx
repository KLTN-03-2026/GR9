import { Card, CardContent } from "@/components/ui/card";
import { formatCurrencyVND } from "@/utils/formatPrice";

export default function BookingStatsSection() {
  return (
    <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
      <Card className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.04)]">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-on-surface-variant">
              Confirmed
            </span>
            <span className="material-symbols-outlined text-primary">
              check_circle
            </span>
          </div>
          <div className="brand-font text-3xl font-bold">1</div>
          <p className="mt-1 text-xs text-on-surface-variant">
            Upcoming experiences
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.04)]">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-on-surface-variant">Pending</span>
            <span className="material-symbols-outlined text-tertiary">
              hourglass_empty
            </span>
          </div>
          <div className="brand-font text-3xl font-bold">1</div>
          <p className="mt-1 text-xs text-on-surface-variant">
            Awaiting provider confirmation
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.04)]">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <span className="font-medium text-on-surface-variant">
              Total Spent
            </span>
            <span className="material-symbols-outlined text-teal-600">
              account_balance_wallet
            </span>
          </div>
          <div className="brand-font text-3xl font-bold">
            {formatCurrencyVND(3858000)}
          </div>
          <p className="mt-1 text-xs text-on-surface-variant">
            Across paid bookings
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
