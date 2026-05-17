import { CheckCircle2 } from "lucide-react";

import { useI18n } from "@/i18n/I18nProvider";

export default function BookingSuccessConfirmation({ booking }) {
  const { t } = useI18n();

  return (
    <div className="space-y-5">
      <div className="inline-flex h-16 w-16 items-center justify-center rounded-[22px] border border-[#cde4de] bg-[#eaf7f3] text-[#0b8c87] shadow-inner shadow-[#d7eee8] dark:border-primary/30 dark:bg-primary/12 dark:text-primary">
        <CheckCircle2 className="size-8 stroke-[1.7]" />
      </div>

      <div className="space-y-3">
        <p className="text-sm font-black uppercase tracking-[0.24em] text-[#9f7d52] dark:text-primary-fixed">
          {t("bookingSuccessPage.heroBadge")}
        </p>
        <h1 className="max-w-3xl [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.7rem] leading-[0.96] tracking-[-0.04em] text-[#1f2d2f] dark:text-on-surface md:text-[4.1rem]">
          {t("bookingSuccessPage.confirmedTitle")}
        </h1>
        <p className="max-w-2xl text-base leading-8 text-[#61645f] dark:text-on-surface-variant md:text-[1.04rem]">
          {t("bookingSuccessPage.confirmedPrefix")}
          <span className="font-bold text-[#0b8c87] dark:text-primary">
            {booking?.tour?.name || t("bookingSuccessPage.fallbackTourName")}
          </span>
          {t("bookingSuccessPage.confirmedSuffix")}
        </p>
      </div>
    </div>
  );
}
