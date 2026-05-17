import { CalendarDays, Clock } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import { Badge } from "@/components/ui/badge";
import PaginationBar from "@/components/shared/pagination-bar";
import { useI18n } from "@/i18n/I18nProvider";
import usePaginationScroll from "@/hooks/usePaginationScroll";

export default function TourHistoryList({
  history,
  selectedTourId,
  onSelectTour,
  formatDate,
  getTotal,
}) {
  const { t } = useI18n();
  const pageSize = 6;
  const [page, setPage] = useState(1);
  const safeHistory = history || [];
  const totalPages = Math.max(1, Math.ceil(safeHistory.length / pageSize));
  const visibleHistory = useMemo(
    () => safeHistory.slice((page - 1) * pageSize, page * pageSize),
    [safeHistory, page],
  );
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
                {tour.origin ? (
                  <p className="mt-1 text-xs font-medium text-slate-400">
                    {tour.origin} {"->"} {tour.location}
                  </p>
                ) : null}
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
        <PaginationBar
          page={page}
          totalPages={totalPages}
          onPageChange={setPage}
          previousLabel={t("common.previous")}
          nextLabel={t("common.next")}
          className="justify-center rounded-2xl bg-surface-container-low"
        />
      ) : null}
    </aside>
  );
}
