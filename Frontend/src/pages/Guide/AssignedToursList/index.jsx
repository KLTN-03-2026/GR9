import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Filter,
  Loader2,
  MapPin,
  Plus,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarGroup, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  GUIDE_ASSIGNED_TOURS,
  filterToursBySegment,
} from "@/data/guideAssignedTours";

const SEGMENTS = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "upcoming", label: "Upcoming" },
  { id: "ongoing", label: "Ongoing" },
  { id: "completed", label: "Completed" },
];

const STATUS_LABEL = {
  ongoing: "Ongoing",
  scheduled: "Scheduled",
  completed: "Completed",
};

function statusBadgeClass(status) {
  if (status === "ongoing") return "bg-primary/90 text-on-primary border-0";
  if (status === "scheduled") return "bg-slate-100 text-slate-700 border-0";
  return "bg-surface-container-highest text-on-surface-variant border-0";
}

function sortTours(list, sortBy) {
  const next = [...list];
  if (sortBy === "startDate") next.sort((a, b) => a.startDate.localeCompare(b.startDate));
  if (sortBy === "title") next.sort((a, b) => a.title.localeCompare(b.title));
  if (sortBy === "passengers") next.sort((a, b) => b.passengerCount - a.passengerCount);
  return next;
}

const AssignedToursList = () => {
  const [segment, setSegment] = useState("all");
  const [sheetOpen, setSheetOpen] = useState(false);
  const [filterRegion, setFilterRegion] = useState("all");
  const [sortBy, setSortBy] = useState("startDate");
  const [showOngoing, setShowOngoing] = useState(true);
  const [showScheduled, setShowScheduled] = useState(true);
  const [showCompleted, setShowCompleted] = useState(true);
  const [proposeOpen, setProposeOpen] = useState(false);
  const [proposalTitle, setProposalTitle] = useState("");
  const [proposalRegion, setProposalRegion] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const filtered = useMemo(() => {
    let list = filterToursBySegment(GUIDE_ASSIGNED_TOURS, segment);
    if (filterRegion !== "all") list = list.filter((t) => t.region === filterRegion);
    list = list.filter((t) => {
      if (t.status === "ongoing") return showOngoing;
      if (t.status === "scheduled") return showScheduled;
      if (t.status === "completed") return showCompleted;
      return true;
    });
    return sortTours(list, sortBy);
  }, [
    segment,
    filterRegion,
    sortBy,
    showOngoing,
    showScheduled,
    showCompleted,
  ]);

  const activeFleetCount = useMemo(
    () => GUIDE_ASSIGNED_TOURS.filter((t) => t.status === "ongoing").length,
    [],
  );

  const heroTour = useMemo(() => {
    const ongoing = filtered.find((t) => t.status === "ongoing");
    if (ongoing) return ongoing;
    const preferred = filtered.find((t) => t.listRole === "hero");
    return preferred ?? filtered[0] ?? null;
  }, [filtered]);

  const sidebarTours = useMemo(
    () => filtered.filter((t) => heroTour && t.id !== heroTour.id && t.listRole === "sidebar"),
    [filtered, heroTour],
  );

  const laterTours = useMemo(
    () => filtered.filter((t) => t.listRole === "later"),
    [filtered],
  );

  const resetFilters = () => {
    setFilterRegion("all");
    setSortBy("startDate");
    setShowOngoing(true);
    setShowScheduled(true);
    setShowCompleted(true);
  };

  const submitProposal = () => {
    if (!proposalTitle.trim()) return;
    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      setProposeOpen(false);
      setProposalTitle("");
      setProposalRegion("");
    }, 450);
  };

  return (
    <div className="mx-auto w-full max-w-7xl text-on-surface">
      <section className="mb-12">
        <h1 className="mb-2 font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
          My Itineraries
        </h1>
        <p className="max-w-2xl text-lg text-on-surface-variant">
          Curating guide-ready travel experiences across the shared demo workspace. Here are your
          assigned journeys.
        </p>
      </section>

      <section className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0">
          {SEGMENTS.map((s) => (
            <Button
              key={s.id}
              type="button"
              size="lg"
              variant={segment === s.id ? "default" : "outline"}
              className={
                segment === s.id
                  ? "rounded-full px-5 py-2.5 shadow-md"
                  : "rounded-full border-outline-variant/20 bg-surface-container-lowest px-5 py-2.5 font-medium text-on-surface-variant hover:bg-surface-container"
              }
              onClick={() => setSegment(s.id)}
            >
              {s.label}
            </Button>
          ))}
        </div>

        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <Button
            type="button"
            variant="outline"
            className="rounded-xl border-outline-variant/20 bg-surface-container-lowest px-4 py-2.5 ring-1 ring-outline-variant/20"
            onClick={() => setSheetOpen(true)}
          >
            <Filter className="size-4" />
            Filters
          </Button>
          <SheetContent side="right" className="w-full gap-0 sm:max-w-md">
            <SheetHeader className="border-b border-outline-variant/15 pb-4">
              <SheetTitle className="font-headline">Filter itineraries</SheetTitle>
              <SheetDescription>
                Narrow the list by region, lifecycle state, and sort order.
              </SheetDescription>
            </SheetHeader>
            <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-4">
              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Region
                </p>
                <Select value={filterRegion} onValueChange={setFilterRegion}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-outline-variant/30">
                    <SelectValue placeholder="Region" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All regions</SelectItem>
                    <SelectItem value="vietnam">Vietnam</SelectItem>
                    <SelectItem value="greece">Greece</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Sort by
                </p>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="h-11 w-full rounded-xl border-outline-variant/30">
                    <SelectValue placeholder="Sort" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="startDate">Start date</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                    <SelectItem value="passengers">Passenger count</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  Status
                </p>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <Checkbox checked={showOngoing} onCheckedChange={(v) => setShowOngoing(!!v)} />
                  Ongoing
                </label>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <Checkbox checked={showScheduled} onCheckedChange={(v) => setShowScheduled(!!v)} />
                  Scheduled
                </label>
                <label className="flex cursor-pointer items-center gap-3 text-sm">
                  <Checkbox checked={showCompleted} onCheckedChange={(v) => setShowCompleted(!!v)} />
                  Completed
                </label>
              </div>
            </div>
            <SheetFooter className="border-t border-outline-variant/15">
              <Button variant="outline" className="w-full" onClick={resetFilters}>
                Reset filters
              </Button>
              <Button className="w-full" onClick={() => setSheetOpen(false)}>
                Apply
              </Button>
            </SheetFooter>
          </SheetContent>
        </Sheet>
      </section>

      {!heroTour && (
        <Card className="border-dashed border-outline-variant/40 bg-surface-container-lowest/50 py-12 text-center ring-0">
          <CardContent className="text-on-surface-variant">
            No tours match these filters. Try another tab or reset filters.
          </CardContent>
        </Card>
      )}

      {heroTour && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="group cursor-pointer lg:col-span-8">
            <Card className="h-[500px] overflow-hidden rounded-2xl border-0 bg-surface-container-lowest py-0 shadow-sm ring-0">
              <div className="relative flex h-2/3 flex-col overflow-hidden">
                <img
                  alt={heroTour.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src={heroTour.heroImage}
                />
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <Badge
                    className={`${statusBadgeClass(heroTour.status)} rounded-full px-3 py-1 text-xs font-bold uppercase tracking-widest`}
                  >
                    {STATUS_LABEL[heroTour.status] ?? heroTour.status}
                  </Badge>
                  <Badge className="rounded-full border-0 bg-tertiary-container px-3 py-1 text-xs font-bold tracking-widest text-on-tertiary-fixed uppercase">
                    Guide View
                  </Badge>
                </div>
                <div className="absolute bottom-4 left-4">
                  <div className="rounded-xl bg-white/90 px-4 py-2 backdrop-blur-md">
                    <span className="text-xl font-bold text-primary">{heroTour.code}</span>
                  </div>
                </div>
              </div>
              <CardContent className="flex flex-grow flex-col justify-between p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h2 className="mb-2 font-headline text-3xl font-bold text-on-surface">
                      {heroTour.title}
                    </h2>
                    <p className="flex items-center gap-2 text-on-surface-variant">
                      <MapPin className="size-4 shrink-0" />
                      Pickup: {heroTour.pickup}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className="mb-1 block text-xs font-bold tracking-widest text-on-surface-variant uppercase">
                      Guide
                    </span>
                    <span className="font-semibold text-primary">{heroTour.guideName}</span>
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-outline-variant/10 pt-6">
                  <div className="flex flex-wrap gap-8">
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface-variant">Passengers</span>
                      <span className="flex items-center gap-1 text-lg font-bold">
                        {heroTour.passengerCount}
                        <Users className="size-4" />
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-medium text-on-surface-variant">Duration</span>
                      <span className="text-lg font-bold">{heroTour.dateRangeLabel}</span>
                    </div>
                  </div>
                  <Button
                    size="lg"
                    className="rounded-xl px-8 py-3 font-bold shadow-lg shadow-primary/20"
                    asChild
                  >
                    <Link to={`/guide/tour-detail-ops/${heroTour.id}`}>
                      View Full Itinerary
                      <ArrowRight className="size-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="flex flex-col gap-6 lg:col-span-4">
            {sidebarTours.map((t) => (
              <Card
                key={t.id}
                className="group overflow-hidden rounded-2xl border-0 bg-surface-container-lowest py-0 shadow-sm ring-0 transition-all hover:shadow-lg"
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    alt={t.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src={t.cardImage}
                  />
                  <div className="absolute top-4 left-4">
                    <Badge
                      className={`${statusBadgeClass(t.status)} rounded-full px-3 py-1 text-[10px] font-bold tracking-widest uppercase shadow-sm`}
                    >
                      {t.status}
                    </Badge>
                  </div>
                </div>
                <CardContent className="p-6">
                  <span className="mb-1 block text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                    {t.code}
                  </span>
                  <h3 className="mb-4 font-headline text-xl font-bold">{t.title}</h3>
                  <div className="space-y-3 text-sm text-on-surface-variant">
                    <div className="flex items-center gap-3">
                      <CalendarDays className="size-[18px] shrink-0" />
                      <span>{t.dateRangeLabel}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Users className="size-[18px] shrink-0" />
                      <span>{t.passengerCount} Passengers</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="size-[18px] shrink-0" />
                      <span>{t.locationShortLabel}</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="mt-6 w-full rounded-xl border-outline-variant/30 font-bold text-primary hover:bg-primary/5"
                    asChild
                  >
                    <Link to={`/guide/tour-detail-ops/${t.id}`}>View Details</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}

            <Card className="relative overflow-hidden rounded-2xl border-0 bg-primary-container py-6 text-on-primary shadow-lg ring-0 shadow-primary-container/20">
              <CardContent className="relative z-10 px-6">
                <h3 className="mb-2 font-headline text-lg font-bold">Live Fleet View</h3>
                <p className="mb-6 text-sm text-on-primary-container/80">
                  {activeFleetCount} tour{activeFleetCount === 1 ? "" : "s"} currently active in your
                  region.
                </p>
                <div className="relative mb-4 h-32 overflow-hidden rounded-xl bg-white/10 backdrop-blur-md">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-200/20">
                    <MapPin className="size-10 fill-current text-primary-fixed" />
                  </div>
                </div>
                <Button
                  variant="secondary"
                  className="w-full rounded-lg bg-on-primary text-xs font-bold tracking-widest text-primary-container uppercase hover:bg-on-primary-container"
                  asChild
                >
                  <Link to="/guide/live-tour-tracking">Open Tracking</Link>
                </Button>
              </CardContent>
              <div className="pointer-events-none absolute -right-8 -bottom-8 size-32 rounded-full bg-on-primary/10 blur-2xl" />
            </Card>
          </div>

          <div className="mt-4 lg:col-span-12">
            <h4 className="mb-6 font-headline text-xl font-bold text-on-surface">Later this week</h4>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              {laterTours.map((t) => (
                <Card
                  key={t.id}
                  className="flex flex-col justify-between rounded-2xl border border-transparent bg-surface-container-low py-6 transition-all hover:border-outline-variant/20 hover:bg-surface-container-high"
                >
                  <CardContent className="flex flex-col gap-4 px-6">
                    <div>
                      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
                        <span className="text-[10px] font-bold tracking-widest text-on-surface-variant uppercase">
                          {t.code}
                        </span>
                        <Badge variant="muted" className="rounded px-2 py-0.5 text-[10px] font-bold uppercase">
                          {t.status}
                        </Badge>
                      </div>
                      <h5 className="mb-2 text-lg font-bold">{t.title}</h5>
                      <p className="mb-4 text-xs text-on-surface-variant">
                        {t.dateRangeLabel} · {t.passengerCount} passengers
                      </p>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <AvatarGroup>
                        {t.passengers.slice(0, 3).map((p) => (
                          <Avatar key={p.id} className="size-6 border-2 border-white">
                            <AvatarImage src={p.avatar} alt={p.name} />
                            <AvatarFallback className="text-[9px]">{p.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                        ))}
                      </AvatarGroup>
                      <Button variant="link" className="h-auto p-0 text-xs font-semibold" asChild>
                        <Link to={`/guide/tour-detail-ops/${t.id}`}>Manage Tour</Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              <button
                type="button"
                onClick={() => setProposeOpen(true)}
                className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant/50 bg-white p-6 text-center transition-all hover:border-primary/50"
              >
                <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-teal-50 text-primary transition-transform group-hover:scale-110">
                  <Plus className="size-7" />
                </div>
                <h5 className="text-lg font-bold text-on-surface">Propose New Tour</h5>
                <p className="text-sm text-on-surface-variant">Design a custom route for your next group</p>
              </button>
            </div>
          </div>
        </div>
      )}

      <Dialog open={proposeOpen} onOpenChange={setProposeOpen}>
        <DialogContent className="max-w-md rounded-2xl sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-headline">Propose a tour</DialogTitle>
            <DialogDescription>
              Send a draft route to operations. This demo only confirms locally.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-2">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Working title
              </span>
              <Input
                value={proposalTitle}
                onChange={(e) => setProposalTitle(e.target.value)}
                placeholder="e.g. Hue heritage express"
                className="h-11 rounded-xl border-outline-variant/30"
              />
            </div>
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Primary region
              </span>
              <Input
                value={proposalRegion}
                onChange={(e) => setProposalRegion(e.target.value)}
                placeholder="City / country"
                className="h-11 rounded-xl border-outline-variant/30"
              />
            </div>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setProposeOpen(false)}>
              Cancel
            </Button>
            <Button disabled={!proposalTitle.trim() || submitting} onClick={submitProposal}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Sending…
                </>
              ) : (
                "Submit draft"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AssignedToursList;
