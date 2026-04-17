import { ChevronRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export default function TrackingLinkHero() {
  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(0,131,120,0.16),_transparent_38%),linear-gradient(135deg,_#ffffff,_#eef7f5)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 md:p-8">
      <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-teal-200/20 blur-3xl" />

      <div className="relative">
        <nav
          aria-label="Breadcrumb"
          className="mb-4 flex items-center gap-2 text-sm text-on-surface-variant"
        >
          <span>My Tours</span>
          <ChevronRight className="size-4" />
          <span className="font-medium text-primary">Booking #VGR-99281</span>
        </nav>

        <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
          Azure Horizon Expedition
        </h1>
        <p className="mt-2 text-lg text-on-surface-variant">
          Santorini, Greece • June 12-19, 2024
        </p>

        <div className="mt-5 flex flex-wrap gap-2">
          <Badge className="rounded-full bg-primary-fixed px-3 py-1 text-on-primary-fixed">
            Confirmed Booking
          </Badge>
          <Badge className="rounded-full bg-secondary-container px-3 py-1 text-on-secondary-container">
            Shareable live tracking
          </Badge>
        </div>
      </div>
    </section>
  );
}
