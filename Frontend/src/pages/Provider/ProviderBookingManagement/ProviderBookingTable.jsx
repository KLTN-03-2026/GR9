import { useEffect, useMemo, useState } from "react";
import { BusFront, CalendarDays, Hotel, Search, Users } from "lucide-react";
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
import { getProviderBookings } from "@/services/api/booking";

const statusConfig = {
  PENDING: {
    label: "Pending payment",
    className: "bg-amber-100 text-amber-700",
  },
  CONFIRMED: {
    label: "Confirmed",
    className: "bg-emerald-100 text-emerald-700",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-blue-100 text-blue-700",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-red-100 text-red-700",
  },
  REFUNDED: {
    label: "Refunded",
    className: "bg-slate-200 text-slate-700",
  },
};

const getDisplayStatus = (booking) => {
  if (booking.status === "CANCELLED") return statusConfig.CANCELLED;
  if (booking.status === "REFUNDED") return statusConfig.REFUNDED;
  if (booking.status === "COMPLETED") return statusConfig.COMPLETED;
  if (booking.payment !== "PAID") return statusConfig.PENDING;
  if (booking.status === "CONFIRMED") return statusConfig.CONFIRMED;
  return statusConfig[booking.status] || {
    label: booking.status || "Unknown",
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

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleDateString("vi-VN");
};

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString("vi-VN", { hour: "2-digit", minute: "2-digit" });
};

export default function ProviderBookingTable() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState("");

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const res = await getProviderBookings();
        setBookings(res?.data?.data || []);
      } catch (error) {
        console.error("Load provider bookings error:", error);
        toast.error(error?.response?.data?.message || "Không thể tải danh sách booking.");
      } finally {
        setLoading(false);
      }
    };

    loadBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) return bookings;

    return bookings.filter((booking) =>
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
        .some((value) => String(value).toLowerCase().includes(q)),
    );
  }, [bookings, keyword]);

  return (
    <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
      <CardContent className="space-y-6 p-5 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-heading text-lg font-bold">
              Incoming Bookings
            </CardTitle>
            <p className="text-sm text-on-surface-variant">
              Booking status is read directly from each booking record.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-border px-3 py-1 text-xs font-bold text-foreground">
            {filteredBookings.length} rows
          </span>
        </div>

        <div className="relative min-w-[140px] flex-1 md:min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
          <Input
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
            placeholder="Search tours, travelers, status..."
            className="h-11 border-outline-variant/30 bg-surface-container-low pl-10"
          />
        </div>

        <div className="overflow-hidden rounded-[1.5rem] border border-outline-variant/20">
          <Table>
            <TableHeader className="bg-slate-50/80">
              <TableRow className="hover:bg-slate-50/80">
                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  Customer
                </TableHead>
                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  Tour Details
                </TableHead>
                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  Date
                </TableHead>
                <TableHead className="px-6 py-4 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                    Loading bookings...
                  </TableCell>
                </TableRow>
              ) : filteredBookings.length ? (
                filteredBookings.map((booking) => {
                  const status = getDisplayStatus(booking);
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
                          {booking.tour?.name || "Unnamed tour"}
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                          <p className="flex items-center gap-1.5">
                            <Users className="size-3.5" />
                            {booking.totalTravelers || 0} travelers
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Hotel className="size-3.5" />
                            {booking.guide?.name || "Guide not assigned"}
                          </p>
                          <p className="flex items-center gap-1.5">
                            <BusFront className="size-3.5" />
                            {booking.tour?.location || "Unknown location"}
                          </p>
                        </div>
                      </TableCell>

                      <TableCell className="px-6 py-5">
                        <p className="flex items-center gap-2 font-semibold text-on-surface">
                          <CalendarDays className="size-4 text-primary" />
                          {formatDate(booking.startDate)}
                        </p>
                        <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                          Booked {formatDate(booking.bookingDate)} {formatTime(booking.bookingDate)}
                        </p>
                      </TableCell>

                      <TableCell className="px-6 py-5">
                        <span
                          className={`inline-flex rounded-full border-transparent px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] ${status.className}`}
                        >
                          {status.label}
                        </span>
                        <p className="mt-2 text-xs text-on-surface-variant">
                          Payment: {booking.payment}
                        </p>
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="px-6 py-12 text-center text-sm text-slate-500">
                    No bookings found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
