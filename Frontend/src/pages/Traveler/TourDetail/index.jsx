import React, { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

import { TRAVELER_TOURS } from "../TourList";

const FEATURE_CARDS = [
  { icon: "temple_buddhist", title: "Old town heritage" },
  { icon: "light", title: "Lantern workshop" },
  { icon: "restaurant", title: "Chef-led tasting" },
  { icon: "camera_alt", title: "Photo stops" },
];

const TIMELINE_ITEMS = [
  {
    time: "08:00",
    title: "Hotel lobby pickup",
    place: "Da Nang city center",
  },
  {
    time: "10:00",
    title: "Ancient town heritage walk",
    place: "Hoi An Old Town",
  },
  {
    time: "14:00",
    title: "Lantern-making workshop",
    place: "An Hoi Quarter",
  },
];

const MEMORY_CARDS = [
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDwLBQIZXRDx742QLoG_dba4D1f21uAFp7L8FwjkEGihhEOIj5w5PRb2LHn1iyGq6QHdbdfdi3E70Iv-a0bOpKmvjPlxp2EfiY2cSxYSersnRn8zeb-p0o8W4tGzCoSjIki5bVSqiySFVdfO4XrcXipkZxeJhCBfF3dKE8gdoKOPhfLMpbbM6kxUntNQ7y9lp5CfD8ZE8RvcGcsORLXPSe1sZhoG_r5eLjay-77d5mV_bYsa7P-lpO340ehMKJbVbFRWCdB9xB0qpyy",
    by: "By Maria S.",
    alt: "Golden Bridge",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCOcqjHijMLIZdVzszftnSS2LbhvfcFlVO0OkDy1fQ0CVJlydfDAace9fTGyCAoa8QXY3qVzoukfVvLJrjohS0oH8gGqAxeRAxELBCbUb30oqhok7lMQHk7YIZeyUgCTqij8f2S17NK0Mje5sLUQsF5CZ6b1E2tDdyPe4R_cxGvCmnW4n9DIG9p8z9Qni9DZ1tDd7vFKR0WMuL3pCVIfGf-CfcbHK35V2libMuk21FVKQIenUjGgQaL1PVs8tLDSyu40pR9Dr9bn9L4",
    by: "By James L.",
    alt: "Cable car",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuBMVHGMQqvqjPshagiYXLfkg7Dep66GERX8sHF3_8rW3FcEr069XBOr1MViFw4W6FZNtlehK4KWTIV_XFXkX8E2eudvYyeloLkxPNw6XgLWrpyAtIPOkc-vp5sE-ngvmT3UEwMRYqTpboG310j3s6rm9_2XH_qQVlfs2FF6i3NzpE4ZSjxKsQUzhCr5CT3TMhkMH9by2yJGNykSwcW_tV2s--mn1ufTqIKnHsUZhcm6Xz0tcituebybSr_BYH5jId4iakpLGE24oStH",
    by: "By Yuki T.",
    alt: "Pagoda",
  },
  {
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCAKle9HDMEfUnV8n9M_Tmy0v9AKwK8cuIUXUlYH6qSTh77eMZpVz-w2t7XGzyFJftJN9y8JMxJ8fnLZ4xshzRPXKNEOMa9sbmC3Sr53xTxdw1fRThUt1cFVj2_gszGIsdABC2kQyqOTWDLyDnEAtB-V99ukyvaYXM_cMotpQcOolJIz2DwRG7GExRz2zceZ2zF2_WPL3WamDjqwtlqhRzPan_bJRXAIz_Y_2TOZ4VXYENa9iVTPNzys7EidjsE86vF40GrmiqDcIn6",
    by: "By Olivia R.",
    alt: "French village",
  },
];

