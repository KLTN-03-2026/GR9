import { useEffect, useState } from "react";
import { getMyBookings } from "@/services/api/booking";
import BookingActionsSection from "./BookingActionsSection";
import BookingHeader from "./BookingHeader";
import BookingStatsSection from "./BookingStatsSection";
import BookingTableSection from "./BookingTableSection";

export default function MyBookingTourTraveler() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        setLoading(true);
        getMyBookings()
            .then((res) => {
                setBookings(res.data.data || []);
                setError("");
            })
            .catch(() => setError("Không thể tải danh sách booking"))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
            <div className="mx-auto w-full px-6 pb-12 pt-24 md:px-10">
                <BookingHeader />
                <BookingStatsSection />
                <BookingTableSection bookings={bookings} loading={loading} error={error} />
                <BookingActionsSection />
            </div>
        </main>
    );
}
