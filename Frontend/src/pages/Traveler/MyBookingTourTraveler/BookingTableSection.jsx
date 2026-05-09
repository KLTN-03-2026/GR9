import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyBookings } from "@/services/api/booking";
import { formatPrice } from "@/utils/formatPrice";
import { format } from "date-fns";

export default function BookingTableSection({bookings, loading, error}) {
    const navigate = useNavigate();
    return (
        <Card className="overflow-hidden rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
            <CardHeader className="flex flex-row items-center justify-between border-b border-surface-container p-6">
                <CardTitle className="brand-font text-lg font-bold">Active Bookings</CardTitle>
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
                                <TableCell colSpan={5} className="text-center py-8 text-on-surface-variant">
                                    Đang tải dữ liệu...
                                </TableCell>
                            </TableRow>
                        ) : error ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-error">
                                    {error}
                                </TableCell>
                            </TableRow>
                        ) : bookings.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center py-8 text-on-surface-variant">
                                    Bạn chưa có booking nào.
                                </TableCell>
                            </TableRow>
                        ) : (
                            bookings.map((b) => (
                                <TableRow
                                    key={b._id}
                                    className="group border-surface-container hover:bg-surface-container-low/30"
                                >
                                    <TableCell className="px-6 py-5">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                                                <img
                                                    alt={b.tourId?.name || "Tour"}
                                                    className="h-full w-full object-cover"
                                                    src={b.tourImages?.[0]?.imageUrl || "/default-tour.jpg"}
                                                />
                                            </div>
                                            <div>
                                                <p className="brand-font text-sm font-bold text-on-surface">
                                                    {b.tourId?.name || "(No name)"}
                                                </p>
                                                <p className="font-body text-xs text-on-surface-variant">
                                                    {b.tourId?.location || "-"}
                                                </p>
                                                <p className="font-body mt-1 text-[11px] text-on-surface-variant">
                                                    {b.isPrivate ? "Private" : "Group"} • {formatPrice(b.totalAmount)}
                                                </p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell className="px-6 py-5 text-sm font-medium text-on-surface">
                                        {b.bookingDate ? format(new Date(b.bookingDate), "MMM dd, yyyy") : "-"}
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <Badge
                                            className={`rounded-full border-0 px-3 py-1 text-[11px] font-bold capitalize ${
                                                b.status === "PENDING"
                                                    ? "bg-tertiary-container/10 text-tertiary-container"
                                                    : b.status === "CANCELLED"
                                                      ? "bg-error/10 text-error"
                                                      : b.status === "PAID"
                                                        ? "bg-primary/10 text-primary"
                                                        : "bg-secondary-container/30 text-secondary"
                                            }`}
                                        >
                                            {b.status?.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-5">
                                        <Badge
                                            className={`rounded-full border-0 px-3 py-1 text-[11px] font-bold capitalize ${
                                                b.payment === "PAID"
                                                    ? "bg-teal-50 text-teal-700"
                                                    : b.payment === "PARTIAL"
                                                      ? "bg-surface-container-high text-on-surface-variant"
                                                      : b.payment === "REFUNDED"
                                                        ? "bg-error/10 text-error"
                                                        : "bg-surface-container text-on-surface-variant"
                                            }`}
                                        >
                                            {b.payment?.toLowerCase()}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="px-6 py-5 text-right">
                                        <Button
                                            type="button"
                                            variant="link"
                                            className="h-auto px-0 text-[12px] font-bold uppercase tracking-tight text-primary"
                                            onClick={() => navigate(`/traveler/booking/${b._id}`)}
                                        >
                                            View Detail
                                        </Button>
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
