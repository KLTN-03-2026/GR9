import PageHero from "@/components/shared/page-hero";

export default function BookingHeader() {
  return (
    <PageHero
      className="mb-10"
      eyebrow="Traveler Bookings"
      heading={
        <>
          Manage your{" "}
          <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
            journey
          </span>
          .
        </>
      }
      description="Review your upcoming adventures, track payments, and manage your travel schedule in one place."
    />
  );
}
