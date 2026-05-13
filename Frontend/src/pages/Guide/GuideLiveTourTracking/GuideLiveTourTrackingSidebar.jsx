import { useEffect, useMemo, useState } from "react";
import { Phone, Stethoscope } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { geocodeAddress } from "@/services/api/location";
import { useI18n } from "@/i18n/I18nProvider";

export default function GuideLiveTourTrackingSidebar({
  tracking,
  tours,
  onSelectTour,
}) {
  const { t } = useI18n();
  const [mapQuery, setMapQuery] = useState("");
  const activities = tracking?.today?.activities || [];
  const activeActivity = useMemo(
    () =>
      activities.find((activity) => activity.state === "ongoing") ||
      tracking?.progress?.nextActivity ||
      activities.find((activity) => activity.address || activity.name) ||
      null,
    [activities, tracking],
  );

  useEffect(() => {
    let ignore = false;

    const resolveMap = async () => {
      const query =
        activeActivity?.address ||
        [activeActivity?.name, tracking?.tour?.location].filter(Boolean).join(", ") ||
        tracking?.tour?.location ||
        "";

      if (!query) {
        setMapQuery("");
        return;
      }

      if (activeActivity?.lat && activeActivity?.long) {
        setMapQuery(`${activeActivity.lat},${activeActivity.long}`);
        return;
      }

      try {
        const response = await geocodeAddress(query);
        const location = response.data?.data;

        if (!ignore && location?.lat && location?.lng) {
          setMapQuery(`${location.lat},${location.lng}`);
        } else if (!ignore) {
          setMapQuery(query);
        }
      } catch {
        if (!ignore) setMapQuery(query);
      }
    };

    resolveMap();

    return () => {
      ignore = true;
    };
  }, [activeActivity, tracking]);

  const mapSrc = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`
    : "";

  return (
    <div className="w-full space-y-6 md:w-[400px]">
      <Card className="overflow-hidden rounded-xl border border-outline-variant/10 py-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-outline-variant/10 px-4 py-4">
          <CardTitle className="font-headline text-base font-bold text-on-surface">
            {t("guidePages.liveTracking.liveTrackingMap")}
          </CardTitle>
          <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600">
            GOOGLE MAP
          </span>
        </CardHeader>

        <CardContent className="relative h-64 p-0">
          {mapSrc ? (
            <iframe
              title="Guide live tracking map"
              className="h-full w-full border-0"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-container text-sm font-semibold text-on-surface-variant">
              {t("guidePages.liveTracking.mapUnavailable")}
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant/10 py-0 shadow-sm">
        <CardHeader className="border-b border-outline-variant/10 px-4 py-4">
          <CardTitle className="font-headline text-base font-bold text-on-surface">
            {t("guidePages.liveTracking.assignedLiveTours")}
          </CardTitle>
        </CardHeader>

        <CardContent className="p-4">
          {tours?.length ? (
            <div className="space-y-3 md:max-h-[320px] md:overflow-y-auto md:pr-1">
              {tours.map((tour) => (
                <Button
                  key={tour.bookingId}
                  type="button"
                  variant="ghost"
                  onClick={() => onSelectTour(tour.bookingId)}
                  className={`h-auto w-full justify-start rounded-xl border px-4 py-3 text-left ${
                    tour.bookingId === tracking?.bookingId
                      ? "border-primary/20 bg-primary/8 text-primary"
                      : "border-outline-variant/10 bg-surface-container-low text-on-surface"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold">{tour.tourName}</p>
                    <p className="mt-1 text-xs font-semibold text-on-surface-variant">
                      {tour.travelerName} · {tour.groupTotal} {t("guidePages.liveTracking.guests")} · {tour.startDay}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-on-surface-variant">{t("guidePages.liveTracking.noActiveAssignedTours")}</p>
          )}
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant/10 py-0 shadow-sm">
        <CardHeader className="border-b border-outline-variant/10 px-4 py-4">
          <CardTitle className="font-headline text-base font-bold text-on-surface">
            {t("guidePages.liveTracking.passengerNotifications")}
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              disabled
              className="rounded-full border border-transparent bg-secondary-container px-4 py-2 text-xs font-bold"
              variant="ghost"
            >
              {t("guidePages.liveTracking.onTheWay")}
            </Button>
            <Button
              disabled
              className="rounded-full border border-transparent bg-secondary-container px-4 py-2 text-xs font-bold"
              variant="ghost"
            >
              {t("guidePages.liveTracking.arrived")}
            </Button>
            <Button
              disabled
              className="rounded-full border border-transparent bg-secondary-container px-4 py-2 text-xs font-bold"
              variant="ghost"
            >
              {t("guidePages.liveTracking.nextUpdated")}
            </Button>
          </div>

          <Separator className="bg-outline-variant/10" />

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase text-on-surface-variant">
              {t("guidePages.liveTracking.emergencyContacts")}
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-error/10 bg-error-container/20 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error/10 text-error">
                    <Phone className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-on-surface">
                      {t("guidePages.liveTracking.operationsDesk")}
                    </p>
                    <p className="text-[10px] font-medium text-on-surface-variant">
                      {t("guidePages.liveTracking.prioritySupport")}
                    </p>
                  </div>
                </div>

                <Button
                  className="rounded-full border border-transparent bg-transparent text-error"
                  size="icon-sm"
                  variant="ghost"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-outline-variant/10 bg-surface-container-low p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-on-secondary-container/10 text-on-secondary-container">
                    <Stethoscope className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-on-surface">
                      {t("guidePages.liveTracking.localMedical")}
                    </p>
                    <p className="text-[10px] font-medium text-on-surface-variant">
                      {t("guidePages.liveTracking.emergencySupport")}
                    </p>
                  </div>
                </div>

                <Button
                  className="rounded-full border border-transparent bg-transparent text-on-surface-variant"
                  size="icon-sm"
                  variant="ghost"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
