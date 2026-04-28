import { Hotel, MapPin, Route } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function SummaryMetric({ label, value }) {
  return (
    <div className="rounded-2xl bg-slate-50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 font-bold text-slate-950">{value}</p>
    </div>
  );
}

function ServiceCard({ icon: Icon, title, service, fallback }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-4">
      <p className="mb-2 flex items-center gap-2 text-sm font-bold text-slate-950">
        <Icon className="h-4 w-4 text-teal-600" />
        {title}
      </p>
      <p className="text-sm text-slate-600">{service?.name || fallback}</p>
      <p className="mt-1 text-xs text-slate-400">{service?.address}</p>
    </div>
  );
}

function ItineraryDay({ day }) {
  return (
    <Card className="border-slate-200 shadow-none">
      <CardContent className="p-5">
        <h4 className="font-bold text-slate-950">Day {day.dayNumber}</h4>
        <p className="mt-1 text-sm text-slate-500">{day.description}</p>
        <div className="mt-4 space-y-3">
          {day.activities?.map((activity, index) => (
            <div
              key={`${day.dayNumber}-${activity.time}-${index}`}
              className="flex gap-3 rounded-2xl bg-slate-50 p-3"
            >
              <div className="w-16 shrink-0 text-sm font-bold text-teal-700">
                {activity.time || "--:--"}
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-950">
                  {activity.serviceId?.name || "Activity"}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {activity.serviceId?.address || activity.serviceId?.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TourHistoryDetail({
  detailLoading,
  selectedTour,
  formatDate,
  getTotal,
  totalActivities,
}) {
  return (
    <section className="min-h-[560px] rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      {detailLoading ? (
        <div className="flex min-h-[500px] items-center justify-center text-sm font-semibold text-slate-500">
          Loading tour detail...
        </div>
      ) : selectedTour ? (
        <div>
          <div className="mb-6 flex flex-col gap-4 border-b border-slate-100 pb-6 xl:flex-row xl:items-start xl:justify-between">
            <div>
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="success">{selectedTour.status}</Badge>
                <Badge variant="outline">{selectedTour.type}</Badge>
              </div>
              <h2 className="font-heading text-2xl font-bold text-slate-950">
                {selectedTour.location || "Untitled destination"}
              </h2>
              <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
                {selectedTour.description || "No description"}
              </p>
            </div>
          </div>

          <div className="mb-8 grid gap-3 md:grid-cols-4">
            <SummaryMetric label="Start" value={formatDate(selectedTour.startDay)} />
            <SummaryMetric label="Duration" value={`${selectedTour.numberOfDay} days`} />
            <SummaryMetric label="Travelers" value={getTotal(selectedTour.quantity)} />
            <SummaryMetric
              label="Price"
              value={getTotal(selectedTour.price).toLocaleString("en")}
            />
          </div>

          <div className="mb-8 grid gap-3 md:grid-cols-2">
            <ServiceCard
              icon={Hotel}
              title="Hotel"
              service={selectedTour.hotelServiceId}
              fallback="No hotel selected"
            />
            <ServiceCard
              icon={MapPin}
              title="Transport"
              service={selectedTour.transportServiceId}
              fallback="No transport selected"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Route className="h-5 w-5 text-teal-600" />
              <h3 className="font-heading text-lg font-bold text-slate-950">
                Itinerary
              </h3>
              <Badge variant="muted">{totalActivities} activities</Badge>
            </div>

            {selectedTour.itineraries?.map((day) => (
              <ItineraryDay key={day.dayNumber} day={day} />
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
