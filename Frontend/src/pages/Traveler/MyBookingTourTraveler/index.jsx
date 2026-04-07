import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const stats = [
  {
    label: "Confirmed",
    value: "1",
    helper: "Upcoming experiences",
    icon: "check_circle",
    iconClass: "text-primary",
  },
  {
    label: "Pending",
    value: "1",
    helper: "Awaiting provider confirmation",
    icon: "hourglass_empty",
    iconClass: "text-tertiary",
  },
  {
    label: "Total Spent",
    value: "$3,858",
    helper: "Across paid bookings",
    icon: "account_balance_wallet",
    iconClass: "text-teal-600",
  },
];

const bookings = [
  {
    name: "Da Nang 3D2N: Coastal Elegance",
    location: "Da Nang, Vietnam",
    packageDetail: "Premium Coastal Suite • Private SUV",
    bookingDate: "Mar 18, 2026",
    status: "confirmed",
    statusClass: "bg-primary/10 text-primary",
    payment: "paid",
    paymentClass: "bg-teal-50 text-teal-700",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF",
  },
  {
    name: "Azure Horizon Expedition",
    location: "Santorini, Greece",
    packageDetail: "Boutique Caldera Suite • Concierge Van",
    bookingDate: "Mar 22, 2026",
    status: "pending",
    statusClass: "bg-tertiary-container/10 text-tertiary-container",
    payment: "partially-paid",
    paymentClass: "bg-surface-container-high text-on-surface-variant",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF",
  },
  {
    name: "Emerald Waters & Ancient Karsts",
    location: "Ha Long Bay, Vietnam",
    packageDetail: "Signature Cruise Suite • Private Limousine",
    bookingDate: "Dec 18, 2025",
    status: "completed",
    statusClass: "bg-secondary-container/30 text-secondary",
    payment: "paid",
    paymentClass: "bg-teal-50 text-teal-700",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF",
  },
];

export default function MyBookingTourTraveler() {
  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
      <div className="mx-auto w-full px-6 pb-12 pt-24 md:px-10">
        <div className="mb-10">
          <h2 className="brand-font mb-2 text-4xl font-extrabold tracking-tight text-on-surface">
            Manage your journey.
          </h2>
          <p className="font-body max-w-2xl text-lg text-on-surface-variant">
            Review your upcoming adventures, track payments, and manage your
            travel schedule in one place.
          </p>
        </div>

        <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {stats.map((stat) => (
            <Card
              key={stat.label}
              className="rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.04)]"
            >
              <CardContent className="p-6">
                <div className="mb-4 flex items-center justify-between">
                  <span className="font-medium text-on-surface-variant">
                    {stat.label}
                  </span>
                  <span
                    className={`material-symbols-outlined ${stat.iconClass}`}
                  >
                    {stat.icon}
                  </span>
                </div>
                <div className="brand-font text-3xl font-bold">{stat.value}</div>
                <p className="mt-1 text-xs text-on-surface-variant">
                  {stat.helper}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="overflow-hidden rounded-xl border border-outline-variant/5 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
          <CardHeader className="flex flex-row items-center justify-between border-b border-surface-container p-6">
            <CardTitle className="brand-font text-lg font-bold">
              Active Bookings
            </CardTitle>
            <Button
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
                {bookings.map((booking) => (
                  <TableRow
                    key={booking.name}
                    className="group border-surface-container hover:bg-surface-container-low/30"
                  >
                    <TableCell className="px-6 py-5">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                          <img
                            alt={booking.name}
                            className="h-full w-full object-cover"
                            src={booking.image}
                          />
                        </div>
                        <div>
                          <p className="brand-font text-sm font-bold text-on-surface">
                            {booking.name}
                          </p>
                          <p className="font-body text-xs text-on-surface-variant">
                            {booking.location}
                          </p>
                          <p className="font-body mt-1 text-[11px] text-on-surface-variant">
                            {booking.packageDetail}
                          </p>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="px-6 py-5 text-sm font-medium text-on-surface">
                      {booking.bookingDate}
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <Badge
                        className={`rounded-full border-0 px-3 py-1 text-[11px] font-bold capitalize ${booking.statusClass}`}
                      >
                        {booking.status}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-6 py-5">
                      <Badge
                        className={`rounded-full border-0 px-3 py-1 text-[11px] font-bold capitalize ${booking.paymentClass}`}
                      >
                        {booking.payment}
                      </Badge>
                    </TableCell>

                    <TableCell className="px-6 py-5 text-right">
                      <Button
                        type="button"
                        variant="link"
                        className="h-auto px-0 text-[12px] font-bold uppercase tracking-tight text-primary"
                      >
                        View Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          <Card className="rounded-3xl border-none bg-surface-container-low py-0 lg:col-span-2">
            <CardContent className="p-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-primary shadow-sm">
                  <span className="material-symbols-outlined">
                    travel_explore
                  </span>
                </div>
                <div>
                  <CardTitle className="brand-font text-xl font-bold text-on-surface">
                    Need another itinerary?
                  </CardTitle>
                  <CardDescription className="mt-2 max-w-xl text-sm text-on-surface-variant">
                    Browse curated tours or generate a new AI plan, then manage
                    every reservation from the same traveler workspace.
                  </CardDescription>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-3xl border-none bg-gradient-to-br from-primary to-primary-container py-0 text-left text-on-primary shadow-lg shadow-primary/20">
            <CardContent className="p-8">
              <span className="material-symbols-outlined mb-6 text-4xl">
                auto_awesome
              </span>
              <CardTitle className="brand-font mb-2 text-xl font-bold">
                Plan New Trip
              </CardTitle>
              <CardDescription className="text-sm text-on-primary/80">
                Generate a fresh itinerary tailored to your pace and budget.
              </CardDescription>
              <Button
                type="button"
                variant="secondary"
                className="mt-6 bg-white/15 text-on-primary hover:bg-white/20"
              >
                Start Planning
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  );
}
