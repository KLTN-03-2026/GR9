import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Hotel,
  MapPinned,
  Navigation,
  UtensilsCrossed,
  Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const iconMap = {
  HOTEL: Hotel,
  RESTAURANT: UtensilsCrossed,
  FOOD: UtensilsCrossed,
  TRANSPORT: Navigation,
  ACTIVITY: Activity,
  ATTRACTION_TICKET: MapPinned,
};

const statusLabel = {
  completed: "Completed",
  ongoing: "In Progress",
  pending: "Scheduled",
};

const statusClass = {
  completed: "bg-primary/10 text-primary",
  ongoing: "bg-tertiary-fixed text-on-tertiary-fixed",
  pending: "bg-surface-container-highest text-on-surface-variant",
};

const dotClass = {
  completed: "bg-primary",
  ongoing: "bg-tertiary ring-4 ring-tertiary/20",
  pending: "bg-surface-container-highest",
};

export default function GuideLiveTourTrackingTimeline({
  tracking,
  onUpdateActivityStatus,
  updatingActivityId,
}) {
  const activities = tracking?.allActivities || tracking?.today?.activities || [];
  const totalGuests = tracking?.group?.total || 0;

  return (
    <div className="flex-1 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
            {tracking?.tour?.name || "Execution Mode"}
          </span>
          <h1 className="mt-1 font-headline text-3xl font-extrabold text-on-surface">
            Today&apos;s Live Timeline
          </h1>
          <p className="mt-2 text-sm font-semibold text-on-surface-variant">
            Day {tracking?.schedule?.currentDay || 1} of {tracking?.tour?.numberOfDay || 1} ·{" "}
            {tracking?.schedule?.startDay || "No start date"}
          </p>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-container/10 px-3 py-1 text-xs font-bold text-tertiary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
          LIVE UPDATING
        </span>
      </div>

      <div className="relative space-y-6 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-0.5 before:bg-surface-container-highest before:content-['']">
        {activities.length ? (
          activities.map((activityItem) => {
            const Icon = iconMap[activityItem.type] || Activity;
            const isUpdating = updatingActivityId === activityItem.activityId;

            return (
              <div
                key={activityItem.activityId || `${activityItem.time}-${activityItem.name}`}
                className="relative pl-14"
              >
                <div
                  className={`absolute left-4 top-6 z-10 h-4 w-4 rounded-full border-4 border-surface-container-lowest ${dotClass[activityItem.state] || dotClass.pending}`}
                />

                <Card
                  className={`rounded-xl py-0 shadow-sm transition-shadow hover:shadow-md ${
                    activityItem.state === "ongoing"
                      ? "border-2 border-primary/20 bg-surface-container-lowest shadow-[0px_20px_40px_rgba(25,28,30,0.06)]"
                      : activityItem.state === "completed"
                        ? "border border-outline-variant/10 bg-surface-container-low/45 opacity-60"
                        : "border border-outline-variant/10 bg-surface-container-low/35 opacity-50"
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="mb-4 flex items-start justify-between gap-4">
                      <div className="flex gap-4">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-headline text-lg font-bold text-on-surface">
                            {activityItem.name}
                          </h3>
                          <p className="text-sm text-on-surface-variant">
                            Day {activityItem.dayNumber || tracking?.schedule?.currentDay || 1} ·{" "}
                            {activityItem.address || activityItem.description || "No location detail"}
                          </p>
                        </div>
                      </div>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-tight ${statusClass[activityItem.state] || statusClass.pending}`}
                      >
                        {statusLabel[activityItem.state] || "Scheduled"}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface-variant">
                      <span className="flex items-center gap-1">
                        <Clock3 className="h-4 w-4" />
                        {activityItem.time}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        {totalGuests} Guests
                      </span>
                    </div>

                    {activityItem.state === "ongoing" ? (
                      <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3">
                        <Button
                          disabled={isUpdating}
                          onClick={() =>
                            onUpdateActivityStatus(activityItem.activityId, "DONE")
                          }
                          className="h-auto flex-col gap-1 rounded-xl border border-transparent bg-surface-container-low px-3 py-3 text-[10px] font-bold uppercase text-on-surface-variant shadow-sm hover:bg-primary hover:text-white"
                          variant="ghost"
                        >
                          <CheckCircle2 className="h-5 w-5" />
                          Mark Done
                        </Button>
                        <Button
                          disabled
                          className="h-auto flex-col gap-1 rounded-xl border border-transparent bg-surface-container-low px-3 py-3 text-[10px] font-bold uppercase text-on-surface-variant shadow-sm"
                          variant="ghost"
                        >
                          <AlertTriangle className="h-5 w-5" />
                          Delay
                        </Button>
                        <Button
                          disabled
                          className="h-auto flex-col gap-1 rounded-xl border border-transparent bg-surface-container-low px-3 py-3 text-[10px] font-bold uppercase text-on-surface-variant shadow-sm"
                          variant="ghost"
                        >
                          <FileText className="h-5 w-5" />
                          Note
                        </Button>
                      </div>
                    ) : null}
                  </CardContent>
                </Card>
              </div>
            );
          })
        ) : (
          <Card className="rounded-xl border border-outline-variant/10 bg-white py-0 shadow-sm">
            <CardContent className="p-6 text-sm text-on-surface-variant">
              No itinerary is available for this assigned tour.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