const REVIEW_ARTICLES = [
  {
    name: "Sarah Jenkins",
    avatarImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDU7YwwRvUOBXLYQjN_cM1YWy09AbSm03jXIOg3q3WcekEqtIyyPVwY41_4fkcqIJfq-qUP6nGitJSII0KXqEpAJ1lLdsm2fkp2RyDHAV-dtSTNwf2sIdFaSfMjcGgK4Hg7vduHPdVnHdsKwL8g5foEEREl8qm0hykb9eNtpo-A8Gfp9pF5nRHRUgCoJEhqCZZWuNxcK0270R9gZDvsyH-AHdBGRHw4qE6NkM38BoalfWWuBIwdt_02QJVOSNHki_1_Wup76Y8ioWQz",
    meta: "Traveled Sept 2023",
    type: "Solo Traveler",
    starsFill: 5,
    timeAgo: "2 weeks ago",
    title: "Magical morning and incredibly smooth pacing",
    body: "We arrived early enough to enjoy the signature viewpoints without feeling rushed. The guide handled timing beautifully, gave local context throughout the route, and even helped with photos. The included meal stop was better than expected and the whole experience felt polished from pickup to drop-off.",
    helpful: 42,
  },
  {
    name: "Marcus Thompson",
    avatarImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBWTcwySFLGvX2Lm7ZATrrlUVXj2iXb00eRLLlUe5Lz-ptg4ViE4CoflTIKwWc6VV-UR7444XXzjus2JSAaQU3aFi2eupFuV1maAtEsOnSYrjEZKKiPdKU6khzg9EfcLzqzuGj_471AEL59wMvmArMn8Wmbi7G6GvDse9iwTzhAG5FbL5oU-Md199SsGYE51Cnqok_9Jc4LRkuniULhOwdcnbT1KCZBKMcv-GV3SDq-ZcUzcLvZfO2DzcKj1LLbwuB1Cw8VMYmruaT0",
    meta: "Traveled Aug 2023",
    type: "Couple Trip",
    starsFill: 4,
    timeAgo: "1 month ago",
    title: "Beautiful route, best on a quieter day",
    body: "The scenery absolutely lives up to the hype and the transport logistics were effortless. Some portions felt busy during peak hours, so I would still recommend a weekday departure if possible. Even then, the overall route quality, comfort level and guide communication were excellent.",
    helpful: 15,
  },
  {
    name: "Elena Rodriguez",
    avatarImg:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBB1CIW0lgj3-GXGbmcicwtZ7Na0WpLDOLJzYDYIsnmjzn0eX4D4mXGV4l3mNt255gfH3nkITPVstCFT3-A0d1MSocMoJMgyJ-zFw-zxxLvocjLNaja_nx5--VO0eRCTR69sBAVlkobOIdX8e9RDWtsWfA1Am7q3Rhp88v54cKK0CLl8tingFN4LqAnYVFyZWqKnursXvC0nfL7ctO-6KTM0_Zj5fsqxUloU5FCMi11Rukj2H4e0DRb-jTMJEviZCvQRszFLlB1JZOt",
    meta: "Traveled July 2023",
    type: "Family of 4",
    starsFill: 5,
    timeAgo: "2 months ago",
    title: "Very easy for families to enjoy together",
    body: "What stood out most was how family-friendly the pacing felt. We had enough structure to keep the day smooth, but never felt pushed. Our guide was patient, helped us navigate meal choices for the kids, and made the stops feel engaging for adults and children alike.",
    helpful: 28,
  },
];

function parseMoney(priceStr) {
  const clean = String(priceStr ?? "").replace(/[^0-9.]/g, "");
  const n = Number(clean);
  return Number.isFinite(n) ? n : 0;
}

function formatMoney(n) {
  const x = Number.isFinite(n) ? n : 0;
  return `$${x.toLocaleString("en-US")}`;
}

