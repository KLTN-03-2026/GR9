import { Card, CardContent } from "@/components/ui/card";

export default function TourTrackingOverviewSection() {
  return (
    <Card className="relative overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-sm ring-0">
      <CardContent className="relative z-10 space-y-10 p-8">
        <div className="absolute right-0 top-0 p-8">
          <div className="text-right">
            <span className="mb-1 block text-[10px] font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Local Time
            </span>
            <span className="font-headline text-2xl font-extrabold text-teal-800">
              01:03 PM
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <div className="rounded-2xl bg-tertiary-container/10 p-4">
            <span
              className="material-symbols-outlined text-3xl text-tertiary-container"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              timer
            </span>
          </div>
          <div>
            <h3 className="text-xl font-bold">Tour Progress: Day 1 of 2</h3>
            <p className="text-on-surface-variant">
              This is a self-guided AI itinerary. You follow the route
              personally and handle payments directly at each stop.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-on-surface-variant">
            <span>Arashiyama Bamboo Grove</span>
            <span>Shigetsu (Zen cuisine)</span>
            <span>Tenryu-ji Temple</span>
          </div>

          <div className="relative h-3 overflow-hidden rounded-full bg-surface-container">
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-teal-400 to-primary"
              style={{ width: "0%" }}
            />
            <div
              className="absolute -top-0.5 -ml-2 h-4 w-4 rounded-full border-2 border-primary bg-white shadow-md"
              style={{ left: "0%" }}
            />
          </div>

          <div className="flex justify-between pt-2">
            <div className="flex items-center space-x-2 text-primary">
              <span className="material-symbols-outlined text-base">
                check_circle
              </span>
              <span className="text-sm font-semibold">
                Completed: Planner ready
              </span>
            </div>

            <div className="flex items-center space-x-2 text-on-surface-variant">
              <span className="material-symbols-outlined text-base">
                arrow_forward
              </span>
              <span className="text-sm font-semibold">
                Next: Arashiyama Bamboo Grove
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
