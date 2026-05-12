import { Leaf, MapPinned } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function TrackingLinkVisualCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-low py-0">
        <CardContent className="relative h-72 p-0">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwmkRrtLnRzhPIk_SXpFhXc9_BrPXl1frzsLIPp1gZZqJ9EEVswVJHLbpzFIofr8wrEhDuMgbk_dFN_4sYD32_L8-9eoPB5ru_4PTC4QW-NLYy41Fm9n7AnoC6I2ZKxoNn_Umn6ZHu_XTDlP6eWXbYtcINJJkbaQ4czmJcryaR8UTPc8h1oQXKTVLXU3KEyUaCkUFqfNpmrxrFY13s5ebgkcnj3bVcAckJ7XKBSHXROILxVM-ZfUIbJU_MximSZZ9_byHbtiib2XfT"
            alt="Live tracking route map"
            className="h-full w-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent" />
          <div className="absolute bottom-4 left-4 rounded-xl bg-white/80 px-4 py-2 text-sm font-bold shadow-sm backdrop-blur">
            <span className="flex items-center gap-2 text-on-surface">
              <MapPinned className="size-4 text-primary" />
              View Route Map
            </span>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[2rem] border-none bg-primary-container py-0 text-on-primary shadow-[0_18px_45px_rgba(0,131,120,0.22)]">
        <CardContent className="flex h-72 flex-col justify-between p-6">
          <Leaf className="size-10" />

          <div>
            <p className="font-headline text-4xl font-bold">12.4kg</p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[0.24em] opacity-80">
              Carbon Offset
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
