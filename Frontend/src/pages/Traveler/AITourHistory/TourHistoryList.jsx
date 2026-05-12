import { CalendarDays, ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import usePaginationScroll from "@/hooks/usePaginationScroll";

export default function TourHistoryList({
  history,
  selectedTourId,
  onSelectTour,
  formatDate,
  getTotal,
}) {
  const pageSize = 6;
  const [page, setPage] = useState(1);
  const safeHistory = history || [];
  const totalPages = Math.max(1, Math.ceil(safeHistory.length / pageSize));
  const visibleHistory = useMemo(
    () => safeHistory.slice((page - 1) * pageSize, page * pageSize),
    [safeHistory, page],
  );
  const visiblePageButtons = useMemo(() => {
    const maxButtons = 5;
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, index) => index + 1);
    }

    let start = Math.max(1, page - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > totalPages) {
      end = totalPages;
      start = Math.max(1, totalPages - maxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [page, totalPages]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  usePaginationScroll([page]);

  return (
    <aside className="space-y-3">
      {visibleHistory.map((tour) => {
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

            <div className="mb-3">
              <Badge variant={tour.status === "APPROVED" ? "success" : tour.status === "PROPOSED" ? "warning" : "outline"}>
                {tour.status}
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
      {safeHistory.length > pageSize ? (
        <div className="flex flex-wrap items-center justify-center gap-2 rounded-2xl border border-outline-variant/20 bg-surface-container-low p-3">
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page <= 1}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="h-9 w-9 rounded-xl bg-surface-container-lowest"
          >
            <ChevronLeft className="size-4" />
          </Button>
          {visiblePageButtons.map((pageNumber) => (
            <Button
              key={pageNumber}
              type="button"
              variant={pageNumber === page ? "default" : "outline"}
              onClick={() => setPage(pageNumber)}
              className={
                pageNumber === page
                  ? "h-9 rounded-xl bg-primary px-3 text-primary-foreground"
                  : "h-9 rounded-xl bg-surface-container-lowest px-3"
              }
            >
              {pageNumber}
            </Button>
          ))}
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={page >= totalPages}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="h-9 w-9 rounded-xl bg-surface-container-lowest"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}
    </aside>
  );
}
