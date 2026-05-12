import { Megaphone } from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const LatestUpdateBanner = ({ tracking }) => {
  const { t } = useI18n();
  const nextActivity = tracking?.progress?.nextActivity;

  return (
    <div className="bg-teal-900 text-white rounded-3xl p-6 shadow-xl shadow-teal-900/10 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <Megaphone className="w-5 h-5 text-teal-400" />
        <h2 className="font-bold tracking-wider text-sm uppercase">{t("publicTrackingPage.latestUpdate")}</h2>
        <span className="text-[10px] font-medium opacity-60 ml-auto">
          {tracking?.schedule?.localTime || "--:--"}
        </span>
      </div>
      <p className="text-lg font-medium leading-relaxed relative z-10 pr-12">
        {nextActivity
          ? t("publicTrackingPage.latestUpdateLine", { name: nextActivity.name, time: nextActivity.time })
          : tracking?.today?.description || t("publicTrackingPage.latestUpdateFallback")}
      </p>
      <Megaphone className="absolute -right-6 -bottom-6 size-40 text-white opacity-5 rotate-12" />
    </div>
  );
};

export default LatestUpdateBanner;