export default function TourDetail() {
  const { tourId } = useParams();

  const tour = useMemo(() => {
    if (!tourId) return TRAVELER_TOURS[0];
    return TRAVELER_TOURS.find((t) => t.id === tourId) ?? TRAVELER_TOURS[0];
  }, [tourId]);

  const basePrice = useMemo(() => parseMoney(tour?.price), [tour?.price]);

  const [selectedDate, setSelectedDate] = useState("2026-04-05");
  const [dateDialogOpen, setDateDialogOpen] = useState(false);
  const [travelers, setTravelers] = useState(2);
  const [hotelPref, setHotelPref] = useState("no-over-night");
  const [transportPref, setTransportPref] = useState("shared-shuttle");

  const hotelOptions = useMemo(
    () => [
      {
        id: "no-over-night",
        label: "No overnight stay",
        subtitle: "Day-trip arrangement • Included",
        description:
          "This itinerary is operated as a day trip and does not require hotel booking.",
        extra: 0,
      },
      {
        id: "riverside-lounge",
        label: "Riverside Day Lounge",
        subtitle: "Day-use suite • Add-on",
        description:
          "Private refresh suite for shower, rest and luggage between activities.",
        extra: 90,
      },
    ],
    [],
  );

  const transportOptions = useMemo(
    () => [
      {
        id: "shared-shuttle",
        label: "Shared Shuttle",
        subtitle: "Shared transfer",
        description:
          "Scheduled pickup from Da Nang hotels with small-group routing.",
        extra: 0,
      },
      {
        id: "private-sedan",
        label: "Private Sedan",
        subtitle: "Private transfer",
        description:
          "Direct round-trip vehicle for a more flexible old-town schedule.",
        extra: 85,
      },
    ],
    [],
  );

  const hotelExtra = hotelOptions.find((h) => h.id === hotelPref)?.extra ?? 0;
  const transportExtra =
    transportOptions.find((t) => t.id === transportPref)?.extra ?? 0;
  const serviceFee = 120;

  const total = basePrice * travelers + serviceFee + hotelExtra + transportExtra;

  return (
    <div className="bg-surface font-body text-on-surface">
      <style>
        {`
.material-symbols-outlined { font-variation-settings: "FILL" 0, "wght" 400, "GRAD" 0, "opsz" 24; vertical-align: middle; }
.editorial-gradient { background: linear-gradient(135deg, #00685f 0%, #008378 100%); }
.hero-scrim { background: linear-gradient(to bottom, rgba(25, 28, 30, 0.4) 0%, rgba(25, 28, 30, 0) 30%, rgba(25, 28, 30, 0) 70%, rgba(25, 28, 30, 0.8) 100%); }
.hide-scrollbar::-webkit-scrollbar { display: none; }
.hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
`}
      </style>

      <main className="pt-16 min-h-screen">
        <section className="relative h-[716px] w-full overflow-hidden">
          <img
            alt={tour?.title ?? "Tour"}
            className="w-full h-full object-cover"
            src={tour?.image}
          />
          <div className="absolute inset-0 hero-scrim" />

          <div className="absolute bottom-0 left-0 w-full p-8 md:p-16">
            <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tertiary-container text-on-tertiary-fixed text-xs font-semibold tracking-wide uppercase">
                  <span
                    className="material-symbols-outlined text-sm"
                    style={{ fontVariationSettings: '"FILL" 1' }}
                  >
                    auto_awesome
                  </span>
                  AI Recommended
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white font-headline leading-tight tracking-tight">
                  {tour?.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-white/90 font-medium">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary-fixed">
                      location_on
                    </span>
                    {tour?.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary-fixed">
                      schedule
                    </span>
                    {tour?.duration}, 0 Nights
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary-fixed">
                      star
                    </span>
                    {tour?.rating} ({tour?.reviews} Reviews)
                  </span>
                </div>
              </div>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-white border border-white/20">
                <p className="text-sm opacity-80 mb-1 font-medium">
                  Starting from
                </p>
                <p className="text-3xl font-bold font-headline">
                  {tour?.price}
                  <span className="text-lg font-normal opacity-80">/person</span>
                </p>
              </div>
            </div>
          </div>
        </section>

        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12 lg:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-16">
              <section className="space-y-6">
                <h2 className="text-3xl font-bold font-headline text-on-surface">
                  Experience Overview
                </h2>
                <p className="text-lg text-on-surface-variant leading-relaxed max-w-3xl">
                  Private pickup, old town storytelling and a premium lantern
                  workshop in {tour?.location}.
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                  {FEATURE_CARDS.map((c) => (
                    <div
                      key={c.title}
                      className="p-6 rounded-2xl bg-surface-container-low flex flex-col items-center text-center gap-3"
                    >
                      <span className="material-symbols-outlined text-primary text-3xl">
                        {c.icon}
                      </span>
                      <span className="font-bold text-on-surface text-sm">
                        {c.title}
                      </span>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-8">
                <div className="flex items-center justify-between">
                  <h2 className="text-3xl font-bold font-headline text-on-surface">
                    Journey Timeline
                  </h2>
                  <Link
                    to="/traveler/tour-list"
                    className="text-primary font-bold text-sm hover:underline"
                  >
                    Frontend Demo
                  </Link>
                </div>

                <div className="space-y-12 relative before:absolute before:inset-y-0 before:left-4 before:w-[2px] before:bg-outline-variant/30">
                  <div className="relative pl-12">
                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs ring-4 ring-surface">
                      1
                    </div>
                    <h3 className="text-xl font-bold font-headline mb-2">
                      {tour?.location} old town circuit
                    </h3>
                    <p className="text-on-surface-variant mb-4">
                      Lobby pickup, walking tour, riverside lunch and lantern craft
                      session.
                    </p>

                    <div className="grid gap-4 md:grid-cols-2">
                      {TIMELINE_ITEMS.map((it) => (
                        <div
                          key={it.time}
                          className="p-4 rounded-xl bg-surface-container-low"
                        >
                          <p className="font-bold text-xs text-primary mb-1 uppercase tracking-wider">
                            {it.time}
                          </p>
                          <p className="text-sm">{it.title}</p>
                          <p className="text-xs text-on-surface-variant mt-1">
                            {it.place}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <section className="p-8 rounded-3xl bg-secondary-container/30 space-y-6">
                <h2 className="text-2xl font-bold font-headline text-on-surface">
                  Included Services
                </h2>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">
                      check_circle
                    </span>
                    <div>
                      <p className="font-bold text-on-surface">
                        Private transfer
                      </p>
                      <p className="text-sm text-on-surface-variant">
                        Door-to-door transport from Da Nang hotels.
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <span className="material-symbols-outlined text-primary">
                      check_circle
                    </span>
                    <div>
                      <p className="font-bold text-on-surface">Guide support</p>
                      <p className="text-sm text-on-surface-variant">
                        English-speaking local storyteller throughout the route.
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                <div className="bg-surface-container-lowest rounded-3xl p-8 shadow-2xl shadow-on-surface/5 border border-outline-variant/10">
                  <h3 className="text-2xl font-bold font-headline mb-6">
                    Book This Experience
                  </h3>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                        Select Date
                      </label>

                      <Dialog
                        open={dateDialogOpen}
                        onOpenChange={setDateDialogOpen}
                      >
                        <DialogTrigger asChild>
                          <button
                            className="flex items-center justify-between p-4 rounded-xl border border-outline-variant/30 w-full"
                            type="button"
                          >
                            <div className="flex items-center gap-3">
                              <span className="material-symbols-outlined text-on-surface-variant">
                                calendar_today
                              </span>
                              <span className="font-medium">
                                {selectedDate}
                              </span>
                            </div>
                            <span className="material-symbols-outlined text-on-surface-variant">
                              expand_more
                            </span>
                          </button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[420px] bg-white text-slate-900">
                          <div className="space-y-3">
                            <div className="space-y-2">
                              <p className="text-sm font-bold text-on-surface-variant">
                                Pick a date
                              </p>
                              <Input
                                type="date"
                                value={selectedDate}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                className="text-slate-900 bg-white"
                                style={{ colorScheme: "light" }}
                              />
                            </div>
                            <div className="flex justify-end">
                              <Button onClick={() => setDateDialogOpen(false)}>
                                Save
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                        Travelers
                      </label>
                      <div className="flex items-center justify-between p-2 rounded-xl border border-outline-variant/30">
                        <button
                          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors"
                          type="button"
                          onClick={() => setTravelers((v) => Math.max(1, v - 1))}
                        >
                          <span className="material-symbols-outlined">
                            remove
                          </span>
                        </button>
                        <span className="text-lg font-bold">
                          {travelers} Persons
                        </span>
                        <button
                          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-surface-container transition-colors"
                          type="button"
                          onClick={() => setTravelers((v) => Math.min(20, v + 1))}
                        >
                          <span className="material-symbols-outlined">add</span>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                        Hotel Preference
                      </label>
                      <div className="space-y-3">
                        {hotelOptions.map((opt) => {
                          const selected = opt.id === hotelPref;
                          return (
                            <button
                              key={opt.id}
                              className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                                selected
                                  ? "border-primary bg-primary/5"
                                  : "border-outline-variant/30 hover:bg-surface-container-low"
                              }`}
                              type="button"
                              onClick={() => setHotelPref(opt.id)}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-bold text-sm">{opt.label}</p>
                                  <p className="text-xs text-on-surface-variant mt-1">
                                    {opt.subtitle}
                                  </p>
                                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                                    {opt.description}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-primary whitespace-nowrap">
                                  {opt.extra === 0 ? "Included" : `+$${opt.extra}`}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">
                        Transport Preference
                      </label>
                      <div className="space-y-3">
                        {transportOptions.map((opt) => {
                          const selected = opt.id === transportPref;
                          return (
                            <button
                              key={opt.id}
                              className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                                selected
                                  ? "border-primary bg-primary/5"
                                  : "border-outline-variant/30 hover:bg-surface-container-low"
                              }`}
                              type="button"
                              onClick={() => setTransportPref(opt.id)}
                            >
                              <div className="flex items-start justify-between gap-4">
                                <div>
                                  <p className="font-bold text-sm">{opt.label}</p>
                                  <p className="text-xs text-on-surface-variant mt-1">
                                    {opt.subtitle}
                                  </p>
                                  <p className="text-xs text-on-surface-variant mt-2 leading-relaxed">
                                    {opt.description}
                                  </p>
                                </div>
                                <span className="text-sm font-bold text-primary whitespace-nowrap">
                                  {opt.extra === 0 ? "Included" : `+$${opt.extra}`}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="pt-6 space-y-3 border-t border-outline-variant/20">
                      <div className="flex justify-between text-on-surface-variant">
                        <span>
                          {tour?.price} x {travelers}
                        </span>
                        <span>{formatMoney(basePrice * travelers)}</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Service Fee</span>
                        <span>{formatMoney(serviceFee)}</span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Hotel Selection</span>
                        <span>
                          {hotelExtra === 0 ? "Included" : formatMoney(hotelExtra)}
                        </span>
                      </div>
                      <div className="flex justify-between text-on-surface-variant">
                        <span>Transport Selection</span>
                        <span>
                          {transportExtra === 0
                            ? "Included"
                            : formatMoney(transportExtra)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-2">
                        <span className="font-bold text-xl">Total</span>
                        <span className="font-bold text-2xl text-primary">
                          {formatMoney(total)}
                        </span>
                      </div>
                    </div>

                    <button
                      className="w-full py-4 rounded-xl editorial-gradient text-white font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
                      type="button"
                      onClick={() => {
                        alert(
                          `Confirm Booking\nTour: ${tour?.title}\nDate: ${selectedDate}\nTravelers: ${travelers}\nTotal: ${formatMoney(
                            total,
                          )}`,
                        );
                      }}
                    >
                      Confirm Booking
                    </button>

                    <p className="text-center text-xs text-on-surface-variant px-4">
                      Your reservation will appear in traveler bookings and unlock
                      the shared tracking flow for your group.
                    </p>
                    <p className="text-center text-xs text-on-surface-variant px-4">
                      Hotel and transport selections are sent as service requests
                      first. The provider confirms the real availability after
                      booking.
                    </p>
                  </div>
                </div>

                <div className="bg-surface-container-low rounded-3xl p-6 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden shrink-0">
                    <img
                      alt="Tran Thi Mai Chau"
                      className="w-full h-full object-cover"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuD0BfviMsRmGSM1xnCOiLAjEB-Xdb5zdVkaJer9i8EJDmcHyk3B_cx3NNEUzYZx5eeXLb3knh4GSyKV1fU2pKt6dX7NkkJOM-qqssY1oLkNGpRLgm3AiSVVcnGdAVSqgMJeL-mStHglR2Rc9V12kuRO9iwN7ZjrDqchBTD7BWXOm-mCLk6H7Q8mnXUOH5vIX9avqy2wQ7x_g34-VVu4BanY1QQ1qVm-2_PkEjdf_nz1PHmI3pTuP8jQkRkJa9qDZRvYGjv8ySp5VHSG"
                    />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-primary uppercase">
                      Suggested Guide
                    </p>
                    <p className="font-bold">Tran Thi Mai Chau</p>
                    <p className="text-xs text-on-surface-variant">
                      Coastal &amp; culture operations • 4.9★
                    </p>
                  </div>
                  <button className="p-2 hover:bg-surface-container-highest rounded-full transition-colors">
                    <span className="material-symbols-outlined text-on-surface-variant">
                      chat
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          <section className="mt-16 lg:mt-24 space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-bold uppercase tracking-[0.2em] text-primary">
                Traveler Feedback
              </p>
              <h2 className="text-3xl md:text-4xl font-extrabold font-headline text-on-surface">
                Reviews &amp; Ratings
              </h2>
              <p className="text-on-surface-variant max-w-3xl leading-relaxed">
                Social proof sits best after the itinerary and booking panel, so
                this section adapts the standalone reviews page into the tour
                detail flow without changing the rest of the screen.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-4 bg-surface-container-lowest rounded-2xl p-8 shadow-sm">
                <div className="text-center mb-8">
                  <div className="text-6xl font-headline font-black text-on-surface mb-2">
                    {tour?.rating}
                  </div>
                  <div className="flex justify-center gap-1 mb-2">
                    {Array.from({ length: 5 }).map((_, idx) => (
                      <span
                        key={idx}
                        className="material-symbols-outlined text-tertiary text-2xl"
                        style={{ fontVariationSettings: '"FILL" 1' }}
                      >
                        star
                      </span>
                    ))}
                  </div>
                  <p className="text-on-surface-variant font-medium">
                    {tour?.reviews} authentic reviews
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="w-12">5 stars</span>
                    <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full w-[85%]" />
                    </div>
                    <span className="w-8 text-right">85%</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="w-12">4 stars</span>
                    <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full w-[10%] opacity-60" />
                    </div>
                    <span className="w-8 text-right">10%</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="w-12">3 stars</span>
                    <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full w-[3%] opacity-40" />
                    </div>
                    <span className="w-8 text-right">3%</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="w-12">2 stars</span>
                    <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full w-[1%] opacity-20" />
                    </div>
                    <span className="w-8 text-right">1%</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs font-medium">
                    <span className="w-12">1 star</span>
                    <div className="flex-1 h-2 bg-surface-container rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full w-[1%] opacity-10" />
                    </div>
                    <span className="w-8 text-right">1%</span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  {["Smooth logistics", "Excellent guide", "Great pacing"].map(
                    (t) => (
                      <span
                        key={t}
                        className="px-3 py-1 bg-tertiary-container/10 text-on-tertiary-fixed-variant rounded-full text-xs font-bold"
                      >
                        {t}
                      </span>
                    ),
                  )}
                </div>
              </div>

              <div className="lg:col-span-8 bg-surface-container-low rounded-2xl p-8 relative overflow-hidden">
                <div className="flex justify-between items-center mb-6 gap-4">
                  <h3 className="text-xl font-headline font-bold text-on-surface">
                    Traveler Memories
                  </h3>
                  <button className="text-primary text-sm font-bold flex items-center gap-1 hover:underline transition-all">
                    View all 450 photos
                    <span className="material-symbols-outlined text-sm">
                      arrow_forward
                    </span>
                  </button>
                </div>

                <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
                  {MEMORY_CARDS.map((m) => (
                    <div
                      key={m.alt}
                      className="min-w-[240px] h-[320px] rounded-2xl overflow-hidden relative group"
                    >
                      <img
                        alt={m.alt}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                        src={m.img}
                      />
                      <div className="absolute bottom-4 left-4 text-white">
                        <p className="text-xs font-medium opacity-80">{m.by}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-12 flex justify-center items-center gap-4">
                  <button
                    className="p-2 border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-colors disabled:opacity-30"
                    disabled
                    type="button"
                  >
                    <span className="material-symbols-outlined">
                      chevron_left
                    </span>
                  </button>
                  <div className="flex items-center gap-2">
                    {[1, 2, 3].map((p, idx) => (
                      <button
                        key={p}
                        className={`w-10 h-10 rounded-xl ${
                          idx === 0
                            ? "bg-primary text-on-primary font-bold text-sm"
                            : "hover:bg-surface-container font-semibold text-sm"
                        }`}
                        type="button"
                      >
                        {p}
                      </button>
                    ))}
                    <span className="px-2 text-on-surface-variant">...</span>
                    <button
                      className="w-10 h-10 rounded-xl hover:bg-surface-container font-semibold text-sm"
                      type="button"
                    >
                      42
                    </button>
                  </div>
                  <button
                    className="p-2 border border-outline-variant/20 rounded-xl hover:bg-surface-container transition-colors"
                    type="button"
                  >
                    <span className="material-symbols-outlined">
                      chevron_right
                    </span>
                  </button>
                </div>

                <div className="space-y-6 mt-8">
                  {REVIEW_ARTICLES.map((r) => (
                    <article
                      key={r.name}
                      className="bg-surface-container-lowest rounded-2xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
                    >
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className="md:w-48 shrink-0">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="h-12 w-12 rounded-full overflow-hidden bg-slate-200">
                              <img
                                alt={r.name}
                                className="w-full h-full object-cover"
                                src={r.avatarImg}
                              />
                            </div>
                            <div>
                              <h4 className="font-bold text-on-surface text-sm">
                                {r.name}
                              </h4>
                              <div className="flex items-center gap-1 text-[10px] text-teal-600 font-bold uppercase tracking-wider">
                                <span
                                  className="material-symbols-outlined text-xs"
                                  style={{ fontVariationSettings: '"FILL" 1' }}
                                >
                                  verified
                                </span>
                                Verified
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-on-surface-variant mb-1">
                            {r.meta}
                          </p>
                          <p className="text-xs text-on-surface-variant">{r.type}</p>
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, idx) => (
                                <span
                                  key={idx}
                                  className="material-symbols-outlined text-tertiary text-sm"
                                  style={{
                                    fontVariationSettings:
                                      idx < r.starsFill
                                        ? '"FILL" 1'
                                        : '"FILL" 0',
                                  }}
                                >
                                  star
                                </span>
                              ))}
                            </div>
                            <time className="text-xs text-on-surface-variant">
                              {r.timeAgo}
                            </time>
                          </div>

                          <h3 className="text-lg font-headline font-bold text-on-surface mb-3">
                            {r.title}
                          </h3>
                          <p className="text-on-surface-variant leading-relaxed mb-6">
                            {r.body}
                          </p>

                          <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                            <div className="flex items-center gap-6">
                              <button className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg">
                                  thumb_up
                                </span>
                                Helpful ({r.helpful})
                              </button>
                              <button className="flex items-center gap-2 text-xs font-bold text-on-surface-variant hover:text-primary transition-colors">
                                <span className="material-symbols-outlined text-lg">
                                  share
                                </span>
                                Share
                              </button>
                            </div>
                            <button className="text-xs font-bold text-on-surface-variant hover:text-error transition-colors flex items-center gap-1">
                              <span className="material-symbols-outlined text-lg">
                                flag
                              </span>
                              Report
                            </button>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

