import BookingActionsSection from "./BookingActionsSection";
import BookingHeader from "./BookingHeader";
import BookingStatsSection from "./BookingStatsSection";
import BookingTableSection from "./BookingTableSection";

export default function MyBookingTourTraveler() {
  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
      <div className="mx-auto w-full px-6 pb-12 pt-24 md:px-10">
        <BookingHeader />
        <BookingStatsSection />
        <BookingTableSection />
        <BookingActionsSection />
      </div>
    </main>
  );
}
