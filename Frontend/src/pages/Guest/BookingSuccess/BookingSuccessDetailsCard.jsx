import { CalendarDays, MapPin } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const formatDate = (value) => {
  if (!value) return "Chưa có ngày khởi hành";
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(value));
};

const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function BookingSuccessDetailsCard({ booking }) {
  return (
    <Card className="overflow-hidden border-0 bg-white py-0 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
      <CardContent className="space-y-6 p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
              Reservation ID
            </p>
            <p className="text-2xl font-black tracking-tight text-slate-950">
              {booking?.bookingCode || "-"}
            </p>
          </div>
          <span className="inline-flex w-fit items-center rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
            {booking?.status || "CONFIRMED"}
          </span>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <CalendarDays className="size-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Date &amp; Time</p>
              <p className="font-semibold text-slate-900">
                {formatDate(booking?.startDate)} • {booking?.tour?.numberOfDay || 1} ngày
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
              <MapPin className="size-5" />
            </div>
            <div>
              <p className="text-sm text-slate-500">Meeting Point</p>
              <p className="font-semibold text-slate-900">
                {booking?.tour?.location || "Theo lịch trình tour"}
              </p>
            </div>
          </div>
        </div>

        <Separator className="bg-slate-200/80" />

        <div className="flex items-center justify-between gap-4">
          <span className="text-slate-500">Total Amount Paid</span>
          <span className="text-3xl font-black tracking-tight text-emerald-700">
            {formatCurrency(booking?.totalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
