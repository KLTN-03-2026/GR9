import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

export default function BookingActionsSection() {
  const { t } = useI18n();
  return (
    <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="rounded-3xl border-none bg-surface-container-low py-0 lg:col-span-2">
        <CardContent className="p-8">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
              <span className="material-symbols-outlined">
                travel_explore
              </span>
            </div>
            <div>
              <CardTitle className="brand-font text-xl font-bold text-on-surface">
                {t("bookingPage.needAnother")}
              </CardTitle>
              <CardDescription className="mt-2 max-w-xl text-sm text-on-surface-variant">
                {t("bookingPage.needAnotherText")}
              </CardDescription>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-3xl border-none bg-gradient-to-br from-primary to-primary-container py-0 text-left text-on-primary shadow-lg shadow-primary/20">
        <CardContent className="p-8">
          <span className="material-symbols-outlined mb-6 text-4xl">
            auto_awesome
          </span>
          <CardTitle className="brand-font mb-2 text-xl font-bold">
            {t("bookingPage.planNewTrip")}
          </CardTitle>
          <CardDescription className="text-sm text-on-primary/80">
            {t("bookingPage.planNewTripText")}
          </CardDescription>
          <Button
            type="button"
            variant="secondary"
            className="mt-6 bg-white/15 text-on-primary hover:bg-white/20"
          >
            {t("bookingPage.openPlanner")}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
