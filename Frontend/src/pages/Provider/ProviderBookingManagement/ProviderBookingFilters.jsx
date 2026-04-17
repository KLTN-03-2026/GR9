import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function ProviderBookingFilters() {
  return (
    <Card className="rounded-3xl border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
      <CardHeader className="px-6 pb-3 pt-6">
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
            <select className="h-12 w-full rounded-xl border-0 bg-surface-container-low px-4 text-sm text-on-surface outline-none ring-0 focus-visible:ring-2 focus-visible:ring-primary/20">
              <option>All Active Tours</option>
              <option>Alpine Peaks Helicopter Tour</option>
              <option>Azure Coast Private Yacht</option>
              <option>Kyoto Zen Garden Walk</option>
            </select>
          </div>

          <div className="min-w-[220px] flex-1">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Booking Date
            </label>
            <Input
              className="h-12 rounded-xl border-0 bg-surface-container-low px-4"
              type="date"
              defaultValue="2023-10-24"
            />
          </div>

          <div className="min-w-[220px] flex-1">
            <label className="mb-2 block text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
              Status
            </label>
            <div className="flex flex-wrap gap-2">
              <Button className="rounded-xl px-4" size="lg">
                All
              </Button>
              <Button className="rounded-xl px-4" size="lg" variant="outline">
                Pending
              </Button>
              <Button className="rounded-xl px-4" size="lg" variant="outline">
                Confirmed
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
