import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const formatDateInputValue = (date) => {
  if (!(date instanceof Date) || Number.isNaN(date.getTime())) {
    return "";
  }

  const year = date.getUTCFullYear();
  const month = String(date.getUTCMonth() + 1).padStart(2, "0");
  const day = String(date.getUTCDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

function PlannerSidebar({
  budget,
  quantity,
  destination,
  duration,
  handleGenerateTour,
  onBudgetChange,
  onCompanionChange,
  onDestinationChange,
  onDurationChange,
  onStartDateChange,
  startDate,
  describe,
  setDescribe,
}) {
  return (
    <section className="scrollbar-hide h-full w-full overflow-y-auto bg-surface-container-low p-8 md:w-[400px] xl:w-[450px]">
      <div className="mx-auto max-w-md">
        <header className="mb-10">
          <h1 className="mb-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface">
            Build your dream.
          </h1>
          <p className="text-sm text-on-surface-variant">
            Fill in the details, and our AI concierge will curate a bespoke
            itinerary just for you.
          </p>
        </header>

        <div className="space-y-8">
          <div className="space-y-2">
            <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Destination
            </Label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                location_on
              </span>
              <Input
                type="text"
                value={destination}
                onChange={(e) => onDestinationChange(e.target.value)}
                className="h-14 rounded-2xl border-outline-variant/20 bg-surface-container-lowest py-4 pl-12 pr-4 font-medium text-on-surface focus-visible:border-primary focus-visible:ring-primary/10"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Start Date
            </Label>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary">
                calendar_month
              </span>
              <Input
                type="date"
                value={formatDateInputValue(startDate)}
                onChange={(e) => onStartDateChange(e.target.value)}
                className="h-14 rounded-2xl border-outline-variant/20 bg-surface-container-lowest pl-12 pr-4 font-medium text-on-surface focus-visible:border-primary focus-visible:ring-primary/10"
              />
            </div>
          </div>

          <Card className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-gradient-to-br from-white to-slate-50 py-0 shadow-none">
            <CardContent className="space-y-4 p-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Duration
                  </Label>
                  <Select
                    value={String(duration)}
                    onValueChange={onDurationChange}
                  >
                    <SelectTrigger className="!h-14 w-full rounded-2xl border-outline-variant/20 bg-white px-4 text-base font-semibold text-on-surface">
                      <SelectValue placeholder="Select duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Days</SelectItem>
                      <SelectItem value="5">5 Days</SelectItem>
                      <SelectItem value="7">7 Days</SelectItem>
                      <SelectItem value="14">14 Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Budget
                  </Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold text-primary">
                      $
                    </span>
                    <Input
                      type="number"
                      min="0"
                      value={budget}
                      onChange={(e) => onBudgetChange(e.target.value)}
                      placeholder="Enter your budget"
                      className="h-14 rounded-2xl border-outline-variant/20 bg-white pl-9 text-base font-semibold text-on-surface"
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl bg-slate-100 px-4 py-3 text-[11px] text-on-surface-variant">
                <span>Suggested range</span>
                <span className="font-bold text-on-surface">$800 - $2,500</span>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              Describe your trip
            </Label>
            <div className="flex flex-wrap gap-2">
              <Textarea
                value={describe}
                onChange={(e) => setDescribe(e.target.value)}
                className="h-32 rounded-2xl border-outline-variant/20 bg-surface-container-lowest  font-medium text-on-surface focus-visible:border-primary focus-visible:ring-primary/10"
                placeholder="Describe your trip"
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label className="px-1 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
              quantity
            </Label>
            <div className="grid grid-cols-1 gap-3">
              <Card className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-white py-0 shadow-none">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sky-50 text-sky-700">
                      <span className="material-symbols-outlined">person</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-on-surface">Adult</p>
                      <p className="text-xs text-on-surface-variant">
                        Main travelers for this trip
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Quantity
                      </p>
                      <Input
                        type="number"
                        min="0"
                        value={quantity.adult}
                        onChange={(e) =>
                          onCompanionChange("adult", e.target.value)
                        }
                        className="h-12 rounded-2xl border-outline-variant/20 bg-slate-50 text-center font-semibold text-on-surface"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Height
                      </p>
                      <div className="flex h-12 items-center justify-center rounded-2xl border border-outline-variant/20 bg-slate-100 text-center font-semibold text-on-surface">
                        170 cm
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-white py-0 shadow-none">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-50 text-amber-700">
                      <span className="material-symbols-outlined">wc</span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-on-surface">Child</p>
                      <p className="text-xs text-on-surface-variant">
                        Young travelers joining the itinerary
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Quantity
                      </p>
                      <Input
                        type="number"
                        min="0"
                        value={quantity.child}
                        onChange={(e) =>
                          onCompanionChange("child", e.target.value)
                        }
                        className="h-12 rounded-2xl border-outline-variant/20 bg-slate-50 text-center font-semibold text-on-surface"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Height
                      </p>
                      <div className="flex h-12 items-center justify-center rounded-2xl border border-outline-variant/20 bg-slate-100 text-center font-semibold text-on-surface">
                        120 cm
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="overflow-hidden rounded-3xl border border-outline-variant/20 bg-white py-0 shadow-none">
                <CardContent className="space-y-4 p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-700">
                      <span className="material-symbols-outlined">
                        child_care
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold text-on-surface">Infant</p>
                      <p className="text-xs text-on-surface-variant">
                        Babies or toddlers needing extra care
                      </p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Quantity
                      </p>
                      <Input
                        type="number"
                        min="0"
                        value={quantity.infant}
                        onChange={(e) =>
                          onCompanionChange("infant", e.target.value)
                        }
                        className="h-12 rounded-2xl border-outline-variant/20 bg-slate-50 text-center font-semibold text-on-surface"
                      />
                    </div>
                    <div className="space-y-2">
                      <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-on-surface-variant">
                        Height
                      </p>
                      <div className="flex h-12 items-center justify-center rounded-2xl border border-outline-variant/20 bg-slate-100 text-center font-semibold text-on-surface">
                        75 cm
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Button
            onClick={() => handleGenerateTour()}
            type="button"
            className="h-auto w-full rounded-2xl bg-gradient-to-r from-primary to-primary-container py-5 font-headline text-lg font-bold text-on-primary shadow-lg transition-all hover:-translate-y-1 hover:shadow-primary/20 active:scale-95"
          >
            <span>Generate Plan with AI</span>
            <span className="material-symbols-outlined">auto_awesome</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default PlannerSidebar;
