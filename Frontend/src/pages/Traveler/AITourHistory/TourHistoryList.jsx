import { CalendarDays, Clock } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function TourHistoryList({
  history,
  selectedTourId,
  onSelectTour,
  formatDate,
  getTotal,
}) {
  return (
    <aside className="space-y-3">
      {history.map((tour) => {
        const isActive = selectedTourId === tour._id;

        return (
          <button
            key={tour._id}
            type="button"
            onClick={() => onSelectTour(tour)}
            className={`w-full rounded-2xl border bg-white p-5 text-left shadow-sm transition ${
              isActive
                ? "border-teal-500 ring-2 ring-teal-100"
                : "border-slate-200 hover:border-teal-200"
            }`}
          >
            <div className="mb-3 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="truncate text-base font-bold text-slate-950">
                  {tour.location || "Untitled destination"}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-slate-500">
                  {tour.description || "No description"}
                </p>
              </div>
              <Badge variant={tour.type === "PRIVATE" ? "success" : "muted"}>
                {tour.type}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-teal-600" />
                {formatDate(tour.startDay)}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-teal-600" />
                {tour.numberOfDay || 0} days
              </span>
              <span>{getTotal(tour.quantity)} travelers</span>
              <span>{getTotal(tour.price).toLocaleString("en")} total</span>
            </div>
          </button>
        );
      })}
    </aside>
  );
}
