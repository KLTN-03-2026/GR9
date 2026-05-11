import PageHero from "@/components/shared/page-hero";
import { useI18n } from "@/i18n/I18nProvider";

export default function BookingHeader() {
  const { t } = useI18n();
  return (
    <PageHero
      className="mb-10"
      eyebrow={t("bookingPage.eyebrow")}
      heading={
        <>
          {t("bookingPage.headingA")}{" "}
          <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
            {t("bookingPage.headingB")}
          </span>
          .
        </>
      }
      description={t("bookingPage.description")}
    />
  );
}
