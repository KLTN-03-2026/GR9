import { CheckCircle2 } from "lucide-react";

export default function BookingSuccessConfirmation({ booking }) {
  return (
    <div className="space-y-4">
      <div className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner shadow-emerald-200">
        <CheckCircle2 className="size-9 fill-current stroke-[1.5]" />
      </div>

      <div className="space-y-3">
        <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          Booking Confirmed
        </h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600">
          Thanh toán thành công. Tour{" "}
          <span className="font-bold text-emerald-700">
            {booking?.tour?.name || "của bạn"}
          </span>{" "}
          đã được xác nhận và link tracking đã sẵn sàng để chia sẻ.
        </p>
      </div>
    </div>
  );
}
