import {
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  FileText,
  Hotel,
  MapPinned,
  Sailboat,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GuideLiveTourTrackingTimeline() {
  return (
    <div className="flex-1 space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-teal-600">
            Execution Mode
          </span>
          <h1 className="mt-1 font-headline text-3xl font-extrabold text-on-surface">
            Today&apos;s Live Timeline
          </h1>
        </div>

        <span className="inline-flex items-center gap-2 rounded-full bg-tertiary-container/10 px-3 py-1 text-xs font-bold text-tertiary">
          <span className="h-2 w-2 animate-pulse rounded-full bg-tertiary" />
          LIVE UPDATING
        </span>
      </div>

      <div className="relative space-y-6 before:absolute before:bottom-4 before:left-6 before:top-4 before:w-0.5 before:bg-surface-container-highest before:content-['']">
        <div className="relative pl-14">
          <div className="absolute left-4 top-6 z-10 h-4 w-4 rounded-full border-4 border-surface-container-lowest bg-primary" />

          <Card className="rounded-xl border border-outline-variant/10 bg-surface-container-lowest py-0 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Hotel className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-headline text-lg font-bold text-on-surface">
                      Morning Hotel Pickup
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      The Ritz-Carlton Atoll
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-tight text-primary">
                  Completed
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface-variant">
                <span className="flex items-center gap-1">
                  <Clock3 className="h-4 w-4" />
                  08:00 AM
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  12 Guests
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative pl-14">
          <div className="absolute left-4 top-6 z-10 h-4 w-4 rounded-full border-4 border-surface-container-lowest bg-tertiary ring-4 ring-tertiary/20" />

          <Card className="rounded-xl border-2 border-primary/20 bg-surface-container-lowest py-0 shadow-[0px_20px_40px_rgba(25,28,30,0.06)] transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary/10 text-tertiary">
                    <Sailboat className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-headline text-lg font-bold text-on-surface">
                      Azure Horizon Boat Tour
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      North Lagoon Dock 4
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-tertiary-fixed px-3 py-1 text-xs font-bold uppercase tracking-tight text-on-tertiary-fixed">
                  In Progress
                </span>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Button
                  className="h-auto flex-col gap-1 rounded-xl border border-transparent bg-surface-container-low px-3 py-3 text-[10px] font-bold uppercase text-on-surface-variant shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/10 hover:bg-primary hover:text-white hover:shadow-lg active:translate-y-0"
                  variant="ghost"
                >
                  <Activity className="h-5 w-5" />
                  Start
                </Button>
                <Button
                  className="h-auto flex-col gap-1 rounded-xl border border-transparent bg-surface-container-low px-3 py-3 text-[10px] font-bold uppercase text-on-surface-variant shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/10 hover:bg-primary hover:text-white hover:shadow-lg active:translate-y-0"
                  variant="ghost"
                >
                  <CheckCircle2 className="h-5 w-5" />
                  Mark Done
                </Button>
                <Button
                  className="h-auto flex-col gap-1 rounded-xl border border-transparent bg-surface-container-low px-3 py-3 text-[10px] font-bold uppercase text-on-surface-variant shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/10 hover:bg-primary hover:text-white hover:shadow-lg active:translate-y-0"
                  variant="ghost"
                >
                  <AlertTriangle className="h-5 w-5" />
                  Delay
                </Button>
                <Button
                  className="h-auto flex-col gap-1 rounded-xl border border-transparent bg-surface-container-low px-3 py-3 text-[10px] font-bold uppercase text-on-surface-variant shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/10 hover:bg-primary hover:text-white hover:shadow-lg active:translate-y-0"
                  variant="ghost"
                >
                  <FileText className="h-5 w-5" />
                  Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="relative pl-14">
          <div className="absolute left-4 top-6 z-10 h-4 w-4 rounded-full border-4 border-surface-container-lowest bg-surface-container-highest" />

          <Card className="rounded-xl border border-outline-variant/10 bg-surface-container-low/50 py-0 opacity-75 shadow-sm transition-shadow hover:shadow-md">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-highest text-on-surface-variant">
                    <UtensilsCrossed className="h-5 w-5" />
                  </div>

                  <div>
                    <h3 className="font-headline text-lg font-bold text-on-surface">
                      Seafood Lunch Buffet
                    </h3>
                    <p className="text-sm text-on-surface-variant">
                      Coral Terrace Restaurant
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-surface-container-highest px-3 py-1 text-xs font-bold uppercase tracking-tight text-on-surface-variant">
                  Scheduled
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-on-surface-variant opacity-70">
                <span className="flex items-center gap-1">
                  <Clock3 className="h-4 w-4" />
                  12:30 PM
                </span>
                <span className="flex items-center gap-1">
                  <MapPinned className="h-4 w-4" />
                  VIP Reserved
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
