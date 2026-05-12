import { useEffect, useMemo, useState } from "react";
import { Avatar, AvatarBadge, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { geocodeAddress } from "@/services/api/location";
import { useI18n } from "@/i18n/I18nProvider";

const isValidCoordinate = (value) => {
  const number = Number(value);
  return Number.isFinite(number) && number !== 0;
};

export default function TourTrackingSidebar({ tracking }) {
  const { t } = useI18n();
  const [mapPoint, setMapPoint] = useState(null);
  const [mapLoading, setMapLoading] = useState(false);

  const mapTarget = useMemo(() => {
    const activities = tracking?.today?.activities || [];
    const activeActivity =
      activities.find((activity) => activity.state === "ongoing") ||
      tracking?.progress?.nextActivity ||
      activities.find((activity) => activity.address || activity.name) ||
      null;

    const query =
      activeActivity?.address ||
      [activeActivity?.name, tracking?.tour?.location].filter(Boolean).join(", ") ||
      tracking?.tour?.location ||
      "";

    return {
      activity: activeActivity,
      query,
      lat: activeActivity?.lat,
      lng: activeActivity?.long,
    };
  }, [tracking]);

  useEffect(() => {
    let ignore = false;

    const resolveMapPoint = async () => {
      if (!mapTarget.query) {
        setMapPoint(null);
        setMapLoading(false);
        return;
      }

      if (isValidCoordinate(mapTarget.lat) && isValidCoordinate(mapTarget.lng)) {
        setMapPoint({
          lat: Number(mapTarget.lat),
          lng: Number(mapTarget.lng),
          label: mapTarget.activity?.name || tracking?.tour?.name || t("tracking.tourLocation"),
          address: mapTarget.activity?.address || mapTarget.query,
        });
        setMapLoading(false);
        return;
      }

      setMapLoading(true);
      try {
        const response = await geocodeAddress(mapTarget.query);
        const location = response.data?.data;

        if (!ignore && location?.lat && location?.lng) {
          setMapPoint({
            lat: Number(location.lat),
            lng: Number(location.lng),
            label: mapTarget.activity?.name || tracking?.tour?.name || t("tracking.tourLocation"),
            address: location.formattedAddress || mapTarget.query,
          });
        } else if (!ignore) {
          setMapPoint({
            lat: null,
            lng: null,
            label: mapTarget.activity?.name || tracking?.tour?.name || t("tracking.tourLocation"),
            address: mapTarget.query,
          });
        }
      } catch {
        if (!ignore) {
          setMapPoint({
            lat: null,
            lng: null,
            label: mapTarget.activity?.name || tracking?.tour?.name || "Tour location",
            address: mapTarget.query,
          });
        }
      } finally {
        if (!ignore) setMapLoading(false);
      }
    };

    resolveMapPoint();

    return () => {
      ignore = true;
    };
  }, [mapTarget, tracking, t]);

  const mapQuery =
    mapPoint?.lat && mapPoint?.lng
      ? `${mapPoint.lat},${mapPoint.lng}`
      : mapPoint?.address || mapTarget.query;
  const mapSrc = mapQuery
    ? `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&z=15&output=embed`
    : "";

  return (
    <div className="space-y-8 lg:col-span-4">
      <Card className="relative aspect-square overflow-hidden rounded-[2rem] border border-outline-variant/10 bg-surface-container-lowest py-0 shadow-sm">
        <div className="absolute inset-0 bg-slate-200">
          {mapSrc ? (
            <iframe
              title={mapPoint?.label || t("tracking.mapTitle")}
              className="h-full w-full border-0"
              src={mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-surface-container text-sm font-semibold text-on-surface-variant">
              {t("tracking.mapUnavailable")}
            </div>
          )}
          {mapLoading ? (
            <div className="pointer-events-none absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-on-surface shadow-sm backdrop-blur">
              {t("tracking.resolvingLocation")}
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-sm ring-0">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 p-8 pb-0">
          <CardTitle className="font-headline text-lg font-bold">
            {t("tracking.travelerPulse")}
          </CardTitle>
          <Badge className="rounded-md border-0 bg-teal-50 px-2 py-1 text-xs font-bold text-teal-600">
            {t("tracking.present", { count: tracking?.group?.total || 0, total: tracking?.group?.total || 0 })}
          </Badge>
        </CardHeader>

        <CardContent className="space-y-6 p-8">
          <div className="no-scrollbar max-h-[400px] space-y-4 overflow-y-auto pr-2">
            <div className="group flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar size="lg" className="after:border-transparent">
                  <AvatarImage
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCC_zlc7Pc3ATNIDM5wW1KXIsuJRmZwzesQsSG_FA6az9HLNjfQQHqyre0AqMUwETzJLFTPfUq9QKkmg3U5Uo_KTE6Nad6zLSpfkrX0wfC5RLzWmi_EB9WhqI3YaKCUzKwa2jfH6wk9yrfe0ijt7WWg_03crFx60sEP7yS7O_xcGOmd1DSZy4BSiiqXfZmyx80ZG9I4CAgsUSGKTGfbEqCNPEw-16CU8CZqefn8pw6tAFqoK7dD3jSHGRVTrVTL6ghH3Ez-8NTVgLuC"
                    alt={tracking?.traveler?.name || t("tracking.leadTraveler")}
                  />
                  <AvatarFallback>
                    {(tracking?.traveler?.name || "LT").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                  <AvatarBadge className="bg-teal-500 ring-2 ring-white" />
                </Avatar>

                <div>
                  <p className="text-sm font-bold">
                    {tracking?.traveler?.name || t("tracking.leadTraveler")}
                  </p>
                  <p className="text-[10px] font-medium text-on-surface-variant">
                    {t("tracking.leadTraveler")}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">chat_bubble</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">info</span>
                </Button>
              </div>
            </div>

            <div className="group flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar size="lg" className="after:border-transparent">
                  <AvatarImage src={tracking?.guide?.avatarUrl} alt={tracking?.guide?.name} />
                  <AvatarFallback>
                    {(tracking?.guide?.name || "GD").slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                  <AvatarBadge className="bg-teal-500 ring-2 ring-white" />
                </Avatar>

                <div>
                  <p className="text-sm font-bold">
                    {tracking?.guide?.name || t("tracking.guideNotAssigned")}
                  </p>
                  <p className="text-[10px] font-medium text-on-surface-variant">
                    {t("tracking.guide")}
                  </p>
                </div>
              </div>

              <div className="flex space-x-2 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">chat_bubble</span>
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-on-surface-variant hover:bg-surface-container"
                >
                  <span className="material-symbols-outlined">info</span>
                </Button>
              </div>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="h-14 w-full rounded-2xl border-2 border-dashed border-outline-variant bg-transparent text-sm font-semibold text-on-surface-variant hover:bg-surface-container-low"
          >
            {t("tracking.attendanceSheet")}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        <Button
          type="button"
          variant="ghost"
          className="h-auto rounded-2xl bg-secondary-container/30 p-5 text-on-secondary-container hover:bg-secondary-container/50"
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <span className="material-symbols-outlined text-2xl text-on-secondary-container">
              receipt_long
            </span>
            <span className="text-xs font-bold uppercase">{t("tracking.expenses")}</span>
          </div>
        </Button>

        <Button
          type="button"
          variant="ghost"
          className="h-auto rounded-2xl bg-tertiary-container/10 p-5 text-tertiary-container hover:bg-tertiary-container/20"
        >
          <div className="flex flex-col items-center justify-center space-y-2 text-center">
            <span
              className="material-symbols-outlined text-2xl text-tertiary-container"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              medical_services
            </span>
            <span className="text-xs font-bold uppercase">{t("tracking.firstAid")}</span>
          </div>
        </Button>
      </div>
    </div>
  );
}
