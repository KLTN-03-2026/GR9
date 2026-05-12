import ProviderBookingTable from "./ProviderBookingTable";
import PageHero from "@/components/shared/page-hero";

export default function ProviderBookingManagement() {
  return (
    <div className="space-y-6 text-on-surface sm:space-y-8">
      <PageHero
        eyebrow="Reservation Control"
        heading={
          <>
            Booking{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              Management
            </span>
          </>
        }
        description="Track incoming reservations, verify traveler details, and keep response times consistent across every active package."
      />
      <ProviderBookingTable />
    </div>
  );
}
