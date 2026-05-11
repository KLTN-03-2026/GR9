import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronLeft, ChevronRight, KeyRound, MailCheck, PencilLine, Trash2 } from "lucide-react";
import React from "react";
import { useI18n } from "@/i18n/I18nProvider";

const TableGuide = ({
  guides,
  handleUpdate,
  handleDelete,
  handleSendPassword,
  sendingPasswordId,
}) => {
  const { t } = useI18n();
  const safeGuides = guides || [];
  const pageSize = 6;
  const [page, setPage] = React.useState(1);
  const totalPages = Math.max(1, Math.ceil(safeGuides.length / pageSize));
  const visibleGuides = React.useMemo(
    () => safeGuides.slice((page - 1) * pageSize, page * pageSize),
    [safeGuides, page],
  );
  const visiblePageButtons = React.useMemo(() => {
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
  const firstRow = safeGuides.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, safeGuides.length);

  React.useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);
  return (
    <div>
      
      <Table className="w-full text-left border-collapse gap-2 mt-4">
        
        <TableHeader>
          <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("provider.guides.guide")}
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("provider.guides.contactInfo")}
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("provider.guides.assignment")}
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("provider.guides.status")}
            </TableHead>
            <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("provider.guides.loginAccess")}
            </TableHead>
            <TableHead className="px-6 py-4 text-right text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              {t("provider.guides.actions")}
            </TableHead>
          </TableRow>
        </TableHeader>

        <TableBody className="divide-y divide-outline-variant/25">
          {visibleGuides.map((g) => {
            const activeClasses = g.isActive
              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
              : "bg-slate-100 text-slate-500 border border-slate-200";
            const statusClasses =
              g.status === "NOT_STARTED"
                ? "bg-gray-100 text-gray-600 border border-emerald-200"
                : g.status === "CHECKED_IN"
                  ? "bg-blue-100 text-blue-700 border border-amber-200"
                  : g.status === "ON_GOING"
                    ? "bg-indigo-100 text-indigo-700 border border-emerald-200"
                    : g.status === "COMPLETED"
                      ? "bg-green-100 text-green-700 border border-rose-200"
                      : g.status === "CANCELLED"
                        ? "bg-red-100 text-red-700 border border-red-200"
                        : "bg-rose-100 text-rose-700 border border-slate-200";

            return (
              <TableRow
                key={g._id}
                className="transition-colors hover:bg-surface-container-high"
              >
                <TableCell className="px-6 py-5">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl bg-surface-container-high">
                      <img
                        alt={g.name}
                        className="w-full h-full object-cover"
                        src={g.avatarUrl}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-on-surface">{g.fullName}</p>
                      <p className="text-xs text-on-surface-variant">{g.specialty}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <p className="font-medium text-on-surface">{g.email}</p>
                    <p className="mt-1 text-xs text-on-surface-variant">{g.phone}</p>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-5">
                  <div className="text-sm">
                    <p className="font-semibold text-on-surface">
                      {g.bookingTitle || t("provider.guides.noActiveBooking")}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {g.bookingCode}
                    </p>
                    <p className="mt-1 text-xs text-on-surface-variant">
                      {t("provider.guides.assignmentSummary", {
                        tours: g.assignedTourCount || 0,
                        bookings: g.activeBookingCount || 0,
                      })}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold capitalize ${statusClasses}`}
                  >
                    {t(`provider.guides.statuses.${g.status || "CANCELLED"}`)}
                  </span>
                </TableCell>
                <TableCell className="px-6 py-5">
                  <div className="flex min-w-[140px] flex-col items-start gap-2">
                    <span
                      className={`inline-flex min-w-[118px] items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${activeClasses}`}
                    >
                      {g.isActive ? t("provider.guides.active") : t("provider.guides.inactive")}
                    </span>
                    <span
                      className={`inline-flex min-w-[118px] items-center justify-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                        g.hasPassword
                          ? "bg-teal-50 text-teal-700 border border-teal-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      <KeyRound className="h-3.5 w-3.5" />
                      {g.hasPassword ? t("provider.guides.hasPassword") : t("provider.guides.noPassword")}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="px-6 py-5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      onClick={() => handleSendPassword(g._id)}
                      variant="ghost"
                      size="icon"
                      disabled={sendingPasswordId === g._id}
                      title={g.hasPassword ? t("provider.guides.resendPassword") : t("provider.guides.sendPassword")}
                      className="text-slate-500 hover:text-teal-700 bg-teal-50 hover:bg-teal-100 disabled:opacity-60"
                    >
                      <MailCheck className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleUpdate(g._id)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-teal-600 bg-slate-50"
                    >
                      <PencilLine className="size-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(g._id)}
                      variant="ghost"
                      size="icon"
                      className="text-slate-500 hover:text-red-600 bg-slate-50"
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {safeGuides.length > pageSize ? (
        <div className="mt-4 flex flex-col gap-3 rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-surface-variant">
            {t("provider.guides.showing", {
              first: firstRow,
              last: lastRow,
              total: safeGuides.length,
            })}
          </p>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={page <= 1}
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              className="rounded-xl bg-surface-container-lowest"
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
                    ? "rounded-xl bg-primary px-4 text-primary-foreground"
                    : "rounded-xl bg-surface-container-lowest px-4"
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
              className="rounded-xl bg-surface-container-lowest"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default TableGuide;
