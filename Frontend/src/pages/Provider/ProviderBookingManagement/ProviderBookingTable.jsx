import {
  BusFront,
  Check,
  ChevronLeft,
  ChevronRight,
  Ellipsis,
  History,
  Hotel,
  Search,
  Users,
  X,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
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

const bookings = [
  {
    customer: "Elena Rodriguez",
    email: "e.rodriguez@email.com",
    initials: "ER",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBpAS8ysq28vxxzbyV-6QvBFgXGilqAwngD-YBSWf4OEkg1BYvjXtSOlhpxCkWBIvWO9uKAnyBcsf7vUXEYdBMhD05ZYp3h9PTUONfCD8kobIP1BKK3_Ytqj0m3hCMfD1hi0Sp1x40GGeHvs-TqIRyT0dIfpgUPU8GYw_WN8sEymgZXrWcgq17LZdfnu1XWn-_iHydTzknT0I6rg6VqFU08PFJwihWZsbOArd5EtlfPQ2rNyEW2eluKbZpEG4tUF7_4DlkHpv2tsmoA",
    tour: "Alpine Peaks Helicopter Tour",
    travelers: "3 Travelers",
    hotel: "Boutique Caldera Suite",
    transport: "Private SUV",
    date: "Oct 24, 2023",
    time: "10:30 AM",
    status: "Pending",
    statusClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    action: "decision",
  },
  {
    customer: "Marcus Chen",
    email: "m.chen@outlook.com",
    initials: "MC",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCX7gv0nRtERkrqBWCRNqvh7vdDRh4sWMGY3KqUynKt4A9T7QHiK4iS5eyZGm4aOCP3mGA5RSnpqllq2B0lonKSUF22MzYtTuZnq4R37G3ZOEMwgKwFI0q9NAgoVn7-qU3LHBcD0H2EZOXv4R9ft8J2bpkNJceM1siUiYRnwoeFfAnobk_XVZiBk6LTgK7W4jgasR-fjzML5gbL-s0cw8i0X53Mz5H7Rgkhlbi-cCfc-i_owheJv_V-QZdf20ZIFqLrebeYKHkT0I18",
    tour: "Azure Coast Private Yacht",
    travelers: "4 Travelers",
    hotel: "Boutique Caldera Suite",
    transport: "Concierge Van",
    date: "Oct 28, 2023",
    time: "02:00 PM",
    status: "Confirmed",
    statusClass:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300",
    action: "menu",
  },
  {
    customer: "Sarah Jenkins",
    email: "s.jenkins@webmail.com",
    initials: "SJ",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAwXfjKw4qk26jHyz8-BMJFEt_GMZLnulJhbkEKwg7qdm1V9kcEAvHZpweA1G_c-hCSwmPr7z3teOOFQDvv4Bk5Ukr1vyC7QTOsKkZfweuH6CdkEATHLnPHnNesklWUXsM7FHT4bMG-PcByBHLWoHU2f9omLf2JRkbvF0HJ48-expthmLqU4pkYJmcMnoC5zxqSDF77hl8s9Mg-1OfRKhFsOeYZQT9QvU2yQv89QdElk4EUKnl5ceJUTS50T1hjDOkxNSe3DgMshDr8",
    tour: "Kyoto Zen Garden Walk",
    travelers: "1 Traveler",
    hotel: "Boutique Caldera Suite",
    transport: "Concierge Van",
    date: "Nov 02, 2023",
    time: "09:00 AM",
    status: "Cancelled",
    statusClass: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300",
    action: "history",
  },
  {
    customer: "David Wilson",
    email: "dwilson@proton.me",
    initials: "DW",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB31QjKyjc1o1cY4xZv-kgWWaut3YgAIwPD326Ahq3w16vBceuhP8QXBdXsJ6TgcgXg5JCsUQ7dn7iTsZ2oioAii9qtkta27sDa1AILDDK2HIGgMob5pL9T1icAp1OusXagJ9zxMVuelNI-a_nJRAr8rxk2w2zqjaNpJG03CArFHaazadslIV3IGJXfP4NOlU6Z8c6Gn1MLFzaMO_sal9JrJX5n5twu7_jwBzUwbxGLL0-Wk6JFhzLURAY_803yKLIfLfYT8ApCn0dM",
    tour: "Alpine Peaks Helicopter Tour",
    travelers: "2 Travelers",
    hotel: "Boutique Caldera Suite",
    transport: "Concierge Van",
    date: "Nov 05, 2023",
    time: "01:30 PM",
    status: "Pending",
    statusClass:
      "bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
    action: "decision",
  },
];

export default function ProviderBookingTable() {
  return (
    <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
      <CardContent className="space-y-6 p-5 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="font-heading text-lg font-bold">
              Incoming Bookings
            </CardTitle>
            <p className="text-sm text-on-surface-variant">
              Review requests, track confirmations and inspect booking history.
            </p>
          </div>
          <span className="inline-flex w-fit rounded-full border border-border px-3 py-1 text-xs font-bold text-foreground">
            4 active rows
          </span>
        </div>
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative min-w-[140px] flex-1 md:min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              placeholder="Search tours or destinations..."
              className="h-11 border-outline-variant/30 bg-surface-container-low pl-10"
            />
          </div>
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
                <TableHead className="px-6 py-4 text-right text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={`${booking.customer}-${booking.date}`}
                  className="group"
                >
                  <TableCell className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 rounded-2xl shadow-sm">
                        <AvatarImage
                          alt={`Portrait of ${booking.customer}`}
                          src={booking.avatar}
                          className="h-full w-full rounded-2xl object-cover"
                        />
                        <AvatarFallback className="rounded-2xl font-semibold">
                          {booking.initials}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <p className="font-heading text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                          {booking.customer}
                        </p>
                        <p className="mt-1 text-xs text-on-surface-variant">
                          {booking.email}
                        </p>
                      </div>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <p className="font-heading text-base font-bold text-on-surface transition-colors group-hover:text-primary">
                      {booking.tour}
                    </p>
                    <div className="mt-2 space-y-1 text-xs text-on-surface-variant">
                      <p className="flex items-center gap-1.5">
                        <Users className="size-3.5" />
                        {booking.travelers}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Hotel className="size-3.5" />
                        {booking.hotel}
                      </p>
                      <p className="flex items-center gap-1.5">
                        <BusFront className="size-3.5" />
                        {booking.transport}
                      </p>
                    </div>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <p className="font-semibold text-on-surface">
                      {booking.date}
                    </p>
                    <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.18em] text-on-surface-variant">
                      {booking.time}
                    </p>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    <span
                      className={`inline-flex rounded-full border-transparent px-3 py-1 text-[10px] font-extrabold uppercase tracking-[0.24em] ${booking.statusClass}`}
                    >
                      {booking.status}
                    </span>
                  </TableCell>

                  <TableCell className="px-6 py-5">
                    {booking.action === "decision" ? (
                      <div className="flex justify-end gap-2 opacity-100 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <Button className="h-9 rounded-xl px-3" size="sm">
                          <Check className="size-4" />
                          Accept
                        </Button>
                        <Button
                          className="h-9 rounded-xl px-3"
                          size="sm"
                          variant="destructive"
                        >
                          <X className="size-4" />
                          Reject
                        </Button>
                      </div>
                    ) : null}

                    {booking.action === "menu" ? (
                      <div className="flex justify-end">
                        <Button
                          className="rounded-xl text-on-surface-variant hover:bg-surface-container-low"
                          size="icon"
                          variant="ghost"
                        >
                          <Ellipsis className="size-4" />
                        </Button>
                      </div>
                    ) : null}

                    {booking.action === "history" ? (
                      <div className="flex justify-end">
                        <Button
                          className="rounded-xl text-on-surface-variant hover:bg-surface-container-low"
                          size="icon"
                          variant="ghost"
                        >
                          <History className="size-4" />
                        </Button>
                      </div>
                    ) : null}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col gap-3 rounded-[1.5rem] bg-surface-container-low px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-on-surface-variant">
            Showing <span className="font-bold text-on-surface">1 - 4</span> of{" "}
            <span className="font-bold text-on-surface">4</span> bookings
          </p>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl bg-white text-on-surface-variant"
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button className="rounded-xl bg-primary px-4 text-on-primary">
              1
            </Button>
            <Button variant="outline" className="rounded-xl bg-white px-4">
              2
            </Button>
            <Button variant="outline" className="rounded-xl bg-white px-4">
              3
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-xl bg-white text-on-surface-variant"
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
