import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";

export default function TourTrackingItinerarySection() {
  return (
    <section className="space-y-6">
      <h4 className="flex items-center font-headline text-lg font-bold text-on-surface">
        <span className="material-symbols-outlined mr-2">event_repeat</span>
        Today&apos;s Detailed Itinerary
      </h4>

      <div className="relative space-y-0">
        <div className="absolute bottom-8 left-6 top-8 w-[2px] bg-outline-variant/30" />

        <div className="group relative flex items-start space-x-8 pb-8">
          <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-primary text-white">
            <span className="material-symbols-outlined">tour</span>
          </div>

          <Card className="flex-1 rounded-2xl border-none bg-white py-0 shadow-md ring-2 ring-primary/10 transition-all hover:translate-x-1">
            <CardContent className="p-6">
              <div className="mb-2 flex items-start justify-between gap-3">
                <span className="text-xs font-bold uppercase text-primary">
                  Morning · 08:30
                </span>

                <Badge className="animate-pulse rounded-full border-0 bg-primary px-3 py-1 text-[10px] font-bold uppercase text-white">
                  Ongoing
                </Badge>
              </div>

              <CardTitle className="mb-2 text-lg font-bold">
                Arashiyama Bamboo Grove
              </CardTitle>
              <CardDescription className="mb-4 text-sm leading-relaxed text-on-surface-variant">
                Walk the bamboo corridor early to avoid crowd density and
                capture softer light.
              </CardDescription>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center space-x-2 rounded-lg border border-outline-variant/10 bg-surface-container-low px-3 py-1.5">
                  <span className="material-symbols-outlined text-sm text-primary">
                    restaurant
                  </span>
                  <span className="text-xs font-bold text-on-surface">
                    Activity in progress
                  </span>
                </div>

                <Button
                  type="button"
                  variant="link"
                  className="h-auto px-0 text-xs font-bold text-primary"
                >
                  Follow route
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="group relative flex items-start space-x-8 pb-8">
          <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined">schedule</span>
          </div>

          <Card className="flex-1 rounded-2xl border-none bg-surface-container-lowest py-0 shadow-none ring-0 transition-all hover:translate-x-1">
            <CardContent className="p-6">
              <div className="mb-2 flex items-start justify-between gap-3">
                <span className="text-xs font-bold uppercase text-on-surface-variant">
                  Lunch · 12:30
                </span>

                <Badge className="rounded-full border-0 bg-surface-container px-3 py-1 text-[10px] font-bold uppercase text-on-surface-variant">
                  Pending
                </Badge>
              </div>

              <CardTitle className="mb-2 text-lg font-bold">
                Shigetsu (Zen cuisine)
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-on-surface-variant">
                Shojin Ryori lunch inside the temple grounds keeps the day
                compact and calm.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="group relative flex items-start space-x-8 pb-8">
          <div className="relative z-10 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-surface-container-high text-on-surface-variant">
            <span className="material-symbols-outlined">schedule</span>
          </div>

          <Card className="flex-1 rounded-2xl border-none bg-surface-container-lowest py-0 shadow-none ring-0 transition-all hover:translate-x-1">
            <CardContent className="p-6">
              <div className="mb-2 flex items-start justify-between gap-3">
                <span className="text-xs font-bold uppercase text-on-surface-variant">
                  Afternoon · 14:30
                </span>

                <Badge className="rounded-full border-0 bg-surface-container px-3 py-1 text-[10px] font-bold uppercase text-on-surface-variant">
                  Pending
                </Badge>
              </div>

              <CardTitle className="mb-2 text-lg font-bold">
                Tenryu-ji Temple
              </CardTitle>
              <CardDescription className="text-sm leading-relaxed text-on-surface-variant">
                The AI keeps the garden circuit after lunch for better pacing
                and fewer transfers.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
