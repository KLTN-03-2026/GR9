import ProviderBookingTable from "./ProviderBookingTable";
import PageHero from "@/components/shared/page-hero";
import { useI18n } from "@/i18n/I18nProvider";

export default function ProviderBookingManagement() {
  const { t } = useI18n();

  return (
    <div className="space-y-6 text-on-surface sm:space-y-8">
      <PageHero
        eyebrow={t("provider.bookings.heroEyebrow")}
        heading={
          <>
            {t("provider.bookings.titleA")}{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              {t("provider.bookings.titleB")}
            </span>
          </>
        }
        description={t("provider.bookings.description")}
      />
      <ProviderBookingTable />
    </div>
  );
}
