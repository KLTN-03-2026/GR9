import { useEffect, useState } from "react";
import {
  BedDouble,
  CarFront,
  ChevronRight,
  CirclePlus,
  ConciergeBell,
  ImagePlus,
  Mountain,
  Sailboat,
  ShieldCheck,
  Sparkles,
  Sun,
  Trash2,
  UtensilsCrossed,
  WandSparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const itinerarySections = [
  {
    key: "morning",
    label: "Morning",
    icon: Sun,
    iconClass: "text-amber-600",
    titlePlaceholder: "Activity title, e.g. Sunrise Coffee & Briefing",
    descPlaceholder: "Describe the experience in detail...",
    imageLabel: "Morning Photo",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA0z8jmfb6DMwraRTBU-YRFgovPYeQE_UB9LLSSxZokly9VWq1gLx8BsM29hSfxpWsD99f3W12gVlkWMdD2O69eWzybMKV4_a2dlQrIuVQvXG9YrG6shMkgSP_J8kDR4MjxHSSyvipKrBK4QayqZCyLF_Yp9inCMhze9zZYSJ1c3_VKx7V5XcI94jpclNxW5N7vkfnYb6uJBPSZUfwNni7FW58FSBKiHBpMgwTOtuDEbN-zAKfFgV846-rHGfl_9ig9Krteoi_DQKxc",
  },
  {
    key: "midday",
    label: "Midday",
    icon: UtensilsCrossed,
    iconClass: "text-primary",
    titlePlaceholder: "Lunch location or theme",
    descPlaceholder: "Menu highlights or activity details...",
    imageLabel: "Lunch Image",
  },
  {
    key: "afternoon",
    label: "Afternoon",
    icon: Mountain,
    iconClass: "text-slate-600",
    titlePlaceholder: "Main adventure of the day",
    descPlaceholder: "Physical intensity, sights, and hidden gems...",
    imageLabel: "Afternoon Image",
  },
];

const includedOptions = [
  { id: "meals", label: "All Meals", checked: true },
  { id: "fees", label: "Entry Fees", checked: true },
  { id: "pickup", label: "Airport Pick-up", checked: false },
  { id: "equipment", label: "Equipment Hire", checked: false },
];

const hotelOptions = [
  {
    id: "grand-hotel",
    name: "Grand Hotel Ambasciatori",
    meta: "5 Stars · Selected",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBhgnk6Cwn_tY-me5K7_lE9AAwEKzjqkIwMBuMR2GYI51g7BCci6QkA_mEWyhcPU9fgw2ENrpst5koPeZfifIhLe5leajOsuPQ2zogsmOPUejjLoWjXko0-REHhO0Q_oJUF3xdyA4Wp6uzgsJOeFoU1URUioeB8GUpILatjWvz7nAt8mHsAiHGBz126KGKEgDhmeMgZuiu-HuVuhGVfP5ck35b7kGjRg4CiL9UJfWZ0r4m8CSBRY1F-mSuaMhptCKEucvVwvgpThYr4",
  },
];

const guideOptions = [
  "Marco Rossi (Senior Italian Guide)",
  "Elena Vitucci (Art Historian)",
  "Luca Moretti (Trekking Expert)",
  "Assign Later",
];

export default function EditTour() {
  const [difficulty, setDifficulty] = useState("easy");
  const [guide, setGuide] = useState(guideOptions[0]);
  const [transport, setTransport] = useState("private-van");
  const [included, setIncluded] = useState(
    includedOptions.reduce((acc, item) => {
      acc[item.id] = item.checked;
      return acc;
    }, {}),
  );

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") ?? "";

    document.title = "Edit Tour | Voyager AI Provider";

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      "Create and optimize provider tours in Voyager AI with itinerary planning, logistics setup, pricing, and traveler-ready experience details.",
    );

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <main className="mx-auto max-w-6xl space-y-10 text-on-surface">
      <section className="relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(0,131,120,0.18),_transparent_38%),linear-gradient(135deg,_#ffffff,_#eef7f5)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 md:p-8">
        <div className="relative flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <nav
              aria-label="Breadcrumb"
              className="mb-4 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.24em] text-on-surface-variant"
            >
              <span>Tours</span>
              <ChevronRight className="size-3.5" />
              <span>Manage Tours</span>
              <ChevronRight className="size-3.5" />
              <span className="text-primary">Create New Tour</span>
            </nav>

            <h1 className="font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
              Craft Your Experience
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant md:text-base">
              Design a journey travelers will remember with strong structure,
              rich itinerary details, and conversion-friendly content that also
              reads cleanly for search engines.
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              <Badge className="rounded-full bg-primary/50 px-3 py-1 text-primary"></Badge>
              <Badge className="rounded-full bg-tertiary/50 px-3 py-1 text-tertiary"></Badge>
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="outline"
              className="h-12 rounded-2xl border-outline-variant/30 bg-white px-6 font-semibold text-slate-600"
            >
              Save Draft
            </Button>
            <Button className="h-12 rounded-2xl bg-gradient-to-br from-primary to-primary-container px-8 font-bold text-on-primary shadow-lg shadow-primary/15">
              Publish Tour
            </Button>
          </div>
        </div>
      </section>

      <form className="space-y-10" aria-label="Edit tour form">
        <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
          <CardHeader className="px-6 pt-6">
            <CardTitle className="font-headline text-2xl font-bold">
              Basic Information
            </CardTitle>
            <p className="text-sm text-on-surface-variant">
              Start with the essential details travelers and search engines use
              to understand the experience.
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

            <div>
              <label className="mb-2 block text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                Difficulty Level
              </label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger className="h-12 w-full rounded-xl border-outline-variant/20 bg-surface-container-low px-4">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="moderate">Moderate</SelectItem>
                  <SelectItem value="challenging">Challenging</SelectItem>
                </SelectContent>
              </Select>
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
                  Build a vivid, traveler-friendly day plan with strong visual
                  cues and descriptive copy.
                </p>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="h-11 rounded-2xl border-2 border-dashed border-primary/30 bg-primary/5 px-4 font-bold text-primary"
            >
              <CirclePlus className="size-4" />
              Add Day
            </Button>
          </div>

          <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
            <div className="flex flex-col gap-4 bg-surface-container-low px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary font-bold text-on-primary">
                  1
                </span>
                <div>
                  <h3 className="font-headline text-lg font-bold text-on-surface">
                    Day 1: Arrival & Coastal Welcome
                  </h3>
                  <p className="text-xs text-on-surface-variant">
                    Introduce the rhythm, setting, and tone of the tour.
                  </p>
                </div>
              </div>

              <Button
                type="button"
                variant="ghost"
                className="w-fit rounded-xl text-slate-500 hover:bg-white hover:text-red-600"
              >
                <Trash2 className="size-4" />
                Remove Day
              </Button>
            </div>

            <CardContent className="space-y-8 p-6">
              {itinerarySections.map((section, index) => {
                const Icon = section.icon;

                return (
                  <div
                    key={section.key}
                    className={cn(
                      "grid grid-cols-1 gap-6 lg:grid-cols-3",
                      index > 0 && "border-t border-slate-100 pt-8",
                    )}
                  >
                    <button
                      type="button"
                      className="group relative aspect-[4/3] overflow-hidden rounded-[1.5rem] border-2 border-dashed border-slate-200 bg-slate-100 transition-all hover:border-primary/30 hover:bg-slate-200"
                    >
                      {section.image ? (
                        <img
                          src={section.image}
                          alt={section.imageLabel}
                          className="absolute inset-0 h-full w-full object-cover opacity-45 transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : null}
                      <div className="relative z-10 flex h-full flex-col items-center justify-center gap-2 p-4">
                        <ImagePlus className="size-5 text-slate-500" />
                        <p className="text-center text-xs font-bold uppercase tracking-[0.24em] text-slate-600">
                          {section.imageLabel}
                        </p>
                      </div>
                    </button>

                    <div className="space-y-4 lg:col-span-2">
                      <div
                        className={cn(
                          "flex items-center gap-2 text-xs font-bold uppercase tracking-[0.24em]",
                          section.iconClass,
                        )}
                      >
                        <Icon className="size-4" />
                        {section.label}
                      </div>

                      <Input
                        type="text"
                        placeholder={section.titlePlaceholder}
                        className="h-12 rounded-xl border-none bg-surface-container-low px-4"
                      />
                      <Textarea
                        placeholder={section.descPlaceholder}
                        className="min-h-28 rounded-xl border-none bg-surface-container-low px-4 py-3"
                      />
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
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
                  Accommodation
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                {hotelOptions.map((hotel) => (
                  <div
                    key={hotel.id}
                    className="flex items-center gap-3 rounded-2xl border border-primary/15 bg-surface-container-low p-3"
                  >
                    <img
                      src={hotel.image}
                      alt={hotel.name}
                      className="h-14 w-14 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-bold text-on-surface">
                        {hotel.name}
                      </p>
                      <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-slate-500">
                        {hotel.meta}
                      </p>
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="h-11 w-full rounded-xl border-dashed border-primary/25 bg-primary/5 font-bold text-primary"
                >
                  <BedDouble className="size-4" />
                  Change Hotel
                </Button>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Transport Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-3 px-6 pb-6">
                <button
                  type="button"
                  onClick={() => setTransport("private-van")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-[1.25rem] p-4 text-sm font-bold transition-all",
                    transport === "private-van"
                      ? "bg-primary-container text-on-primary-container shadow-md"
                      : "bg-surface-container-low text-slate-600 hover:bg-slate-200",
                  )}
                >
                  <CarFront className="size-5" />
                  <span>Private Van</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTransport("speedboat")}
                  className={cn(
                    "flex flex-col items-center justify-center gap-2 rounded-[1.25rem] p-4 text-sm font-bold transition-all",
                    transport === "speedboat"
                      ? "bg-primary-container text-on-primary-container shadow-md"
                      : "bg-surface-container-low text-slate-600 hover:bg-slate-200",
                  )}
                >
                  <Sailboat className="size-5" />
                  <span>Speedboat</span>
                </button>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_16px_40px_rgba(15,23,42,0.05)]">
              <CardHeader className="px-6 pt-6">
                <CardTitle className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  Lead Guide
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 px-6 pb-6">
                <Select value={guide} onValueChange={setGuide}>
                  <SelectTrigger className="h-12 w-full rounded-xl border-none bg-surface-container-low px-4 text-sm font-semibold">
                    <SelectValue placeholder="Select guide" />
                  </SelectTrigger>
                  <SelectContent>
                    {guideOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <div className="flex items-start gap-3 rounded-2xl bg-tertiary-container/8 p-4">
                  <ShieldCheck className="mt-0.5 size-4 shrink-0 text-tertiary" />
                  <p className="text-xs leading-5 text-on-tertiary-fixed-variant">
                    All guides are certified, background checked, and selected
                    for high-quality on-tour communication.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        <Card className="rounded-[2rem] border-none bg-surface-container py-0 shadow-[0_16px_40px_rgba(15,23,42,0.04)]">
          <CardContent className="space-y-6 p-6">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-[0.24em] text-slate-500">
                  What&apos;s Included?
                </h3>
              </div>

              <div className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-primary shadow-sm">
                <Sparkles className="size-4" />
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              {includedOptions.map((item) => (
                <label
                  key={item.id}
                  className="flex cursor-pointer items-center gap-3 rounded-full bg-surface-container-lowest px-4 py-3 shadow-sm transition-all hover:bg-white"
                >
                  <Checkbox
                    checked={included[item.id]}
                    onCheckedChange={(checked) =>
                      setIncluded((current) => ({
                        ...current,
                        [item.id]: Boolean(checked),
                      }))
                    }
                  />
                  <span className="text-sm font-semibold">{item.label}</span>
                </label>
              ))}

              <Button
                type="button"
                variant="outline"
                className="rounded-full border-dashed border-slate-400 bg-transparent px-4 text-sm font-bold text-slate-500"
              >
                + Add Custom
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-3 pb-4 md:hidden">
          <Button className="h-12 rounded-2xl bg-primary font-bold text-on-primary shadow-lg">
            Publish Tour
          </Button>
          <Button
            variant="outline"
            className="h-12 rounded-2xl border-slate-200 bg-white font-bold text-slate-600"
          >
            Save Draft
          </Button>
        </div>
      </form>
    </main>
  );
}
