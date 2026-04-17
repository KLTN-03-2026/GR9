import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
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

export default function BookingTableSection() {
  return (
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
            <TableRow className="group border-surface-container hover:bg-surface-container-low/30">
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      alt="Da Nang 3D2N: Coastal Elegance"
                      className="h-full w-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF"
                    />
                  </div>
                  <div>
                    <p className="brand-font text-sm font-bold text-on-surface">
                      Da Nang 3D2N: Coastal Elegance
                    </p>
                    <p className="font-body text-xs text-on-surface-variant">
                      Da Nang, Vietnam
                    </p>
                    <p className="font-body mt-1 text-[11px] text-on-surface-variant">
                      Premium Coastal Suite • Private SUV
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm font-medium text-on-surface">
                Mar 18, 2026
              </TableCell>

              <TableCell className="px-6 py-5">
                <Badge className="rounded-full border-0 bg-primary/10 px-3 py-1 text-[11px] font-bold capitalize text-primary">
                  confirmed
                </Badge>
              </TableCell>

              <TableCell className="px-6 py-5">
                <Badge className="rounded-full border-0 bg-teal-50 px-3 py-1 text-[11px] font-bold capitalize text-teal-700">
                  paid
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

            <TableRow className="group border-surface-container hover:bg-surface-container-low/30">
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      alt="Azure Horizon Expedition"
                      className="h-full w-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF"
                    />
                  </div>
                  <div>
                    <p className="brand-font text-sm font-bold text-on-surface">
                      Azure Horizon Expedition
                    </p>
                    <p className="font-body text-xs text-on-surface-variant">
                      Santorini, Greece
                    </p>
                    <p className="font-body mt-1 text-[11px] text-on-surface-variant">
                      Boutique Caldera Suite • Concierge Van
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm font-medium text-on-surface">
                Mar 22, 2026
              </TableCell>

              <TableCell className="px-6 py-5">
                <Badge className="rounded-full border-0 bg-tertiary-container/10 px-3 py-1 text-[11px] font-bold capitalize text-tertiary-container">
                  pending
                </Badge>
              </TableCell>

              <TableCell className="px-6 py-5">
                <Badge className="rounded-full border-0 bg-surface-container-high px-3 py-1 text-[11px] font-bold capitalize text-on-surface-variant">
                  partially-paid
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

            <TableRow className="group border-surface-container hover:bg-surface-container-low/30">
              <TableCell className="px-6 py-5">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-lg">
                    <img
                      alt="Emerald Waters & Ancient Karsts"
                      className="h-full w-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBS6t51F8tBzGfKatRaZGMBz9c6EWoMtM34PoKd1fW1vskfiUQSfgOtL8BtkGEmTTPPH_2Fz4CYhRjrA4PPLj7m67_RBU6bqHvuORg0t2ufLhhZnVVwfHJXRBaqYf-pK2wdpuWA2bWsVd8LV6X0YqDe_oz8ffqpgTura_qHk-N8spDxp74SzUgts2Xso-wn2vJmf64hvi63oE_1vpPQzfxDsDXrfWAvJUm_ZDKOVkqQlULl83FUWbVXyUwGgQ0X4JsWmnRGtMaFhFeF"
                    />
                  </div>
                  <div>
                    <p className="brand-font text-sm font-bold text-on-surface">
                      Emerald Waters & Ancient Karsts
                    </p>
                    <p className="font-body text-xs text-on-surface-variant">
                      Ha Long Bay, Vietnam
                    </p>
                    <p className="font-body mt-1 text-[11px] text-on-surface-variant">
                      Signature Cruise Suite • Private Limousine
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="px-6 py-5 text-sm font-medium text-on-surface">
                Dec 18, 2025
              </TableCell>

              <TableCell className="px-6 py-5">
                <Badge className="rounded-full border-0 bg-secondary-container/30 px-3 py-1 text-[11px] font-bold capitalize text-secondary">
                  completed
                </Badge>
              </TableCell>

              <TableCell className="px-6 py-5">
                <Badge className="rounded-full border-0 bg-teal-50 px-3 py-1 text-[11px] font-bold capitalize text-teal-700">
                  paid
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
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
