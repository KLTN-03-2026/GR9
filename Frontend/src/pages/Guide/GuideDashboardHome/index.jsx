import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import {
  AlertTriangle,
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
import { getGuideAssignedTours, getGuideDashboard } from "@/services/api/guide";
import { useI18n } from "@/i18n/I18nProvider";

export default function GuideDashboardHome() {
  const navigate = useNavigate();
  const { t } = useI18n();
  const [stats, setStats] = useState(null);
  const [assignedTours, setAssignedTours] = useState([]);

  useEffect(() => {
    const previousTitle = document.title;
    const previousDescription =
      document
        .querySelector('meta[name="description"]')
        ?.getAttribute("content") ?? "";

    document.title = `${t("guidePages.dashboard.title")} | SmartTravel`;

    let descriptionTag = document.querySelector('meta[name="description"]');
    if (!descriptionTag) {
      descriptionTag = document.createElement("meta");
      descriptionTag.setAttribute("name", "description");
      document.head.appendChild(descriptionTag);
    }

    descriptionTag.setAttribute(
      "content",
      t("guidePages.dashboard.metaDescription"),
    );

    Promise.all([getGuideDashboard(), getGuideAssignedTours()])
      .then(([dashboardResponse, toursResponse]) => {
        setStats(dashboardResponse.data.data?.guideStats || null);
        setAssignedTours(toursResponse.data.data || []);
      })
      .catch((error) =>
        toast.error(error?.response?.data?.message || t("guidePages.dashboard.loadError")),
      );

    return () => {
      document.title = previousTitle;
      if (descriptionTag) {
        descriptionTag.setAttribute("content", previousDescription);
      }
    };
  }, []);

  const summaryCards = useMemo(() => {
    const upcomingTours = assignedTours.filter((tour) => tour.status === "scheduled").length;
    const ongoingTours = assignedTours.filter((tour) => tour.status === "ongoing").length;

    return [
      {
        label: t("guidePages.dashboard.assignedToday"),
        value: String(ongoingTours || 0).padStart(2, "0"),
        icon: ClipboardCheck,
        iconClass: "text-primary",
        iconBg: "bg-primary/10",
      },
      {
        label: t("guidePages.dashboard.upcomingTours"),
        value: String(upcomingTours || 0).padStart(2, "0"),
        icon: CalendarDays,
        iconClass: "text-secondary",
        iconBg: "bg-secondary/10",
      },
      {
        label: t("guidePages.dashboard.ongoingTours"),
        value: String(ongoingTours || 0).padStart(2, "0"),
        icon: Footprints,
        iconClass: "text-primary-container",
        iconBg: "bg-primary-container/10",
        valueClass: "text-primary",
      },
      {
        label: t("guidePages.dashboard.pendingReports"),
        value: "00",
        icon: AlertTriangle,
        iconClass: "text-tertiary",
        iconBg: "bg-tertiary/10",
        valueClass: "text-tertiary",
        extraClass: "border-l-4 border-tertiary",
      },
    ];
  }, [assignedTours]);

  const quickActions = [
    {
      title: t("guidePages.dashboard.viewAssignedTours"),
      icon: Globe2,
      hoverText: "group-hover:text-primary",
      hoverIcon: "group-hover:bg-primary group-hover:text-on-primary",
      onClick: () => navigate("/guide/assigned-tours"),
    },
    {
      title: t("guidePages.dashboard.startOngoingTour"),
      icon: PlayCircle,
      hoverText: "group-hover:text-primary",
      hoverIcon: "group-hover:bg-primary group-hover:text-on-primary",
      onClick: () => navigate("/guide/live-tour-tracking"),
    },
    {
      title: t("guidePages.dashboard.submitIncidentReport"),
      icon: FileWarning,
      hoverText: "group-hover:text-on-surface",
      hoverIcon: "group-hover:bg-error group-hover:text-on-error",
      extraClass: "border border-dashed border-outline-variant/50",
      onClick: () => toast("Tính năng báo cáo sự cố sẽ được nối tiếp theo."),
    },
  ];

  const dashboardTours = useMemo(
    () =>
      assignedTours.slice(0, 2).map((tour, index) => ({
        id: tour.code || tour.id,
        title: tour.title,
        location: tour.locationShortLabel || "Unknown location",
        shift: index === 0 ? t("guidePages.dashboard.morningDeparture") : t("guidePages.dashboard.eveningExperience"),
        shiftClass:
          index === 0
            ? "bg-tertiary-container/10 text-tertiary"
            : "bg-secondary-container text-on-secondary-container",
        status: tour.status === "ongoing" ? t("guidePages.dashboard.confirmed") : t("guidePages.dashboard.pendingStart"),
        statusClass:
          tour.status === "ongoing"
            ? "bg-primary-fixed-dim/20 text-on-primary-fixed-variant"
            : "bg-surface-container-highest text-on-surface-variant",
        dotClass: tour.status === "ongoing" ? "bg-primary-container" : "bg-slate-400",
        time: tour.dateRangeLabel || t("guidePages.dashboard.noSchedule"),
        passengers: `${tour.passengerCount || 0} ${t("guidePages.dashboard.guests")}`,
        detailLabel: t("guidePages.dashboard.language"),
        detailValue: (stats?.languages || []).join(", ") || "VI",
        primaryAction: tour.status === "ongoing" ? t("guidePages.dashboard.openLiveTracking") : t("guidePages.dashboard.reviewTour"),
        primaryVariant: tour.status === "ongoing" ? "default" : "outline",
        image:
          tour.cardImage ||
          "https://lh3.googleusercontent.com/aida-public/AB6AXuBuYXQ7VscEn13MSHD2eAetw1Ldn755zK2Coe8SPq3oeMonKp1NQKC6qdDCT23tfsLKrqQJYxJ-xF7wEgUrmc97b7qbOqsMGtQ_h9dPwmkJ8nNdQKcxuvwMkQsc6nUBxDVBiomDYDQ09blyfOejw3t0atY_Bw31IMtIUsT31TkGW44ssw6FRA-RpmHbSwniYVN3brxwnIc7YRT97nIg9hpRBDv1vdtMI46nEJ6n_rODByA9epUYl8mNaiWNf-OtjCcoS6gRH7zP9pHs",
        bookingId: tour.bookingId,
      })),
    [assignedTours, stats],
  );

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-8 pb-10 pt-6 text-on-surface md:space-y-10 md:pt-24">
      <PageHero
        eyebrow={t("guidePages.dashboard.heroEyebrow")}
        heading={
          <>
            {t("guidePages.dashboard.welcomeBack")}{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              {t("guidePages.dashboard.guide")}
            </span>
          </>
        }
        description={t("guidePages.dashboard.description")}
        meta={
          <p className="flex items-center gap-2 text-on-surface-variant">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-primary-container" />
            {assignedTours.length} {t("guidePages.dashboard.toursAssigned")}
          </p>
        }
        actions={
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              variant="secondary"
              className="h-11 rounded-2xl bg-secondary-container px-5 text-sm font-semibold text-on-secondary-container"
              asChild
            >
              <Link to="/guide/assigned-tours">{t("guidePages.dashboard.scheduleView")}</Link>
            </Button>
            <Button
              className="h-11 rounded-2xl bg-primary px-5 text-sm font-semibold text-on-primary shadow-md shadow-primary/10 hover:bg-emerald-500"
              asChild
            >
              <Link to="/guide/live-tour-tracking">{t("guidePages.dashboard.startShift")}</Link>
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
        <h2 className="text-lg font-bold text-on-surface">{t("guidePages.dashboard.quickOperations")}</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {quickActions.map((action) => {
            const Icon = action.icon;

            return (
              <button
                key={action.title}
                type="button"
                onClick={action.onClick}
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
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="font-headline text-2xl font-extrabold text-on-surface">
            {t("guidePages.dashboard.todaysAssignedTours")}
          </h2>
          <Button
            variant="link"
            className="h-auto px-0 font-semibold text-primary"
            asChild
          >
            <Link to="/guide/assigned-tours">{t("guidePages.dashboard.viewFullCalendar")}</Link>
          </Button>
        </div>

        <div className="space-y-6">
          {dashboardTours.map((tour) => (
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

                    <div className="grid grid-cols-1 gap-4 border-t border-outline-variant/10 py-4 sm:grid-cols-3 sm:gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                          {t("guidePages.dashboard.time")}
                        </span>
                        <span className="flex items-center gap-2 text-sm font-semibold">
                          <Clock3 className="size-4 text-on-surface-variant" />
                          {tour.time}
                        </span>
                      </div>

                      <div className="flex flex-col">
                        <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                          {t("guidePages.dashboard.passengers")}
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
                      asChild
                    >
                      <Link to={`/guide/live-tour-tracking?bookingId=${tour.bookingId}`}>
                        {tour.primaryAction}
                      </Link>
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
