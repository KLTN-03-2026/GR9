import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  BedDouble,
  CarFront,
  CirclePlus,
  Clock,
  ConciergeBell,
  ImagePlus,
  ShieldCheck,
  Sparkles,
  Trash2,
  WandSparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function DialogCreateTour({ open, onOpenChange, services }) {
  const [days, setDays] = useState([{ activities: [1] }]);

  const handleAddDay = () => {
    setDays((currentDays) => [...currentDays, { activities: [1] }]);
  };

  const handleRemoveDay = (dayIndex) => {
    setDays((currentDays) =>
      currentDays.length > 1
        ? currentDays.filter(
            (_, currentDayIndex) => currentDayIndex !== dayIndex,
          )
        : currentDays,
    );
  };

  const handleAddActivity = (dayIndex) => {
    setDays((currentDays) =>
      currentDays.map((day, index) =>
        index === dayIndex
          ? {
              ...day,
              activities: [...day.activities, day.activities.length + 1],
            }
          : day,
      ),
    );
  };

  const handleRemoveActivity = (dayIndex, activityIndex) => {
    setDays((currentDays) =>
      currentDays.map((day, currentDayIndex) =>
        currentDayIndex === dayIndex
          ? {
              ...day,
              activities:
                day.activities.length > 1
                  ? day.activities.filter(
                      (_, currentActivityIndex) =>
                        currentActivityIndex !== activityIndex,
                    )
                  : day.activities,
            }
          : day,
      ),
    );
  };
  if (!services) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="flex max-h-[92vh] max-w-[calc(100%-2rem)] flex-col overflow-hidden rounded-[2rem] border-none bg-surface p-0 sm:max-w-6xl">
          <DialogHeader className="border-b border-slate-200 px-6 py-5">
            <DialogTitle className="font-headline text-2xl font-extrabold text-on-surface">
              Create Tour
            </DialogTitle>
            <DialogDescription className="text-sm text-on-surface-variant">
              Fill in the tour details, itinerary, and logistics without leaving
              the manage tours dashboard.
            </DialogDescription>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <div className="space-y-10" aria-label="Edit tour form">
              <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                <CardHeader className="px-6 pt-6">
                  <CardTitle className="font-headline text-2xl font-bold">
                    Basic Information
                  </CardTitle>
                  <p className="text-sm text-on-surface-variant">
                    Start with the essential details travelers and search
                    engines use to understand the experience.
                  </p>
                </CardHeader>
                <CardContent className="grid grid-cols-1 gap-6 px-6 pb-6 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <label
                      htmlFor="tour-name"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                    >
                      Tour Name
                    </label>
                    <Input
                      id="tour-name"
                      type="text"
                      placeholder="e.g. Hidden Gems of the Amalfi Coast"
                      className="h-14 rounded-2xl border-outline-variant/20 bg-surface-container-low px-4 font-headline text-lg font-semibold"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="base-price"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                    >
                      Base Price (USD)
                    </label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">
                        $
                      </span>
                      <Input
                        id="base-price"
                        type="number"
                        placeholder="0.00"
                        className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-low pl-8"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="max-capacity"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                    >
                      Max Capacity
                    </label>
                    <Input
                      id="max-capacity"
                      type="number"
                      placeholder="12"
                      className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-low"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="duration-days"
                      className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500"
                    >
                      Duration (Days)
                    </label>
                    <Input
                      id="duration-days"
                      type="number"
                      placeholder="1"
                      className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-low"
                    />
                  </div>
                </CardContent>
              </Card>

              <section className="space-y-6">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-tertiary-container text-on-tertiary-fixed">
                      <WandSparkles className="size-5" />
                    </div>
                    <div>
                      <h2 className="font-headline text-2xl font-bold uppercase tracking-tight">
                        Itinerary Builder
                      </h2>
                      <p className="text-sm text-on-surface-variant">
                        Build a vivid, traveler-friendly day plan with strong
                        visual cues and descriptive copy.
                      </p>
                    </div>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleAddDay}
                    className="h-11 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 font-bold text-primary"
                  >
                    <CirclePlus className="size-4" />
                    Add Day
                  </Button>
                </div>

                {days.map((day, dayIndex) => (
                  <Card
                    key={dayIndex}
                    className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]"
                  >
                    <div className="flex flex-col gap-4 bg-surface-container-low px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-on-primary">
                          {dayIndex + 1}
                        </span>
                        <div className="flex min-w-0 flex-1 flex-col gap-2">
                          <h3 className="font-headline text-lg font-bold text-on-surface whitespace-nowrap">
                            <span>Day {dayIndex + 1}</span>
                          </h3>
                          <Textarea
                            placeholder="Introduce the rhythm, setting, and tone of the tour"
                            className="min-h-20 text-xs text-on-surface-variant"
                          />
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          onClick={() => handleRemoveDay(dayIndex)}
                          disabled={days.length === 1}
                          className="h-10 rounded-xl px-4 font-semibold text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 className="size-4" />
                          Remove Day
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => handleAddActivity(dayIndex)}
                          className="h-10 rounded-xl border-dashed border-primary/25 bg-primary/5 px-4 font-semibold text-primary"
                        >
                          <CirclePlus className="size-4" />
                          Add Activity
                        </Button>
                      </div>
                    </div>

                    <CardContent className="space-y-8 p-6">
                      {day.activities.map((activity, activityIndex) => (
                        <div
                          key={activityIndex}
                          className={`grid grid-cols-1 gap-6 lg:grid-cols-3 ${
                            activityIndex > 0
                              ? "border-t border-slate-100 pt-8"
                              : ""
                          }`}
                        >
                          <button
                            type="button"
                            className="group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-100 transition-all hover:border-primary/30 hover:bg-slate-200"
                          >
                            <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 p-4">
                              <ImagePlus className="size-5 text-slate-500" />
                              <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-slate-600">
                                + Add Photo
                              </p>
                            </div>
                          </button>

                          <div className="space-y-4 lg:col-span-2">
                            <div className="flex items-center justify-between">
                              <Select>
                                <SelectTrigger className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-low px-4 text-sm font-semibold">
                                  <SelectValue placeholder="Select activity" />
                                </SelectTrigger>
                                <SelectContent>
                                  {services
                                    .filter(
                                      (service) => service.type === "ACTIVITY",
                                    )
                                    .map((service) => (
                                      <SelectItem
                                        key={service.id}
                                        value={service.id}
                                      >
                                        {service.name}
                                      </SelectItem>
                                    ))}
                                </SelectContent>
                              </Select>
                              <Button
                                type="button"
                                variant="ghost"
                                onClick={() =>
                                  handleRemoveActivity(dayIndex, activityIndex)
                                }
                                disabled={day.activities.length === 1}
                                className="h-9 rounded-xl px-3 text-slate-500 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Trash2 className="size-4" />
                                Remove Activity
                              </Button>
                            </div>

                            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em] text-primary">
                              <Clock className="size-4" />
                              <Input
                                type="time"
                                placeholder="Time"
                                className="h-12 w-32 rounded-xl border-none bg-surface-container-low px-4"
                              />
                            </div>

                            <Input
                              type="text"
                              placeholder={
                                activityIndex === 0
                                  ? "Activity title, e.g. Sunrise Coffee & Briefing"
                                  : `Activity ${activityIndex + 1} title`
                              }
                              className="h-12 rounded-xl border-none bg-surface-container-low px-4"
                            />
                            <Textarea
                              placeholder={
                                activityIndex === 0
                                  ? "Describe the experience in detail..."
                                  : `Describe activity ${activityIndex + 1} in detail...`
                              }
                              className="min-h-28 rounded-xl border-none bg-surface-container-low px-4 py-3"
                            />
                          </div>
                        </div>
                      ))}

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleAddActivity(dayIndex)}
                        className="h-11 rounded-2xl border-2 border-dashed border-primary/20 bg-primary/5 px-4 font-bold text-primary"
                      >
                        <CirclePlus className="size-4" />
                        Add Activity To Day {dayIndex + 1}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </section>

              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-secondary-container text-on-secondary-container">
                    <ConciergeBell className="size-5" />
                  </div>
                  <div>
                    <h2 className="font-headline text-2xl font-bold uppercase tracking-tight">
                      Services & Logistics
                    </h2>
                    <p className="text-sm text-on-surface-variant">
                      Select the operational details that support the traveler
                      experience on the ground.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                  <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                    <CardHeader className="px-6 pt-6">
                      <CardTitle className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                        Hotel
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 pb-6">
                      <Select defaultValue="grand-hotel">
                        <SelectTrigger className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-low px-4 text-sm font-semibold">
                          <SelectValue placeholder="Select hotel" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="grand-hotel">
                            Grand Hotel Ambasciatori
                          </SelectItem>
                          <SelectItem value="ocean-pearl">
                            Ocean Pearl Resort
                          </SelectItem>
                          <SelectItem value="city-boutique">
                            City Boutique Hotel
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-surface-container-low p-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <BedDouble className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-on-surface">
                            Grand Hotel Ambasciatori
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                            5 Stars
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                    <CardHeader className="px-6 pt-6">
                      <CardTitle className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                        Transport
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 pb-6">
                      <Select defaultValue="private-van">
                        <SelectTrigger className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-low px-4 text-sm font-semibold">
                          <SelectValue placeholder="Select transport" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="private-van">
                            Private Van
                          </SelectItem>
                          <SelectItem value="speedboat">Speedboat</SelectItem>
                          <SelectItem value="shuttle-bus">
                            Shuttle Bus
                          </SelectItem>
                        </SelectContent>
                      </Select>

                      <div className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-surface-container-low p-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                          <CarFront className="size-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-on-surface">
                            Private Van
                          </p>
                          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                            Default option
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
                    <CardHeader className="px-6 pt-6">
                      <CardTitle className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                        Lead Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 px-6 pb-6">
                      <Select>
                        <SelectTrigger className="h-12 rounded-xl border-outline-variant/20 bg-surface-container-low px-4 text-sm font-semibold">
                          <SelectValue placeholder="Select lead guide" />
                        </SelectTrigger>
                        <SelectContent />
                      </Select>

                      <div className="flex items-start gap-3 rounded-2xl bg-tertiary-container/8 p-4">
                        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-tertiary" />
                        <p className="text-xs leading-5 text-on-tertiary-fixed-variant">
                          All guides are certified, background checked, and
                          selected for high-quality on-tour communication.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            </div>
          </div>

          <DialogFooter className="mx-0 mb-0 shrink-0 flex-col gap-3 rounded-none border-t border-slate-200 bg-surface px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              className="h-11 rounded-xl border-slate-200 bg-white px-5 font-semibold text-slate-600"
            >
              Cancel
            </Button>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                variant="outline"
                className="h-11 rounded-xl border-outline-variant/30 bg-white px-5 font-semibold text-slate-600"
              >
                Save Draft
              </Button>
              <Button className="h-11 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 font-bold text-on-primary shadow-lg shadow-primary/15">
                Publish Tour
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
