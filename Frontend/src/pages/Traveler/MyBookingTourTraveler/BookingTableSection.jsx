import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function BookingTableSection({ bookings, loading, error }) {
  const navigate = useNavigate();

  const formatBookingDate = (value) => {
    if (!value) return "-";

    return new Date(value).toLocaleDateString("en", {
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
        toast.error("Không thể tạo link thanh toán");
        return;
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      toast.error(err?.response?.data?.message || "Không thể thanh toán booking");
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

  return (
    <Card className="overflow-hidden rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
      <CardHeader className="flex flex-row items-center justify-between border-b border-surface-container p-6">
        <CardTitle className="brand-font text-lg font-bold">
          Active Bookings
        </CardTitle>
        <Button
          onClick={() => navigate("/traveler/tour-list")}
          type="button"
          variant="secondary"
          className="h-10 gap-2 rounded-lg bg-surface-container-low px-4 text-sm font-semibold text-on-surface-variant hover:bg-surface-container"
        >
          <span className="material-symbols-outlined text-sm">add</span>
          New Booking
        </Button>
      </CardHeader>

      <CardContent className="p-0">
        <Table className="text-left">
          <TableHeader className="bg-surface-container-low">
            <TableRow className="border-none hover:bg-surface-container-low">
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Tour Name
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Booking Date
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Status
              </TableHead>
              <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Payment
              </TableHead>
              <TableHead className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Actions
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-on-surface-variant">
                  Đang tải dữ liệu...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-error">
                  {error}
                </TableCell>
              </TableRow>
            ) : bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-on-surface-variant">
                  Bạn chưa có booking nào.
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
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
                          {booking.tourId?.name || "(No name)"}
                        </p>
                        <p className="font-body text-xs text-on-surface-variant">
                          {booking.tourId?.location || "-"}
                        </p>
                        <p className="font-body mt-1 text-[11px] text-on-surface-variant">
                          {booking.isPrivate ? "Private" : "Group"} •{" "}
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
                      {(booking.displayStatus || booking.status)?.toLowerCase()}
                    </Badge>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <Badge
                      className={`rounded-full border-0 px-3 py-1 text-[11px] font-bold capitalize ${getPaymentBadgeClass(
                        booking.payment,
                      )}`}
                    >
                      {booking.payment?.toLowerCase()}
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
                              ? "This tour has no assigned guide yet"
                              : undefined
                          }
                          className="h-8 rounded-lg px-3 text-[12px] font-bold uppercase tracking-tight"
                          onClick={() => goToReview(booking)}
                        >
                          Review
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
                          Tracking
                        </Button>
                      ) : null}

                      {booking.payment !== "PAID" && booking.status !== "CANCELLED" ? (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto px-0 text-[12px] font-bold uppercase tracking-tight text-primary"
                          onClick={() => handlePayBooking(booking)}
                        >
                          Pay
                        </Button>
                      ) : null}

                      {booking.tourId?._id ? (
                        <Button
                          type="button"
                          variant="link"
                          className="h-auto px-0 text-[12px] font-bold uppercase tracking-tight text-primary"
                          onClick={() => navigate(`/traveler/tour-detail/${booking.tourId._id}`)}
                        >
                          Tour Detail
                        </Button>
                      ) : null}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

