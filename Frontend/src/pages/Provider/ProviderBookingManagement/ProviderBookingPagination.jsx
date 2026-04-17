import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export default function ProviderBookingPagination() {
  return (
    <section className="flex flex-col gap-4 px-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm font-medium text-on-surface-variant">
        Showing <span className="font-bold text-on-surface">4</span> of 4
        bookings
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
  );
}
