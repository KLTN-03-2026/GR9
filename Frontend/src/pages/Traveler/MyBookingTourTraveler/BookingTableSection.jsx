import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createBookingPaymentLink } from "@/services/api/booking";
import { formatPrice } from "@/utils/formatPrice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useI18n } from "@/i18n/I18nProvider";
import { useEffect, useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import usePaginationScroll from "@/hooks/usePaginationScroll";

export default function BookingTableSection({ bookings, loading, error }) {
  const navigate = useNavigate();
  const { language, t } = useI18n();
  const [page, setPage] = useState(1);
  const pageSize = 6;
  const totalPages = Math.max(1, Math.ceil((bookings?.length || 0) / pageSize));
  const visibleBookings = useMemo(
    () => (bookings || []).slice((page - 1) * pageSize, page * pageSize),
    [bookings, page],
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
  const firstRow = !bookings?.length ? 0 : (page - 1) * pageSize + 1;
  const lastRow = Math.min(page * pageSize, bookings?.length || 0);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  usePaginationScroll([page]);

  const formatBookingDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString(language === "vi" ? "vi-VN" : "en", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  };

  const getGuideId = (booking) => {
    const guide = booking.tourScheduleId?.leadGuideServiceId || booking.tourId?.leadGuideServiceId;
    return typeof guide === "string" ? guide : guide?._id;
  };

  const goToReview = (booking) => {
    const guideId = getGuideId(booking);
    if (!booking.tourId?._id || !guideId) return;

    const params = new URLSearchParams({
      tourId: booking.tourId._id,
      guideId,
      bookingId: booking._id,
    });

    navigate(`/traveler/review?${params.toString()}`);
  };

  const handlePayBooking = async (booking) => {
    try {
      if (booking.checkoutUrl) {
        window.location.href = booking.checkoutUrl;
        return;
      }

      const response = await createBookingPaymentLink(booking._id);
      const checkoutUrl = response.data.data?.payment?.checkoutUrl;

      if (!checkoutUrl) {
        toast.error(t("bookingPage.payLinkError"));
        return;
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(err?.response?.data?.message || t("bookingPage.payError"));
    }
  };

  const getStatusBadgeClass = (status) => {
    if (status === "PENDING") return "bg-tertiary-container/10 text-tertiary-container";
    if (status === "CANCELLED") return "bg-error/10 text-error";
    if (status === "COMPLETED") return "bg-teal-50 text-teal-700";
    if (status === "PAID") return "bg-primary/10 text-primary";
    return "bg-secondary-container/30 text-secondary";
  };

  const getPaymentBadgeClass = (payment) => {
    if (payment === "PAID") return "bg-teal-50 text-teal-700";
    if (payment === "PARTIAL") return "bg-surface-container-high text-on-surface-variant";
    if (payment === "REFUNDED") return "bg-error/10 text-error";
    return "bg-surface-container text-on-surface-variant";
  };

  const getStatusLabel = (value) => {
    const key = String(value || "").toLowerCase();
    return t(`bookingPage.statuses.${key}`);
  };

  return (
    <Card className="overflow-hidden rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
      <CardHeader className="flex flex-row items-center justify-between border-b border-surface-container p-6">
        <CardTitle className="brand-font text-lg font-bold">
          {t("bookingPage.activeBookings")}
        </CardTitle>
        <Button
          onClick={() => navigate("/traveler/tour-list")}
          type="button"
          variant="secondary"
          className="h-10 gap-2 rounded-lg bg-surface-container-low px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          {t("bookingPage.newBooking")}
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table className="text-left">
          <TableHeader className="bg-surface-container-low">
            <TableRow className="border-none hover:bg-surface-container-low">
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                {t("bookingPage.tourName")}
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                {t("bookingPage.bookingDate")}
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                {t("bookingPage.status")}
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                {t("bookingPage.payment")}
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                {t("bookingPage.actions")}
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-lg" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="px-6 py-5">
                    <Skeleton className="h-7 w-24 rounded-full" />
                  </TableCell>
                  <TableCell className="px-6 py-5 text-right">
                    <Skeleton className="ml-auto h-9 w-28 rounded-lg" />
                  </TableCell>
                </TableRow>
              ))
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-error">
                  {error}
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-on-surface-variant">{t("bookingPage.noBookings")}</TableCell>
              </TableRow>
            ) : (
              visibleBookings.map((booking) => (
                <TableRow
                  key={booking._id}
                  className="group border-surface-container hover:bg-surface-container-low/30"
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          alt={booking.tourId?.name || "Tour"}
                          className="h-full w-full object-cover"
                          src={booking.tourImages?.[0]?.imageUrl || "/default-tour.jpg"}
                        />
                      </div>
                      <div>
                        <p className="brand-font text-sm font-bold text-on-surface">
                          {booking.tourId?.name || `(${t("bookingPage.noName")})`}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant">
                          {booking.tourId?.location || "-"}
                        </p>
                        <p className="font-body mt-1 text-[11px] text-on-surface-variant">
                          {booking.isPrivate ? t("bookingPage.private") : t("bookingPage.group")} •{" "}
                          {formatPrice(booking.totalAmount)}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-sm font-medium text-on-surface">
                    {formatBookingDate(booking.bookingDate)}
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <Badge
                      className={`rounded-full border-0 px-3 py-1 text-[11px] font-bold capitalize ${getStatusBadgeClass(
                        booking.displayStatus || booking.status,
                      )}`}
                    >
                      {getStatusLabel(booking.displayStatus || booking.status)}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <Badge
                      className={`rounded-full border-0 px-3 py-1 text-[11px] font-bold capitalize ${getPaymentBadgeClass(
                        booking.payment,
                      )}`}
                    >
                      {getStatusLabel(booking.payment)}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-6 py-5 text-right">
                    <div className="flex justify-end gap-3">
                      {booking.canReview || booking.displayStatus === "COMPLETED" ? (
                        <Button
                          type="button"
                          variant="secondary"
                          disabled={!getGuideId(booking)}
                          title={
                            !getGuideId(booking)
                              ? t("bookingPage.noGuide")
                              : undefined
                          }
                          className="h-8 rounded-lg px-3 text-[12px] font-bold uppercase tracking-tight"
                          onClick={() => goToReview(booking)}
                        >
                          {t("bookingPage.review")}
                        </Button>
                      ) : null}

                      {booking.canTrack || booking.displayStatus === "CONFIRMED" ? (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto px-0 text-[12px] font-bold uppercase tracking-tight text-primary"
                          onClick={() =>
                            navigate(
                              `/traveler/tour-tracking?bookingId=${booking._id}`,
                            )
                          }
                        >
                          {t("bookingPage.tracking")}
                        </Button>
                      ) : null}

                      {booking.payment !== "PAID" && booking.status !== "CANCELLED" ? (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto px-0 text-[12px] font-bold uppercase tracking-tight text-primary"
                          onClick={() => handlePayBooking(booking)}
                        >
                          {t("bookingPage.pay")}
                        </Button>
                      ) : null}

                      {booking.payment !== "PAID" && booking.status === "CANCELLED" && booking.tourId?._id ? (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto px-0 text-[12px] font-bold uppercase tracking-tight text-primary"
                          onClick={() => navigate(`/traveler/tour-detail/${booking.tourId._id}`)}
                        >
                          {t("bookingPage.bookAgain")}
                        </Button>
                      ) : null}

                      {booking.tourId?._id ? (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto px-0 text-[12px] font-bold uppercase tracking-tight text-primary"
                          onClick={() => navigate(`/traveler/tour-detail/${booking.tourId._id}`)}
                        >
                          {t("bookingPage.tourDetail")}
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        {!loading && !error && (bookings?.length || 0) > pageSize ? (
          <div className="flex flex-col gap-3 border-t border-surface-container bg-surface-container-low px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-on-surface-variant">
              {t("bookingPage.showing")} <span className="font-bold text-on-surface">{firstRow} - {lastRow}</span>{" "}
              {t("bookingPage.of")}{" "}
              <span className="font-bold text-on-surface">{bookings?.length || 0}</span>{" "}
              {t("bookingPage.bookings")}
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


