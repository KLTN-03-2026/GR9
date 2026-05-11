import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import PageHero from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { getTravelerDashboard } from "@/services/api/traveler";
import { formatCurrencyVND } from "@/utils/formatPrice";
import { useI18n } from "@/i18n/I18nProvider";

const FALLBACK_UPCOMING = [
  {
    id: "fallback-dn",
    location: "Da Nang, Vietnam",
    status: "ongoing",
    startDay: "2026-03-29",
    endDay: "2026-03-31",
    image:
      "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: "fallback-st",
    location: "Santorini, Greece",
    status: "upcoming",
    startDay: "2026-06-12",
    endDay: "2026-06-18",
    image:
      "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&w=900&q=80",
  },
];

const TRAVELER_DASHBOARD_IMAGES = [
  "https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
];

const getTripImage = (trip, index = 0) =>
  trip?.image ||
  trip?.coverImage ||
  trip?.tour?.image ||
  trip?.tour?.coverImage ||
  trip?.tourId?.image ||
  trip?.tourId?.coverImage ||
  TRAVELER_DASHBOARD_IMAGES[index % TRAVELER_DASHBOARD_IMAGES.length];

const FALLBACK_RECOMMENDED = [
  {
    id: "da-nang-coastal",
    title: "Da Nang, Vietnam",
    description:
      "A premium Da Nang itinerary blending airport support, landmark visits, local food and passenger tracking.",
    price: formatCurrencyVND(289000),
    type: "Coastal",
    icon: "temple_buddhist",
  },
  {
    id: "hoi-an-lantern",
    title: "Hoi An, Vietnam",
    description:
      "Private pickup, old town storytelling and a premium lantern workshop in Hoi An.",
    price: formatCurrencyVND(148000),
    type: "Lanterns",
    icon: "temple_buddhist",
  },
  {
    id: "ha-long-cruise",
    title: "Ha Long Bay, Vietnam",
    description:
      "Luxury cruise through Ha Long Bay with curated caves, lagoons and cultural immersion.",
    price: formatCurrencyVND(1249000),
    type: "Cruise",
    icon: "directions_boat",
  },
];

const formatDateRange = (startDay, endDay, language, noDateLabel) => {
  const start = startDay ? new Date(startDay) : null;
  const end = endDay ? new Date(endDay) : null;
  if (!start || Number.isNaN(start.getTime())) return noDateLabel;

  const locale = language === "vi" ? "vi-VN" : "en-US";
  const startLabel = start.toLocaleDateString(locale, {
    month: "short",
    day: "2-digit",
  });

  if (!end || Number.isNaN(end.getTime())) {
    return startLabel;
  }

  const endLabel = end.toLocaleDateString(locale, {
    month: "short",
    day: "2-digit",
  });

  return `${startLabel} - ${endLabel}`;
};

