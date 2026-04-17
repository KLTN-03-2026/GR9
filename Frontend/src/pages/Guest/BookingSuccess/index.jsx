import BookingSuccessConfirmation from "./BookingSuccessConfirmation";
import BookingSuccessDetailsCard from "./BookingSuccessDetailsCard";
import BookingSuccessTrackingCard from "./BookingSuccessTrackingCard";
import BookingSuccessSidebar from "./BookingSuccessSidebar";

export default function BookingSuccess() {
  return (
    <div>
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-12">
        <section className="space-y-8 lg:col-span-7">
          <BookingSuccessConfirmation />
          <BookingSuccessDetailsCard />
          <BookingSuccessTrackingCard />
        </section>

        <BookingSuccessSidebar />
      </main>
    </div>
  );
}
