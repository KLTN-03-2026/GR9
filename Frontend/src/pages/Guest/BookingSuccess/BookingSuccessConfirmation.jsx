import { CheckCircle2 } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

export default function BookingSuccessConfirmation({ booking }) {
  const { t } = useI18n();
  return (
    <div className="space-y-4">
      <div className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner shadow-emerald-200">
        <CheckCircle2 className="size-9 fill-current stroke-[1.5]" />
      </div>

      <div className="space-y-3">
        <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
          {t("bookingSuccessPage.confirmedTitle")}
        </h1>
        <p className="max-w-xl text-lg leading-8 text-slate-600">
          {t("bookingSuccessPage.confirmedPrefix")}
          <span className="font-bold text-emerald-700">
            {booking?.tour?.name || t("bookingSuccessPage.fallbackTourName")}
          </span>
          {t("bookingSuccessPage.confirmedSuffix")}
        </p>
      </div>
    </div>
  );
}