const TravelerDashboard = () => {
  const { language, t } = useI18n();
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    getTravelerDashboard()
      .then((response) => setDashboard(response.data.data || null))
      .catch((error) =>
        toast.error(error?.response?.data?.message || t("travelerDashboard.cannotLoad")),
      );
  }, [t]);

  const upcomingTrips = useMemo(() => {
    const realTrips = [
      ...(dashboard?.ongoingTrips || []),
      ...(dashboard?.upcomingTrips || []),
    ].slice(0, 2);

    if (!realTrips.length) {
      return FALLBACK_UPCOMING;
    }

    return realTrips;
  }, [dashboard]);

  const recommendedTours = useMemo(() => {
    const realTours = (dashboard?.recommendedTours || []).slice(0, 3);

    if (!realTours.length) {
      return FALLBACK_RECOMMENDED;
    }

    return realTours.map((tour) => ({
      id: tour.id,
      title: tour.title,
      description: tour.description,
      price: tour.price,
      type: tour.type,
      icon: tour.type === "Cruise" ? "directions_boat" : "temple_buddhist",
    }));
  }, [dashboard]);

  const citiesVisited = dashboard?.profileStats?.citiesVisited ?? 24;
  const rewardPoints = dashboard?.profileStats?.rewardPoints ?? 8400;
  const spendingBudget = Math.max(80, Math.ceil(rewardPoints / 1000) * 10);
  const spendingUsed = Math.min(
    spendingBudget,
    Math.max(0, Math.round(rewardPoints / 150)),
  );
  const spendingPercent = spendingBudget
    ? Math.min(100, Math.round((spendingUsed / spendingBudget) * 100))
    : 0;

  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface font-body text-on-surface">
      <div className="mx-auto w-full max-w-[1600px] px-6 pb-12 pt-24 md:px-10">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            <PageHero
              eyebrow={t("travelerDashboard.heroEyebrow")}
              heading={
                <>
                  {t("travelerDashboard.heroTitleA")}{" "}
                  <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
                    {t("travelerDashboard.heroTitleB")}
                  </span>
                </>
              }
              description={t("travelerDashboard.heroDescription")}
              actions={
                <Button
                  asChild
                  className="rounded-full bg-primary px-8 py-6 text-sm font-bold text-primary-foreground shadow-xl shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-container hover:text-on-primary-container"
                >
                  <Link to="/traveler/ai-travel-planner">
                    <span
                      className="material-symbols-outlined mr-2 text-lg"
                      style={{ fontVariationSettings: '"FILL" 1' }}
                    >
                      auto_awesome
                    </span>
                    {t("travelerDashboard.generatePlan")}
                  </Link>
                </Button>
              }
              rightSlot={
                <div className="group relative h-[240px] w-full overflow-hidden rounded-[1.75rem] bg-slate-900 shadow-[0_20px_50px_rgba(25,28,30,0.18)] ring-4 ring-surface-container-lowest/70 md:w-[320px]">
                  <img
                    alt="Paradise beach"
                    className="absolute inset-0 h-full w-full object-cover opacity-80 transition-transform duration-700 group-hover:scale-110"
                    src="https://images.unsplash.com/photo-1540202404-a2f29016b523?auto=format&fit=crop&w=900&q=80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/75 via-slate-900/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/70">
                      {t("travelerDashboard.conciergeTitle")}
                    </p>
                    <p className="mt-2 text-2xl font-extrabold leading-tight">
                      {t("travelerDashboard.conciergeText")}
                    </p>
                  </div>
                </div>
              }
            />

            <section>
              <div className="mb-6 flex items-center justify-between">
                <h2 className="font-headline text-2xl font-bold text-on-surface">
                  {t("travelerDashboard.upcomingTrips")}
                </h2>
                <Button
                  asChild
                  variant="link"
                  className="h-auto px-0 text-sm font-semibold text-primary hover:underline"
                >
                  <Link to="/traveler/traveler-tracking-link-management">
                    {t("travelerDashboard.viewAll")}
                  </Link>
                </Button>
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {upcomingTrips.map((trip, index) => (
                  <Link
                    key={trip.id}
                    to="/traveler/traveler-tracking-link-management"
                    className="group rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-4 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10"
                  >
                    <div className="relative mb-4 h-48 overflow-hidden rounded-2xl">
                      <img
                        alt={trip.location}
                        className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                        src={getTripImage(trip, index)}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 via-transparent to-transparent" />
                      <div className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-teal-700 backdrop-blur-md">
                        {trip.status === "ongoing" ? t("travelerDashboard.ongoing") : t("travelerDashboard.upcoming")}
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 flex items-start justify-between">
                        <h3 className="font-headline text-lg font-bold">
                          {trip.location}
                        </h3>
                        <span className="material-symbols-outlined text-slate-400">
                          more_horiz
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-on-surface-variant">
                        <div className="flex items-center space-x-1">
                          <span className="material-symbols-outlined text-[16px]">
                            calendar_today
                          </span>
                          <span>{formatDateRange(trip.startDay, trip.endDay, language, t("travelerDashboard.noDate"))}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="font-headline text-2xl font-bold text-on-surface">
                    {t("travelerDashboard.recommended")}
                  </h2>
                  <p className="text-sm text-on-surface-variant">
                    {t("travelerDashboard.recommendedNote")}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
                {recommendedTours.map((tour) => (
                  <Link
                    key={tour.id}
                    to={
                      tour.id?.startsWith?.("fallback") || tour.id?.includes?.("coastal")
                        ? "/traveler/tour-detail"
                        : `/traveler/tour-detail/${tour.id}`
                    }
                    className="flex min-h-[230px] cursor-pointer flex-col rounded-[2rem] border border-outline-variant/15 bg-surface-container-low p-5 text-left shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10"
                  >
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 shadow-sm">
                      <span className="material-symbols-outlined text-3xl text-primary">
                        {tour.icon}
                      </span>
                    </div>
                    <h4 className="mb-1 font-headline text-xl font-bold text-on-surface">
                      {tour.title}
                    </h4>
                    <p className="mb-6 line-clamp-2 text-sm text-on-surface-variant">
                      {tour.description}
                    </p>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="rounded-full bg-surface-container-lowest px-3 py-1.5 text-xs font-semibold text-on-surface shadow-sm">
                        {t("travelerDashboard.estimated")} {tour.price}
                      </div>
                      <div className="flex items-center text-xs font-bold text-primary">
                        {tour.type}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          <div className="space-y-8 lg:col-span-4">
            <section className="rounded-3xl border border-outline-variant/15 bg-surface-container-lowest p-8 shadow-sm">
              <h3 className="mb-6 text-xl font-extrabold text-on-surface">
                {t("travelerDashboard.quickActions")}
              </h3>
              <div className="space-y-4">
                <Link
                  to="/traveler/ai-travel-planner"
                  className="group flex w-full items-center justify-between rounded-2xl bg-primary/10 p-4 text-primary transition-all hover:-translate-y-0.5 hover:bg-primary/15 hover:shadow-md hover:shadow-primary/10"
                >
                  <span className="flex items-center space-x-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-lowest text-primary shadow-sm transition-transform group-hover:scale-105">
                      <span className="material-symbols-outlined">
                        auto_awesome
                      </span>
                    </span>
                    <span className="text-base font-bold">
                      {t("travelerDashboard.generateAiPlan")}
                    </span>
                  </span>
                  <span className="material-symbols-outlined text-primary transition-transform group-hover:translate-x-1">
                    chevron_right
                  </span>
                </Link>

                <Link
                  to="/traveler/tour-list"
                  className="group flex w-full items-center justify-between rounded-2xl bg-secondary-container p-4 text-on-secondary-container transition-all hover:-translate-y-0.5 hover:shadow-md hover:shadow-secondary/10"
                >
                  <span className="flex items-center space-x-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-lowest text-secondary shadow-sm transition-transform group-hover:scale-105">
                      <span className="material-symbols-outlined">
                        explore
                      </span>
                    </span>
                    <span className="text-base font-bold">{t("travelerDashboard.browseTours")}</span>
                  </span>
                  <span className="material-symbols-outlined text-secondary transition-transform group-hover:translate-x-1">
                    chevron_right
                  </span>
                </Link>

                <Link
                  to="/traveler/my-booking-traveler"
                  className="group flex w-full items-center justify-between rounded-2xl bg-surface-container-low p-4 text-on-surface transition-all hover:-translate-y-0.5 hover:bg-surface-container-high hover:shadow-md"
                >
                  <span className="flex items-center space-x-4">
                    <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-container-lowest text-on-surface-variant shadow-sm transition-transform group-hover:scale-105">
                      <span className="material-symbols-outlined">
                        book_online
                      </span>
                    </span>
                    <span className="text-base font-bold">{t("travelerDashboard.myBookings")}</span>
                  </span>
                  <span className="material-symbols-outlined text-slate-400 transition-transform group-hover:translate-x-1 group-hover:text-slate-600">
                    chevron_right
                  </span>
                </Link>
              </div>
            </section>

            <section className="group relative overflow-hidden rounded-[2rem] bg-surface-container-lowest shadow-sm">
              <div className="absolute left-4 top-4 z-10">
                <div className="rounded-2xl bg-white/90 p-3 shadow-sm backdrop-blur-md">
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                    {t("travelerDashboard.totalCountries")}
                  </p>
                  <p className="font-headline text-2xl font-extrabold text-teal-800">
                    {citiesVisited}
                  </p>
                </div>
              </div>
              <img
                alt="World Map"
                className="h-64 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDECaoI9tXgXJWH0Czo6xE5fWe0KDdhvqLWdB7qiySRNB2o3ztqA9xYxwbFq_vQmMeoHQ4riKeccYEH8YUhkKxMlNA6zrxl9dt7h45K9hSSqucO0QWkFvPy8o-qbF5Knv3EVGTO37wvzjldSH4h6_8Ez2y_BziLB2WDvfJjWMstvWK_bcq82c01iba3iORoHKTxJfczZl3Q47q-GedL2v5v8e4o1sQoTU5S2pHdAmFXvJHdHRYzrtNKCe-AAbZGva90XYwPt8tPOfLd"
              />
              <div className="p-6">
                <div className="mb-2 flex items-center space-x-2 text-xs font-bold text-primary">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                  <span>{t("travelerDashboard.liveTravelMap")}</span>
                </div>
                <h4 className="font-headline font-bold text-on-surface">
                  {t("travelerDashboard.footprintTitle")}
                </h4>
                <p className="mt-1 text-sm text-on-surface-variant">
                  {t("travelerDashboard.footprintText")}
                </p>
              </div>
            </section>

            <section className="rounded-[2rem] bg-gradient-to-br from-[#0f766e] via-[#0d9488] to-[#f97316] p-10 text-white shadow-xl shadow-primary/10 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:from-surface-container-high dark:via-surface-container-low dark:to-[#123b37]">
              <div className="mb-8 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                <span className="material-symbols-outlined text-3xl text-white">
                  magic_button
                </span>
              </div>
              <h3 className="mb-3 text-2xl font-headline font-bold tracking-tight">
                {t("travelerDashboard.smartBudgeting")}
              </h3>
              <p className="mb-6 text-base leading-relaxed text-white/85">
                {t("travelerDashboard.smartBudgetingText")}
              </p>

              <div className="mb-8 space-y-3 rounded-xl bg-black/20 p-4 backdrop-blur-sm ring-1 ring-white/10">
                <div className="flex items-center justify-between text-sm font-medium">
                  <span>{t("travelerDashboard.todaySpending")}</span>
                  <span>{formatCurrencyVND(spendingUsed * 1000)} / {formatCurrencyVND(spendingBudget * 1000)}</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-white shadow-md"
                    style={{ width: `${spendingPercent}%` }}
                  ></div>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-white/75">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      local_cafe
                    </span>
                    <span>{t("travelerDashboard.coffee")}: {formatCurrencyVND(6000)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      restaurant
                    </span>
                    <span>{t("travelerDashboard.lunch")}: {formatCurrencyVND(18000)}</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px]">
                      directions_bus
                    </span>
                    <span>{t("travelerDashboard.transport")}: {formatCurrencyVND(5000)}</span>
                  </span>
                </div>
                <p className="mt-2 text-xs italic text-white/75">
                  {t("travelerDashboard.rewardPoints", { points: rewardPoints.toLocaleString(language === "vi" ? "vi-VN" : "en-US") })}
                </p>
              </div>

              <button
                type="button"
                className="w-full rounded-xl bg-white py-4 text-base font-bold text-slate-950 shadow-md transition-all hover:-translate-y-0.5 hover:bg-white/90 hover:shadow-lg active:scale-[0.98] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary-container dark:hover:text-on-primary-container"
              >
                {t("travelerDashboard.activateTracker")}
              </button>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
};

export default TravelerDashboard;


