import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

const getBadge = (state) => {
  if (state === "ongoing") {
    return "bg-primary text-white animate-pulse";
  }

  if (state === "completed") {
    return "bg-teal-50 text-teal-700";
  }

  return "bg-surface-container text-on-surface-variant";
};

const getIconClass = (state) => {
  if (state === "ongoing") return "bg-primary text-white";
  if (state === "completed") return "bg-teal-50 text-teal-700";
  return "bg-surface-container-high text-on-surface-variant";
};

const getCardClass = (state) => {
  if (state === "ongoing") {
    return "bg-surface-container-lowest opacity-100 shadow-md ring-1 ring-primary/15";
  }

  if (state === "completed") {
    return "bg-surface-container-low/45 opacity-60";
  }

  return "bg-surface-container-low/35 opacity-50";
};

export default function TourTrackingItinerarySection({ tracking }) {
  const { t } = useI18n();
  const activities = tracking?.today?.activities || [];

  return (
    <section className="space-y-6">
      <h4 className="flex items-center font-headline text-lg font-bold text-on-surface">
        <span className="material-symbols-outlined mr-2">event_repeat</span>
        {t("tracking.detailedItinerary")}
      </h4>

      <div className="relative space-y-0">
        <div className="absolute bottom-8 left-6 top-8 w-[2px] bg-outline-variant/30" />

        {activities.length ? (
          activities.map((activity) => (
            <div
              key={`${activity.time}-${activity.name}`}
              className="group relative flex items-start space-x-8 pb-8"
            >
              <div
                className={`relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full ${getIconClass(
                  activity.state,
                )}`}
              >
                <span className="material-symbols-outlined">
                  {activity.state === "completed" ? "check_circle" : "schedule"}
                </span>
              </div>

              <Card
                className={`flex-1 rounded-2xl border-none py-0 shadow-sm transition-all hover:translate-x-1 ${getCardClass(
                  activity.state,
                )}`}
              >
                <CardContent className="p-6">
                  <div className="mb-2 flex items-start justify-between gap-3">
                    <span className="text-xs font-bold uppercase text-primary">
                      {activity.type} · {activity.time}
                    </span>

                    <Badge
                      className={`rounded-full border-0 px-3 py-1 text-[10px] font-bold uppercase ${getBadge(
                        activity.state,
                      )}`}
                    >
                      {activity.state}
                    </Badge>
                  </div>

                  <CardTitle className="mb-2 text-lg font-bold">
                    {activity.name}
                  </CardTitle>
                  <CardDescription className="mb-4 text-sm leading-relaxed text-on-surface-variant">
                    {activity.description || activity.address || t("tracking.noDescription")}
                  </CardDescription>

                  {activity.address ? (
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center space-x-2 rounded-lg border border-outline-variant/10 bg-surface-container-low px-3 py-1.5">
                        <span className="material-symbols-outlined text-sm text-primary">
                          location_on
                        </span>
                        <span className="line-clamp-1 text-xs font-bold text-on-surface">
                          {activity.address}
                        </span>
                      </div>

                      <Button
                        asChild
                        type="button"
                        variant="link"
                        className="h-auto px-0 text-xs font-bold text-primary"
                      >
                        <a
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            activity.address,
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {t("tracking.followRoute")}
                        </a>
                      </Button>
                    </div>
                  ) : null}
                </CardContent>
              </Card>
            </div>
          ))
        ) : (
          <Card className="rounded-2xl border-none bg-white py-0 shadow-sm">
            <CardContent className="p-6 text-sm text-on-surface-variant">
              {t("tracking.noItinerary")}
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
}
