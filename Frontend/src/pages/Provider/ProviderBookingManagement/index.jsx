import React, { useState } from "react";
import {
  Check,
  BusFront,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  History,
  Hotel,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const filterStatuses = ["All", "Pending", "Confirmed"];

const bookings = [
  {
    customer: "Elena Rodriguez",
    email: "e.rodriguez@email.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpAS8ysq28vxxzbyV-6QvBFgXGilqAwngD-YBSWf4OEkg1BYvjXtSOlhpxCkWBIvWO9uKAnyBcsf7vUXEYdBMhD05ZYp3h9PTUONfCD8kobIP1BKK3_Ytqj0m3hCMfD1hi0Sp1x40GGeHvs-TqIRyT0dIfpgUPU8GYw_WN8sEymgZXrWcgq17LZdfnu1XWn-_iHydTzknT0I6rg6VqFU08PFJwihWZsbOArd5EtlfPQ2rNyEW2eluKbZpEG4tUF7_4DlkHpv2tsmoA",
    avatarAlt:
      "Portrait of a young woman with a friendly smile, outdoor natural lighting",
    tour: "Alpine Peaks Helicopter Tour",
    guests: "2 Adults, 1 Child",
    card: "Private SUV",
    date: "Oct 24, 2023",
    time: "10:30 AM",
    status: "Pending",
    statusClass: "bg-amber-100 text-amber-700",
    actions: "decision",
  },
  {
    customer: "Marcus Chen",
    email: "m.chen@outlook.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCX7gv0nRtERkrqBWCRNqvh7vdDRh4sWMGY3KqUynKt4A9T7QHiK4iS5eyZGm4aOCP3mGA5RSnpqllq2B0lonKSUF22MzYtTuZnq4R37G3ZOEMwgKwFI0q9NAgoVn7-qU3LHBcD0H2EZOXv4R9ft8J2bpkNJceM1siUiYRnwoeFfAnobk_XVZiBk6LTgK7W4jgasR-fjzML5gbL-s0cw8i0X53Mz5H7Rgkhlbi-cCfc-i_owheJv_V-QZdf20ZIFqLrebeYKHkT0I18",
    avatarAlt:
      "Close up portrait of a middle aged man with glasses, professional and serene look",
    tour: "Azure Coast Private Yacht",
    guests: "4 Adults",
    date: "Oct 28, 2023",
    time: "02:00 PM",
    status: "Confirmed",
    statusClass: "bg-teal-100 text-teal-700",
    actions: "menu",
  },
  {
    customer: "Sarah Jenkins",
    email: "s.jenkins@webmail.com",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwXfjKw4qk26jHyz8-BMJFEt_GMZLnulJhbkEKwg7qdm1V9kcEAvHZpweA1G_c-hCSwmPr7z3teOOFQDvv4Bk5Ukr1vyC7QTOsKkZfweuH6CdkEATHLnPHnNesklWUXsM7FHT4bMG-PcByBHLWoHU2f9omLf2JRkbvF0HJ48-expthmLqU4pkYJmcMnoC5zxqSDF77hl8s9Mg-1OfRKhFsOeYZQT9QvU2yQv89QdElk4EUKnl5ceJUTS50T1hjDOkxNSe3DgMshDr8",
    avatarAlt:
      "Artistic portrait of a woman with vibrant lighting and modern aesthetic",
    tour: "Kyoto Zen Garden Walk",
    guests: "1 Adult",
    date: "Nov 02, 2023",
    time: "09:00 AM",
    status: "Cancelled",
    statusClass: "bg-red-100 text-red-700",
    actions: "history",
  },
  {
    customer: "David Wilson",
    email: "dwilson@proton.me",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB31QjKyjc1o1cY4xZv-kgWWaut3YgAIwPD326Ahq3w16vBceuhP8QXBdXsJ6TgcgXg5JCsUQ7dn7iTsZ2oioAii9qtkta27sDa1AILDDK2HIGgMob5pL9T1icAp1OusXagJ9zxMVuelNI-a_nJRAr8rxk2w2zqjaNpJG03CArFHaazadslIV3IGJXfP4NOlU6Z8c6Gn1MLFzaMO_sal9JrJX5n5twu7_jwBzUwbxGLL0-Wk6JFhzLURAY_803yKLIfLfYT8ApCn0dM",
    avatarAlt:
      "Smiling young man in a casual travel outfit, mountain background",
    tour: "Alpine Peaks Helicopter Tour",
    guests: "2 Adults",
    date: "Nov 05, 2023",
    time: "01:30 PM",
    status: "Pending",
    statusClass: "bg-amber-100 text-amber-700",
    actions: "decision",
  },
];

const tours = [
  "All Active Tours",
  "Alpine Peaks Helicopter Tour",
  "Azure Coast Private Yacht",
  "Kyoto Zen Garden Walk",
];

const statusVariantMap = {
  Pending: "bg-amber-100 text-amber-700",
  Confirmed: "bg-emerald-100 text-emerald-700",
  Cancelled: "bg-red-100 text-red-700",
};

const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const toInputDateValue = (displayDate) => {
  const parsedDate = new Date(displayDate);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
};

const getTravelerCountFromGuests = (guests) => {
  if (!guests) return 0;

  const matches = guests.match(/\d+/g);
  if (!matches) return 0;

  return matches.reduce((total, current) => total + Number(current), 0);
};

const formatTravelersLabel = (guests) => {
  const travelerCount = getTravelerCountFromGuests(guests);

  if (!travelerCount) {
    return guests || "Travelers";
  }

  return `${travelerCount} ${travelerCount === 1 ? "Traveler" : "Travelers"}`;
};

const renderActions = (type) => {
  if (type === "decision") {
    return (
      <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
        <Button className="h-9 rounded-xl px-3" size="sm">
          <Check className="size-4" />
          Accept
        </Button>
        <Button className="h-9 rounded-xl px-3" size="sm" variant="destructive">
          <X className="size-4" />
          Reject
        </Button>
      </div>
    );
  }

  if (type === "history") {
    return (
      <div className="flex justify-end">
        <Button className="rounded-full" size="icon-sm" variant="ghost">
          <History className="size-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex justify-end">
      <Button className="rounded-full" size="icon-sm" variant="ghost">
        <Ellipsis className="size-4" />
      </Button>
    </div>
  );
};

const ProviderBookingManagement = () => {
  const [selectedTour, setSelectedTour] = useState(tours[0]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedStatus, setSelectedStatus] = useState(filterStatuses[0]);

  const filteredBookings = bookings.filter((booking) => {
    const matchesTour =
      selectedTour === "All Active Tours" || booking.tour === selectedTour;
    const matchesStatus =
      selectedStatus === "All" || booking.status === selectedStatus;
    const matchesDate =
      !selectedDate || toInputDateValue(booking.date) === selectedDate;

    return matchesTour && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-8 text-on-surface">
      <Card className="rounded-3xl border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
        <CardHeader className="px-6 pt-6 pb-3">
          <CardTitle className="font-heading text-lg font-bold">
            Booking Filters
          </CardTitle>
        </CardHeader>
        <CardContent className="px-6 pb-6">
          <div className="flex flex-wrap items-end gap-6">
            <div className="min-w-[220px] flex-1">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Tour Name
              </label>
              <select
                className="h-12 w-full rounded-xl border-0 bg-surface-container-low px-4 text-sm text-on-surface outline-none ring-0 focus-visible:ring-2 focus-visible:ring-primary/20"
                value={selectedTour}
                onChange={(event) => setSelectedTour(event.target.value)}
              >
                {tours.map((tour) => (
                  <option key={tour}>{tour}</option>
                ))}
              </select>
            </div>

            <div className="min-w-[220px] flex-1">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Booking Date
              </label>
              <Input
                className="h-12 rounded-xl border-0 bg-surface-container-low px-4"
                type="date"
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </div>

            <div className="min-w-[220px] flex-1">
              <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                Status
              </label>
              <div className="flex flex-wrap gap-2">
                {filterStatuses.map((status) => (
                  <Button
                    key={status}
                    className="rounded-xl px-4"
                    size="lg"
                    variant={selectedStatus === status ? "default" : "outline"}
                    onClick={() => setSelectedStatus(status)}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
        <CardHeader className="px-6 py-5">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="font-heading text-lg font-bold">
                Incoming Bookings
              </CardTitle>
              <p className="text-sm text-on-surface-variant">
                Review requests, track confirmations and inspect booking
                history.
              </p>
            </div>
            <span className="inline-flex w-fit rounded-full border border-border px-3 py-1 text-xs font-bold text-foreground">
              {filteredBookings.length} active rows
            </span>
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-0">
          <div className="overflow-x-auto">
            <table className="min-w-[920px] w-full text-sm">
              <thead>
                <tr className="border-none bg-slate-200">
                  <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Customer
                  </th>
                  <th className="px-8 py-5 text-left text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Tour Details
                  </th>
                  <th className="px-8 py-5 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Date
                  </th>
                  <th className="px-8 py-5 text-center text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Status
                  </th>
                  <th className="px-8 py-5 text-right text-[11px] font-bold uppercase tracking-widest text-on-surface-variant">
                    Actions
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredBookings.map((booking) => (
                  <tr
                    key={`${booking.customer}-${booking.date}-${booking.time}`}
                    className="group border-b border-slate-100 transition-colors hover:bg-surface-container-low"
                  >
                    <td className="px-8 py-6 align-middle">
                      <div className="flex items-center gap-4">
                        <Avatar className="h-11 w-11 rounded-xl">
                          <AvatarImage
                            alt={booking.avatarAlt}
                            src={booking.avatar}
                          />
                          <AvatarFallback className="rounded-xl font-semibold">
                            {getInitials(booking.customer)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-heading font-bold text-on-surface">
                            {booking.customer}
                          </p>
                          <p className="text-xs text-on-surface-variant">
                            {booking.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-8 py-6 align-middle">
                      <p className="font-bold text-on-surface">
                        {booking.tour}
                      </p>
                      <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                        <p className="flex items-center gap-1.5">
                          <Users className="size-3.5" />
                          {formatTravelersLabel(booking.guests)}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Hotel className="size-3.5" />
                          {booking.accommodation ?? "Boutique Caldera Suite"}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <BusFront className="size-3.5" />
                          {booking.transport ?? booking.card ?? "Concierge Van"}
                        </p>
                      </div>
                    </td>

                    <td className="px-8 py-6 text-center align-middle">
                      <p className="font-semibold text-on-surface">
                        {booking.date}
                      </p>
                      <p className="text-[11px] font-medium uppercase text-on-surface-variant">
                        {booking.time}
                      </p>
                    </td>

                    <td className="px-8 py-6 text-center align-middle">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-tight ${statusVariantMap[booking.status]}`}
                      >
                        {booking.status}
                      </span>
                    </td>

                    <td className="px-8 py-6 align-middle">
                      {renderActions(booking.actions)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <section className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm font-medium text-on-surface-variant">
          Showing{" "}
          <span className="font-bold text-on-surface">
            {filteredBookings.length}
          </span>{" "}
          of {bookings.length} bookings
        </p>

        <div className="flex gap-2">
          <Button className="rounded-xl" size="icon" variant="outline">
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            className="h-10 w-10 rounded-xl text-sm font-bold"
            variant="default"
          >
            1
          </Button>
          <Button
            className="h-10 w-10 rounded-xl text-sm font-bold"
            variant="outline"
          >
            2
          </Button>
          <Button
            className="h-10 w-10 rounded-xl text-sm font-bold"
            variant="outline"
          >
            3
          </Button>
          <Button className="rounded-xl" size="icon" variant="outline">
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ProviderBookingManagement;
