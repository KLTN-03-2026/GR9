import { useEffect } from "react";
import {
  AlertTriangle,
  ArrowRight,
  CalendarDays,
  ClipboardCheck,
  Clock3,
  FileWarning,
  Footprints,
  Globe2,
  MapPin,
  MoreHorizontal,
  PlayCircle,
  Users,
  UtensilsCrossed,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/shared/page-hero";

const summaryCards = [
  {
    label: "Assigned Today",
    value: "02",
    icon: ClipboardCheck,
    iconClass: "text-primary",
    iconBg: "bg-primary/10",
  },
  {
    label: "Upcoming Tours",
    value: "14",
    icon: CalendarDays,
    iconClass: "text-secondary",
    iconBg: "bg-secondary/10",
  },
  {
    label: "Ongoing Tours",
    value: "01",
    icon: Footprints,
    iconClass: "text-primary-container",
    iconBg: "bg-primary-container/10",
    valueClass: "text-primary",
  },
  {
    label: "Pending Reports",
    value: "03",
    icon: AlertTriangle,
    iconClass: "text-tertiary",
    iconBg: "bg-tertiary/10",
    valueClass: "text-tertiary",
    extraClass: "border-l-4 border-tertiary",
  },
];

const quickActions = [
  {
    title: "View Assigned Tours",
    icon: Globe2,
    hoverText: "group-hover:text-primary",
    hoverIcon: "group-hover:bg-primary group-hover:text-on-primary",
  },
  {
    title: "Start Ongoing Tour",
    icon: PlayCircle,
    hoverText: "group-hover:text-primary",
    hoverIcon: "group-hover:bg-primary group-hover:text-on-primary",
  },
  {
    title: "Submit Incident Report",
    icon: FileWarning,
    hoverText: "group-hover:text-on-surface",
    hoverIcon: "group-hover:bg-error group-hover:text-on-error",
    extraClass: "border border-dashed border-outline-variant/50",
  },
];

const assignedTours = [
  {
    id: "#VGR-88291",
    title: "Imperial Heritage Walk",
    location: "Agra, India",
    shift: "Morning Departure",
    shiftClass: "bg-tertiary-container/10 text-tertiary",
    status: "CONFIRMED",
    statusClass: "bg-primary-fixed-dim/20 text-on-primary-fixed-variant",
    dotClass: "bg-primary-container",
    time: "08:00 AM - 12:00 PM",
    passengers: "12 Adults, 2 Kids",
    detailLabel: "Language",
    detailValue: "English & Hindi",
    primaryAction: "Start Manifest Check",
    primaryVariant: "default",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBuYXQ7VscEn13MSHD2eAetw1Ldn755zK2Coe8SPq3oeMonKp1NQKC6qdDCT23tfsLKrqQJYxJ-xF7wEgUrmc97b7qbOqsMGtQ_h9dPwmkJ8nNdQKcxuvwMkQsc6nUBxDVBiomDYDQ09blyfOejw3t0atY_Bw31IMtIUsT31TkGW44ssw6FRA-RpmHbSwniYVN3brxwnIc7YRT97nIg9hpRBDv1vdtMI46nEJ6n_rODByA9epUYl8mNaiWNf-OtjCcoS6gRH7zP9pHs",
  },
  {
    id: "#VGR-99023",
    title: "Twilight Gastronomy Tour",
    location: "Old Town District",
    shift: "Evening Experience",
    shiftClass: "bg-secondary-container text-on-secondary-container",
    status: "PENDING START",
    statusClass: "bg-surface-container-highest text-on-surface-variant",
    dotClass: "bg-slate-400",
    time: "06:30 PM - 09:30 PM",
    passengers: "6 Adults",
    detailLabel: "Dietary",
    detailValue: "2 Vegan, 1 Nut-Free",
    primaryAction: "Review Special Requests",
    primaryVariant: "outline",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBQMHDpwY9TahVhfFRDS1JjFq5rHgKXuJOtGXrVWjgyVI91pFTyRts2oLdxIQgvm1FEWk-v5ZG7FQqtK0_28m46rt81zBcWDYi95y3AJsKni98oo0_wpOiYd1aZ71v68xrcOu2GvTEMxxOZExPeBWKyvb_sKNsE4AXq9gT5PfmavoGoRw7wsF3cRB5M8yNC2jT2pXeXOBkc25I3kMG7Z7f2T_knEUJLQmo1eLw-S_WcEm02VMlPIC8WDIKYBn7UrDd2F1ggdAGzHZSh",
  },
];

export default function GuideDashboardHome() {
  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") ?? "";

    document.title = "Guide Dashboard | Voyager AI";

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      "Guide dashboard for Voyager AI with assigned tours, shift actions, live tour operations, schedule insights, and incident reporting overview.",
    );

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, []);

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-10 pb-12 pt-24 text-on-surface">
      <PageHero
        eyebrow="Shift Overview"
        heading={
          <>
            Welcome back,{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              Marcus
            </span>
          </>
        }
        description="Track today's assignments, launch active tours, and keep field operations moving with a cleaner guide command surface."
        meta={
          <p className="flex items-center gap-2 text-on-surface-variant">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary-container" />
            2 Tours Assigned Today
          </p>
        }
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              className="h-11 rounded-2xl bg-secondary-container px-5 text-sm font-semibold text-on-secondary-container"
            >
              Schedule View
            </Button>
            <Button className="h-11 rounded-2xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-md shadow-primary/10 hover:bg-emerald-500">
              Start Shift
            </Button>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <Card
              key={card.label}
              className={`h-32 rounded-[1.5rem] border-none bg-surface-container-lowest py-0 shadow-sm ring-1 ring-outline-variant/10 ${card.extraClass || ""}`}
            >
              <CardContent className="flex h-full flex-col justify-between p-6">
                <span className="text-xs font-bold uppercase tracking-[0.24em] text-on-surface-variant">
                  {card.label}
                </span>
                <div className="flex items-end justify-between">
                  <span
                    className={`text-3xl font-extrabold ${card.valueClass || "text-on-surface"}`}
                  >
                    {card.value}
                  </span>
                  <div className={`rounded-xl p-2 ${card.iconBg}`}>
                    <Icon className={`size-5 ${card.iconClass}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="space-y-6">
        <h2 className="text-lg font-bold text-on-surface">Quick Operations</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                type="button"
                className={`group flex items-center gap-4 rounded-[1.5rem] bg-surface-container-low p-5 text-left transition-all hover:bg-primary-fixed ${action.extraClass || ""}`}
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-full bg-surface-container-lowest transition-colors ${action.hoverIcon}`}
                >
                  <Icon className="size-5" />
                </div>
                <span
                  className={`font-semibold text-on-surface-variant transition-colors ${action.hoverText}`}
                >
                  {action.title}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-headline text-2xl font-extrabold text-on-surface">
            Today&apos;s Assigned Tours
          </h2>
          <Button
            variant="link"
            className="h-auto px-0 font-semibold text-primary"
          >
            View Full Calendar
          </Button>
        </div>

        <div className="space-y-6">
          {assignedTours.map((tour) => (
            <Card
              key={tour.id}
              className="group overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 ring-1 ring-outline-variant/10 transition-all hover:ring-primary/30"
            >
              <div className="flex flex-col md:flex-row">
                <div className="h-52 w-full overflow-hidden md:h-auto md:w-72">
                  <img
                    src={tour.image}
                    alt={tour.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>

                <CardContent className="flex flex-1 flex-col justify-between p-6">
                  <div>
                    <div className="mb-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <Badge
                          className={`mb-2 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em] ${tour.shiftClass}`}
                        >
                          {tour.shift}
                        </Badge>
                        <h3 className="text-xl font-bold text-on-surface">
                          {tour.title}
                        </h3>
                        <div className="mt-1 flex flex-wrap items-center gap-4 text-sm text-on-surface-variant">
                          <span className="flex items-center gap-1">
                            <MapPin className="size-4" />
                            {tour.location}
                          </span>
                          <span className="font-mono font-semibold">
                            {tour.id}
                          </span>
                        </div>
                      </div>

                      <div className="text-left md:text-right">
                        <span
                          className={`inline-flex items-center gap-2 rounded-xl px-3 py-1.5 text-xs font-bold ${tour.statusClass}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${tour.dotClass}`}
                          />
                          {tour.status}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 border-t border-outline-variant/10 py-4">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                          Time
                        </span>
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <Clock3 className="size-4 text-on-surface-variant" />
                          {tour.time}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                          Passengers
                        </span>
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <Users className="size-4 text-on-surface-variant" />
                          {tour.passengers}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                          {tour.detailLabel}
                        </span>
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <UtensilsCrossed className="size-4 text-on-surface-variant" />
                          {tour.detailValue}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      variant={tour.primaryVariant}
                      className={
                        tour.primaryVariant === "outline"
                          ? "h-11 flex-1 rounded-xl border-2 border-primary font-bold text-primary hover:bg-primary/5"
                          : "h-11 flex-1 rounded-xl bg-primary font-bold text-on-primary"
                      }
                    >
                      {tour.primaryAction}
                    </Button>
                    <Button
                      variant="secondary"
                      size="icon"
                      className="h-11 w-11 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-surface-variant"
                    >
                      <MoreHorizontal className="size-5" />
                    </Button>
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </main>
  );
}
