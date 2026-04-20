import { ArrowUpRight, Sparkles, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export default function ManageToursStats() {
  return (
    <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr_1fr_1.15fr]">
      <Card className="rounded-[1.5rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <CardContent className="p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
            Total Revenue
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-headline text-3xl font-extrabold text-on-surface">
                $42,850
              </span>
              <TrendingUp className="size-4 text-emerald-600" />
            </div>
            <p className="text-xs font-medium text-emerald-600">+12.4%</p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <CardContent className="p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
            Active Tours
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-headline text-3xl font-extrabold text-on-surface">
                18
              </span>
            </div>
            <p className="text-xs font-medium text-on-surface-variant">
              Currently listed
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
        <CardContent className="p-6">
          <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant">
            Booking Rate
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2">
              <span className="font-headline text-3xl font-extrabold text-on-surface">
                84%
              </span>
            </div>
            <p className="text-xs font-medium text-on-surface-variant">
              Strong conversion this month
            </p>
            <Progress value={84} className="mt-3 h-1.5 bg-slate-200" />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] border-none bg-linear-to-br from-[#0b695f] via-[#0f8578] to-[#36a59a] py-0 text-white shadow-[0_18px_45px_rgba(0,104,95,0.22)]">
        <CardContent className="p-6">
          <div className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-teal-50/90">
            <Sparkles className="size-4" />
            AI Insight
          </div>
          <p className="text-sm leading-6 text-teal-50/95">
            Luxury Amalfi Coast tours are trending. Consider adding a sunset
            private boat option to capture higher-intent travelers.
          </p>
          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-white">
            View suggestions
            <ArrowUpRight className="size-4" />
          </div>
        </CardContent>
      </Card>
    </section>
  );
}
