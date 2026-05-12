import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { getMyBookings, syncPaymentStatus } from "@/services/api/booking";
import BookingActionsSection from "./BookingActionsSection";
import BookingHeader from "./BookingHeader";
import BookingStatsSection from "./BookingStatsSection";
import BookingTableSection from "./BookingTableSection";

export default function MyBookingTourTraveler() {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const loadBookings = () => {
        setLoading(true);
        return getMyBookings()
            .then((res) => {
                setBookings(res.data.data || []);
                setError("");
            })
            .catch(() => setError("Không thể tải danh sách booking"))
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        const payment = searchParams.get("payment");
        const orderCode = searchParams.get("orderCode");

        if (payment === "success" && orderCode) {
            let redirected = false;

            syncPaymentStatus(orderCode)
                .then((response) => {
                    const syncedBooking = response.data.data;
                    toast.success("Thanh toán thành công");

                    if (syncedBooking?.status === "CONFIRMED") {
                        redirected = true;
                        navigate(
                            "/guest/booking-success-and-tracking-link?" +
                                new URLSearchParams({
                                    payment: "success",
                                    bookingId:
                                        syncedBooking._id ||
                                        searchParams.get("bookingId") ||
                                        "",
                                    orderCode,
                                }).toString(),
                            { replace: true },
                        );
                    }
                })
                .catch(() =>
                    toast.error("Không thể cập nhật trạng thái thanh toán"),
                )
                .finally(() => {
                    if (!redirected) {
                        setSearchParams({});
                        loadBookings();
                    }
                });
            return;
        }

        if (payment === "cancel") {
            toast.error("Bạn đã hủy thanh toán");
            setSearchParams({});
        }

        loadBookings();
    }, []);

    return (
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
            <div className="mx-auto w-full px-4 pb-10 pt-6 sm:px-6 md:px-10 md:pt-24">
                <BookingHeader />
                <BookingStatsSection bookings={bookings} loading={loading} />
                <BookingTableSection
                    bookings={bookings}
                    loading={loading}
                    error={error}
                />
                <BookingActionsSection />
            </div>
        </main>
    );
}
