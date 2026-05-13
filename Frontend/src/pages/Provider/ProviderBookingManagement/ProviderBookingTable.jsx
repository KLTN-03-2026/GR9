import { useEffect, useMemo, useState } from "react";
import { BusFront, CalendarDays, ChevronLeft, ChevronRight, Hotel, Search, Users } from "lucide-react";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { getProviderBookings } from "@/services/api/booking";
import { useI18n } from "@/i18n/I18nProvider";
import { useSearchParams } from "react-router-dom";
import usePaginationScroll from "@/hooks/usePaginationScroll";

const statusConfig = {
  PENDING: {
    labelKey: "provider.bookings.statuses.pendingPayment",
    className: "bg-amber-100 text-amber-700",
  },
  CONFIRMED: {
    labelKey: "provider.bookings.statuses.confirmed",
    className: "bg-emerald-100 text-emerald-700",
  },
  COMPLETED: {
    labelKey: "provider.bookings.statuses.completed",
    className: "bg-blue-100 text-blue-700",
  },
  CANCELLED: {
    labelKey: "provider.bookings.statuses.cancelled",
    className: "bg-red-100 text-red-700",
  },
  REFUNDED: {
    labelKey: "provider.bookings.statuses.refunded",
    className: "bg-slate-200 text-slate-700",
  },
};

const getDisplayStatus = (booking, t) => {
  const statusKey =
    booking.status === "CANCELLED"
      ? "CANCELLED"
      : booking.status === "REFUNDED"
        ? "REFUNDED"
        : booking.status === "COMPLETED"
          ? "COMPLETED"
          : booking.payment !== "PAID"
            ? "PENDING"
            : booking.status === "CONFIRMED"
              ? "CONFIRMED"
              : booking.status;
  const config = statusConfig[statusKey];

  return config
    ? {
        key: statusKey,
        label: t(config.labelKey),
        className: config.className,
      }
    : {
    key: booking.status || "UNKNOWN",
    label: booking.status || t("provider.bookings.statuses.unknown"),
    className: "bg-slate-100 text-slate-700",
  };
};

const initialsOf = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "TR";

const formatDate = (value, locale) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString(locale);
};

const formatTime = (value, locale) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
};

