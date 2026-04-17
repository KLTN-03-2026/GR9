import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function TourTrackingHeader() {
  return (
    <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
      <div className="space-y-2">
        <Badge className="inline-flex rounded-full border-0 bg-teal-50 px-3 py-1 text-xs font-bold uppercase tracking-widest text-teal-700">
          <span className="mr-2 h-2 w-2 animate-pulse rounded-full bg-teal-500" />
          Ongoing Now
        </Badge>

        <h2 className="font-headline text-4xl font-extrabold leading-tight text-on-surface">
          Kyoto Immersion
        </h2>

        <p className="flex items-center font-medium text-on-surface-variant">
          <span className="material-symbols-outlined mr-1 text-sm">
            location_on
          </span>
          Kyoto, Japan • Self-guided itinerary
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Button
          type="button"
          variant="outline"
          className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-lowest px-5 font-semibold text-on-surface hover:bg-surface-container"
        >
          <span className="material-symbols-outlined mr-2">
            contact_emergency
          </span>
          Emergency Protocol
        </Button>

        <Button
          type="button"
          className="h-12 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 font-bold text-white shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95"
        >
          <span className="material-symbols-outlined mr-2">
            send_to_mobile
          </span>
          Broadcast Update
        </Button>
      </div>
    </div>
  );
}
