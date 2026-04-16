import { useEffect, useState } from "react";
import {
  CheckCircle2,
  ChevronRight,
  Copy,
  Info,
  Leaf,
  LocateFixed,
  MapPinned,
  MessageCircle,
  RefreshCcw,
  ShieldCheck,
  Users,
  UserRound,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

const itineraryHighlights = [
  {
    title: "Private Sunset Cruise",
    time: "Day 1 • 18:00 PM",
    complete: true,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAFh3tgNtojKN3KV0ilWZk2rIobYX6kIELbau1C-uCVw-c4fevQpyh-Z6uSLU6wu0JbaPA6a-9eHi8qekfsGCNBoRoNZWGjxCOvsTZGYdFS-DWhikNq0z8Ayea5n2oqztXiR54FedHoyMoTlkFr7a6rtwBcZY3B6TbqivnN2Eqq2vdFPRdWqKDaGVBxXPbKMDLj2ymnKznsKcJmR2VBPsoTYEGcSoIkl9S1zMmEMcQhxg2M65-GYUclFaxx17TJGF7gpelGfTmPCVx7",
  },
  {
    title: "Oia Heritage Walk",
    time: "Day 2 • 09:00 AM",
    complete: false,
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAgS2I6Cgm-8k4IOx6sQWs2gsXkCnUdr5av8OWwlYDgNi0O5PvDUuvD_fHpM1ySP7uiRerl5u3_6WmWwTTTwBuNEm_Xk8RjebnMRPu6aLKYNk8Gxgqgh1y9lqceY5VJn5bVujjJhtJ0m7zIjxnqDYe9N1RVRv_fj4Q_m_Ty98ro2hL1OKrzcqD7JWniRicYn0j4KnqrYlTp0xsZetTjjYTqyQfKNnYGZreJNMVZKI4IE7hqCKbx4qZ4HszphEM37-61Sf7E1vKsjgfZ",
  },
];

const makeTrackingLink = () =>
  `voyager.ai/track/azh-99281-${Math.random().toString(36).slice(2, 6)}`;

export default function TrackingLinkManagement() {
  const [trackingLink, setTrackingLink] = useState("voyager.ai/track/azh-99281-x9f2");
  const [copied, setCopied] = useState(false);
  const [requireVerification, setRequireVerification] = useState(true);

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document.querySelector('meta[name="description"]')?.getAttribute("content") ?? "";

    document.title = "Tracking Link Management | Voyager AI";

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      "Manage your Voyager AI live tracking link, booking overview, itinerary highlights, guide details, and privacy settings for shared tour visibility.",
    );

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, []);

  const handleCopy = async () => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(`https://${trackingLink}`);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1800);
      }
    } catch {
      setCopied(false);
    }
  };

  const handleRegenerate = () => {
    setTrackingLink(makeTrackingLink());
    setCopied(false);
  };

  return (
    <main className="mx-auto max-w-7xl space-y-10 text-on-surface">
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

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section className="space-y-8 lg:col-span-7">
          <Card className="relative overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
            <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-primary/5" />
            <CardContent className="p-6 md:p-8">
              <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <Badge className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-on-primary-fixed-variant">
                    Confirmed
                  </Badge>
                  <h2 className="mt-4 font-headline text-2xl font-bold">
                    Booking Overview
                  </h2>
                </div>

                <div className="text-left sm:text-right">
                  <p className="text-sm text-on-surface-variant">Total Amount</p>
                  <p className="font-headline text-3xl font-bold text-primary">
                    $4,250.00
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                    Lead Traveler
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                      <UserRound className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold">Alexander Wright</p>
                      <p className="text-sm text-on-surface-variant">
                        alex.w@example.com
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                    Group Size
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                      <Users className="size-4" />
                    </div>
                    <div>
                      <p className="font-semibold">4 Adults</p>
                      <p className="text-sm text-on-surface-variant">
                        Private Suite Tier
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="my-8 bg-outline-variant/20" />

              <div>
                <h3 className="mb-4 font-headline text-lg font-bold">
                  Itinerary Highlights
                </h3>
                <div className="space-y-4">
                  {itineraryHighlights.map((item) => (
                    <article
                      key={item.title}
                      className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-surface-container-low"
                    >
                      <img
                        src={item.image}
                        alt={item.title}
                        className="h-12 w-12 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-on-surface">{item.title}</p>
                        <p className="text-sm text-on-surface-variant">{item.time}</p>
                      </div>
                      {item.complete ? (
                        <CheckCircle2 className="size-5 text-primary" />
                      ) : (
                        <div className="h-4 w-4 rounded-full border border-outline-variant" />
                      )}
                    </article>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-low py-0">
              <CardContent className="relative h-72 p-0">
                <img
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDwmkRrtLnRzhPIk_SXpFhXc9_BrPXl1frzsLIPp1gZZqJ9EEVswVJHLbpzFIofr8wrEhDuMgbk_dFN_4sYD32_L8-9eoPB5ru_4PTC4QW-NLYy41Fm9n7AnoC6I2ZKxoNn_Umn6ZHu_XTDlP6eWXbYtcINJJkbaQ4czmJcryaR8UTPc8h1oQXKTVLXU3KEyUaCkUFqfNpmrxrFY13s5ebgkcnj3bVcAckJ7XKBSHXROILxVM-ZfUIbJU_MximSZZ9_byHbtiib2XfT"
                  alt="Santorini route map"
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
        </section>

        <aside className="space-y-8 lg:col-span-5">
          <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
            <CardHeader className="px-6 pt-6 md:px-8">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-container/10 text-tertiary">
                  <LocateFixed className="size-5" />
                </div>
                <div>
                  <CardTitle className="font-headline text-xl font-bold">
                    Shared Tracking Access
                  </CardTitle>
                  <p className="text-sm text-on-surface-variant">
                    Allow others to follow your journey live
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6 md:px-8">
              <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
                <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                  Public Tracking Link
                </p>
                <div className="flex items-center gap-2">
                  <code className="min-w-0 flex-1 truncate font-mono text-sm font-bold text-primary">
                    {trackingLink}
                  </code>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={handleCopy}
                    className="rounded-xl text-on-surface-variant hover:bg-white"
                    title="Copy link"
                  >
                    <Copy className="size-4" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  type="button"
                  onClick={handleCopy}
                  className="h-12 flex-1 rounded-2xl bg-gradient-to-br from-primary to-primary-container font-bold text-on-primary shadow-lg shadow-primary/20"
                >
                  {copied ? "Copied" : "Copy link"}
                </Button>
                <Button
                  type="button"
                  onClick={handleRegenerate}
                  variant="secondary"
                  className="h-12 rounded-2xl bg-secondary-container px-5 font-bold text-on-secondary-container"
                >
                  <RefreshCcw className="size-4" />
                  Regenerate
                </Button>
              </div>
            </CardContent>

            <div className="bg-surface-container-low/50 px-6 py-6 md:px-8">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 text-on-surface-variant" />
                  <div>
                    <p className="font-bold">Require phone verification</p>
                    <p className="text-xs leading-relaxed text-on-surface-variant">
                      Viewers must verify via SMS to access live tracking data.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  aria-pressed={requireVerification}
                  onClick={() => setRequireVerification((current) => !current)}
                  className={cn(
                    "relative h-7 w-13 shrink-0 rounded-full transition-colors",
                    requireVerification ? "bg-primary" : "bg-surface-container-highest",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-1 left-1 h-5 w-5 rounded-full bg-white transition-transform",
                      requireVerification && "translate-x-6",
                    )}
                  />
                </button>
              </div>
            </div>
          </Card>

          <Card className="rounded-[2rem] border-none bg-tertiary-container/10 py-0">
            <CardContent className="p-6">
              <div className="flex gap-4">
                <Info className="mt-0.5 size-5 shrink-0 text-tertiary" />
                <div>
                  <p className="font-bold text-on-tertiary-fixed-variant">
                    Privacy Note
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-on-tertiary-fixed-variant/80">
                    Sharing your live tracking link allows anyone with the URL to
                    see your current location and itinerary. Share it only with
                    trusted family members and friends.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

         
        </aside>
      </div>
    </main>
  );
}