export default function ProviderBookingTable() {
  const { language, t } = useI18n();
  const [searchParams, setSearchParams] = useSearchParams();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState(searchParams.get("search") || "");
  const [tourFilter, setTourFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const pageSize = 8;
  const locale = language === "vi" ? "vi-VN" : "en-US";

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const res = await getProviderBookings();
        setBookings(res?.data?.data || []);
      } catch (error) {
        console.error("Load provider bookings error:", error);
        toast.error(error?.response?.data?.message || t("provider.bookings.loadError"));
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, [t]);

  useEffect(() => {
    const urlSearch = searchParams.get("search") || "";
    setKeyword((current) => (current === urlSearch ? current : urlSearch));
  }, [searchParams]);

  const handleKeywordChange = (value) => {
    setKeyword(value);
    setSearchParams((current) => {
      const next = new URLSearchParams(current);
      if (value.trim()) {
        next.set("search", value.trim());
      } else {
        next.delete("search");
      }
      return next;
    }, { replace: true });
  };

  const filteredBookings = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    return bookings.filter((booking) => {
      const matchesSearch =
        !q ||
        [
          booking.traveler?.name,
          booking.traveler?.email,
          booking.tour?.name,
          booking.tour?.location,
          booking.bookingCode,
          booking.status,
          booking.payment,
        ]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(q));

      const matchesTour =
        tourFilter === "all" || String(booking.tour?.id) === tourFilter;
      const bookingDate = booking.bookingDate ? new Date(booking.bookingDate) : null;
      const matchesDate =
        !dateFilter ||
        (bookingDate &&
          !Number.isNaN(bookingDate.getTime()) &&
          bookingDate.toISOString().slice(0, 10) === dateFilter);
      const displayStatus = getDisplayStatus(booking, t).key.toLowerCase();
      const matchesStatus =
        statusFilter === "all" ||
        displayStatus.includes(statusFilter) ||
        String(booking.status || "").toLowerCase() === statusFilter;

      return matchesSearch && matchesTour && matchesDate && matchesStatus;
    });
  }, [bookings, keyword, tourFilter, dateFilter, statusFilter, t]);

  const tourOptions = useMemo(() => {
    const map = new Map();
    bookings.forEach((booking) => {
      if (booking.tour?.id && booking.tour?.name) {
        map.set(booking.tour.id, booking.tour.name);
      }
    });
    return [...map.entries()].map(([id, name]) => ({ id, name }));
  }, [bookings]);

  const totalPages = Math.max(1, Math.ceil(filteredBookings.length / pageSize));
  const visibleBookings = useMemo(
    () => filteredBookings.slice((page - 1) * pageSize, page * pageSize),
    [filteredBookings, page],
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
  const firstRow = filteredBookings.length === 0 ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, filteredBookings.length);

  useEffect(() => {
    setPage(1);
  }, [keyword, tourFilter, dateFilter, statusFilter]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  usePaginationScroll([page]);

  const resetFilters = () => {
    setTourFilter("all");
    setDateFilter("");
    setStatusFilter("all");
    handleKeywordChange("");
  };

  return (
    <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
      <CardContent className="space-y-6 p-5 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-heading text-lg font-bold">
              {t("provider.bookings.incomingBookings")}
            </CardTitle>
            <p className="text-sm text-on-surface-variant">
              {t("provider.bookings.statusHint")}
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-border px-3 py-1 text-xs font-bold text-foreground">
            {t("provider.bookings.rows", { count: filteredBookings.length })}
          </span>
        </div>

        <div className="grid gap-3 md:grid-cols-[1.4fr_1fr_1fr_1fr_auto] md:items-end">
          <div className="relative min-w-[140px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              value={keyword}
              onChange={(event) => handleKeywordChange(event.target.value)}
              placeholder={t("provider.bookings.searchPlaceholder")}
              className="h-11 border-outline-variant/30 bg-surface-container-low pl-10"
            />
          </div>

          <select
            value={tourFilter}
            onChange={(event) => setTourFilter(event.target.value)}
            className="h-11 rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 text-sm text-on-surface outline-none"
          >
            <option value="all">{t("provider.bookings.allTours")}</option>
            {tourOptions.map((tour) => (
              <option key={tour.id} value={tour.id}>
                {tour.name}
              </option>
            ))}
          </select>

          <Input
            value={dateFilter}
            onChange={(event) => setDateFilter(event.target.value)}
            className="h-11 border-outline-variant/30 bg-surface-container-low"
            type="date"
          />

          <select
            value={statusFilter}
            onChange={(event) => setStatusFilter(event.target.value)}
            className="h-11 rounded-xl border border-outline-variant/30 bg-surface-container-low px-3 text-sm text-on-surface outline-none"
          >
            <option value="all">{t("provider.bookings.allStatuses")}</option>
            <option value="pending">{t("provider.bookings.statuses.pending")}</option>
            <option value="confirmed">{t("provider.bookings.statuses.confirmed")}</option>
            <option value="completed">{t("provider.bookings.statuses.completed")}</option>
            <option value="cancelled">{t("provider.bookings.statuses.cancelled")}</option>
            <option value="refunded">{t("provider.bookings.statuses.refunded")}</option>
          </select>

          <button
            type="button"
            onClick={resetFilters}
            className="h-11 rounded-xl border border-outline-variant/30 bg-surface-container-lowest px-4 text-sm font-bold text-on-surface-variant hover:bg-surface-container-low"
          >
            {t("provider.bookings.reset")}
          </button>
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-outline-variant/20">
          <Table>
            <TableHeader className="bg-surface-container-low">
              <TableRow className="hover:bg-surface-container-low">
                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  {t("provider.bookings.customer")}
                </TableHead>
                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  {t("provider.bookings.tourDetails")}
                </TableHead>
                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  {t("provider.bookings.date")}
                </TableHead>
                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  {t("provider.bookings.status")}
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                Array.from({ length: 6 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-16 w-16 rounded-2xl" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-36" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-48" />
                        <Skeleton className="h-3 w-32" />
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <Skeleton className="h-4 w-28" />
                    </TableCell>
                    <TableCell className="px-6 py-5">
                      <Skeleton className="h-7 w-28 rounded-full" />
                    </TableCell>
                  </TableRow>
                ))
              ) : filteredBookings.length ? (
                visibleBookings.map((booking) => {
                  const status = getDisplayStatus(booking, t);
                  return (
                    <TableRow key={booking.id} className="group">
                      <TableCell className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <Avatar className="h-16 w-16 rounded-2xl shadow-sm">
                            <AvatarImage
                              alt={booking.traveler?.name || "Traveler"}
                              src={booking.traveler?.avatarUrl}
                              className="h-full w-full rounded-2xl object-cover"
                            />
                            <AvatarFallback className="rounded-2xl font-semibold">
                              {initialsOf(booking.traveler?.name)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="font-heading text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                              {booking.traveler?.name || "Traveler"}
                            </p>
                            <p className="mt-1 text-xs text-on-surface-variant">
                              {booking.traveler?.email || booking.bookingCode}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-5">
                        <p className="font-heading text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                          {booking.tour?.name || t("provider.bookings.unnamedTour")}
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                          <p className="flex items-center gap-1.5">
                            <Users className="size-3.5" />
                            {t("provider.bookings.travelers", { count: booking.totalTravelers || 0 })}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Hotel className="size-3.5" />
                            {booking.guide?.name || t("provider.bookings.guideNotAssigned")}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <BusFront className="size-3.5" />
                            {booking.tour?.location || t("provider.bookings.unknownLocation")}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-5">
                        <p className="flex items-center gap-2 font-semibold text-on-surface">
                          <CalendarDays className="size-4 text-primary" />
                          {formatDate(booking.startDate, locale)}
                        </p>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                          {t("provider.bookings.bookedAt", {
                            date: formatDate(booking.bookingDate, locale),
                            time: formatTime(booking.bookingDate, locale),
                          })}
                        </p>
                      </TableCell>

                      <TableCell className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border-transparent px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] ${status.className}`}
                        >
                          {status.label}
                        </span>
                        <p className="mt-2 text-xs text-on-surface-variant">
                          {t("provider.bookings.payment")}: {booking.payment}
                        </p>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-12 text-center text-sm text-on-surface-variant">
                    {t("provider.bookings.empty")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {!loading && filteredBookings.length > pageSize ? (
          <div className="flex flex-col gap-3 rounded-[1.5rem] bg-surface-container-low px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-on-surface-variant">
              {t("provider.bookings.showing", {
                first: firstRow,
                last: lastRow,
                total: filteredBookings.length,
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
      </CardContent>
    </Card>
  );
}
