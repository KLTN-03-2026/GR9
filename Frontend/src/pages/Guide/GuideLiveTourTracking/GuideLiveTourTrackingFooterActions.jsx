import { Plus } from "lucide-react";
import toast from "react-hot-toast";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function GuideLiveTourTrackingFooterActions({ tracking }) {
  const passengers = tracking?.passengers || [];
  const trackingUrl = tracking?.trackingUrl || "";

  const copyTrackingLink = async () => {
    if (!trackingUrl) return;

    await navigator.clipboard.writeText(trackingUrl);
    toast.success("Đã copy link tracking public");
  };

  return (
    <Card className="rounded-[1.75rem] border border-slate-200/20 bg-white/80 py-0 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] backdrop-blur-lg">
      <CardContent className="flex flex-col gap-4 px-6 py-5 md:flex-row md:items-center md:justify-between">
        <div className="hidden items-center gap-3 md:flex">
          <div className="flex -space-x-2">
            {passengers.slice(0, 2).map((passenger) => (
              <Avatar key={passenger.id} className="h-8 w-8 border-2 border-white">
                <AvatarImage alt={passenger.name} src={passenger.avatarUrl} />
                <AvatarFallback>
                  {(passenger.name || "TR").slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            ))}

            <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-[10px] font-bold text-slate-500">
              +{Math.max((tracking?.group?.total || 0) - passengers.length, 0)}
            </div>
          </div>

          <span className="text-xs font-semibold text-slate-500">
            {tracking?.group?.total || 0} guests tracking your live link
          </span>
        </div>

        <div className="flex w-full gap-4 md:w-auto">
          <Button
            disabled
            className="flex-1 rounded-xl border-2 border-outline-variant/30 px-6 py-3 font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:text-primary hover:shadow-lg active:translate-y-0 md:flex-none"
          >
            Save Progress Update
          </Button>
          <Button
            type="button"
            disabled={!trackingUrl}
            onClick={copyTrackingLink}
            className="flex-1 rounded-xl border-2 border-outline-variant/30 px-6 py-3 font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/20 hover:bg-white hover:text-primary hover:shadow-lg active:translate-y-0 md:flex-none"
          >
            <Plus className="h-4 w-4" />
            Copy Public Link
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
