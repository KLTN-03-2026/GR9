import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import PageHero from "@/components/shared/page-hero";
import { getProviderDashboard } from "@/services/api/provider";
import { formatCurrencyVND } from "@/utils/formatPrice";

const ProviderDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    getProviderDashboard()
      .then((response) => setDashboard(response.data.data || null))
      .catch((error) =>
        toast.error(error?.response?.data?.message || "Cannot load provider dashboard"),
      );
  }, []);

  const stats = useMemo(() => {
    const summary = dashboard?.summary || {};
    return [
      {
        label: "Total Bookings",
        value: Number(summary.totalBookings || 0).toLocaleString("en-US"),
        note: `Across ${summary.activeTours || 0} active packages`,
        trend: `${summary.confirmedBookings || 0} confirmed`,
        trendClass: "text-primary bg-primary/10",
        icon: "confirmation_number",
        iconClass: "bg-secondary-container text-on-secondary-container",
      },
      {
        label: "Monthly Revenue",
        value: formatCurrencyVND(summary.revenueTotal),
        note: `${summary.paidBookings || 0} paid bookings recorded`,
        trend: `${summary.pendingAiRequests || 0} AI req`,
        trendClass: "text-tertiary bg-tertiary/10",
        icon: "payments",
        iconClass: "bg-tertiary-fixed text-on-tertiary-fixed",
      },
      {
        label: "Active Tours",
        value: Number(summary.activeTours || 0).toLocaleString("en-US"),
        note: `${summary.servicesCount || 0} services connected`,
        trend: `${summary.guidesCount || 0} guides`,
        trendClass: "bg-slate-100 text-slate-500",
        icon: "explore",
        iconClass: "bg-primary-fixed text-on-primary-fixed",
      },
    ];
  }, [dashboard]);

  const chartData = useMemo(() => {
    const revenueItems = dashboard?.monthlyRevenue || [];
    const maxRevenue = Math.max(...revenueItems.map((item) => item.revenue || 0), 1);

    return revenueItems.map((item, index) => ({
      month: item.label,
      height: `${Math.max(18, Math.round(((item.revenue || 0) / maxRevenue) * 100))}%`,
      active: index === revenueItems.length - 1,
      value: formatCurrencyVND(item.revenue),
    }));
  }, [dashboard]);

  const activities = useMemo(() => {
    const recentBookings = (dashboard?.recentBookings || []).slice(0, 2).map((booking) => ({
      title: "New Booking",
      time: booking.startDate || "Recently",
      description: `${booking.travelerName} booked "${booking.tourName}"`,
      image:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCB_ATMzqmcxMiBDLPBaN2jAGvFssTBbJvuC1UsM9JQea0m9jl2ingysZNNiIZC53EHQJID2AwWj7OZIuYLkzSmu3pfW0P4XexH6dvXm_dzcR-vxALDSJZzhLCk_qsv1lTMoqrM49apCnZOpiRUcxeIbpLYTyEZb0g95Y6_Bo8nxb4czzgQ0iruF3ZPPOoV-VGz4mhX0wnvghYXMTCCzMBQGdSSutcoglSUQ5CcaezdEnT9AGw3PwgavbTUuICzH_CJeeo_v5fWmzvh",
      imageAlt: booking.travelerName,
    }));

    const aiItems = (dashboard?.recentAiRequests || []).slice(0, 2).map((request) => ({
      title: request.status === "PUBLISHED" ? "AI Tour Request" : "Proposal Update",
      time: request.startDay || "Recently",
      description: `${request.travelerName} requested "${request.location}"`,
      icon: "auto_awesome",
      iconWrapperClass: "bg-primary-fixed text-on-primary-fixed",
    }));

    return [...recentBookings, ...aiItems].slice(0, 4);
  }, [dashboard]);

  return (
    <div className="space-y-8 text-on-surface">
      <PageHero
        eyebrow="Performance Overview"
        heading={
          <>
            Provider{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              Dashboard
            </span>
          </>
        }
        description="Welcome back, Skyline. Here is what's happening today across bookings, revenue, and tour performance."
        actions={
          <div className="flex items-center space-x-4">
            <div className="relative">
              <span className="absolute right-0 top-0 h-2 w-2 rounded-full border-2 border-white bg-error" />
              <Link
                to="/provider/manage-tours"
                className="rounded-full bg-surface-container-lowest p-2.5 text-on-surface-variant transition-colors hover:text-primary"
              >
                <span className="material-symbols-outlined">notifications</span>
              </Link>
            </div>

            <Link
              to="/provider/manage-tours"
              className="flex items-center space-x-2 rounded-xl bg-gradient-to-br from-primary to-primary-container px-6 py-2.5 font-heading font-semibold text-on-primary shadow-sm transition-all hover:opacity-90 active:scale-95"
            >
              <span className="material-symbols-outlined text-[20px]">add</span>
              <span>New Tour</span>
            </Link>
          </div>
        }
      />

      <section className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="group rounded-3xl bg-surface-container-lowest p-6 transition-all duration-300 hover:bg-teal-50/50"
          >
            <div className="mb-4 flex items-start justify-between">
              <div className={`rounded-2xl p-3 ${stat.iconClass}`}>
                <span className="material-symbols-outlined">{stat.icon}</span>
              </div>
              <span
                className={`rounded-full px-2.5 py-1 text-sm font-bold ${stat.trendClass}`}
              >
                {stat.trend}
              </span>
            </div>
            <p className="font-heading text-sm font-semibold text-on-surface-variant">
              {stat.label}
            </p>
            <h3 className="mt-1 font-heading text-3xl font-extrabold">
              {stat.value}
            </h3>
            <p className="mt-4 text-xs text-slate-400">{stat.note}</p>
          </div>
        ))}
      </section>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl bg-surface-container-lowest p-8 lg:col-span-2">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h4 className="font-heading text-lg font-bold">
                Revenue Analysis
              </h4>
              <p className="text-sm text-on-surface-variant">
                Monthly earnings for 2024
              </p>
            </div>

            <select className="rounded-xl border-0 bg-surface-container-low p-3 pr-8 text-sm font-semibold focus:ring-primary">
              <option>Last 6 Months</option>
              <option>Year to Date</option>
            </select>
          </div>

          <div className="flex h-64 items-end justify-between space-x-2 px-4 pt-10">
            {chartData.map((bar) => (
              <div
                key={bar.month}
                className="group flex flex-1 flex-col items-center"
              >
                <div
                  className={
                    bar.active
                      ? "relative w-full rounded-t-xl bg-primary shadow-lg shadow-primary/20 transition-all duration-300"
                      : "w-full rounded-t-xl bg-slate-100 transition-all duration-300 group-hover:bg-primary-fixed-dim"
                  }
                  style={{ height: bar.height }}
                >
                  {bar.active ? (
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded bg-on-surface px-2 py-1 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                      {bar.value}
                    </div>
                  ) : null}
                </div>
                <span
                  className={
                    bar.active
                      ? "mt-3 font-heading text-[10px] font-bold text-primary"
                      : "mt-3 font-heading text-[10px] font-bold text-slate-400"
                  }
                >
                  {bar.month}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-surface-container-lowest p-8">
          <div className="mb-6 flex items-center justify-between">
            <h4 className="font-heading text-lg font-bold">Recent Activity</h4>
            <Link to="/provider/bookings-management" className="font-heading text-xs font-bold text-primary hover:underline">
              View All
            </Link>
          </div>

          <div className="space-y-6">
            {activities.map((activity) => (
              <div
                key={`${activity.title}-${activity.time}-${activity.description}`}
                className="flex space-x-4"
              >
                {activity.image ? (
                  <div className="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <img
                      alt={activity.imageAlt}
                      className="h-full w-full object-cover"
                      src={activity.image}
                    />
                  </div>
                ) : (
                  <div
                    className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${activity.iconWrapperClass}`}
                  >
                    <span className="material-symbols-outlined text-[20px]">
                      {activity.icon}
                    </span>
                  </div>
                )}

                <div className="flex-1">
                  <div className="flex justify-between">
                    <p className="text-sm font-bold text-on-surface">
                      {activity.title}
                    </p>
                    <span className="text-[10px] text-slate-400">
                      {activity.time}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-on-surface-variant">
                    {activity.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <section className="w-full">
        <div className="relative flex min-h-[250px] flex-col overflow-hidden rounded-[2rem] bg-[#125d4f] p-8 text-white shadow-sm md:p-12">
          <div className="pointer-events-none absolute right-[-5%] top-1/2 z-0 h-[250px] w-[250px] -translate-y-1/2 rounded-full border-[24px] border-white/5 md:right-[5%] md:h-[320px] md:w-[320px] md:border-[32px]"></div>
          <div className="pointer-events-none absolute right-[-20%] top-1/2 z-0 h-[400px] w-[400px] -translate-y-1/2 rounded-full border-[24px] border-white/5 md:right-[-5%] md:h-[500px] md:w-[500px] md:border-[32px]"></div>
          <div className="pointer-events-none absolute right-[-35%] top-1/2 z-0 h-[550px] w-[550px] -translate-y-1/2 rounded-full border-[24px] border-white/5 md:right-[-15%] md:h-[680px] md:w-[680px] md:border-[32px]"></div>

          <span className="material-symbols-outlined pointer-events-none absolute right-12 top-1/2 z-0 -translate-y-1/2 text-[120px] opacity-20 md:right-28 md:text-[160px]">
            insights
          </span>

          <svg
            className="pointer-events-none absolute -bottom-4 -right-4 z-0 h-32 w-32 text-white opacity-20 md:-bottom-6 md:-right-2 md:h-40 md:w-40"
            viewBox="0 0 24 24"
            fill="currentColor"
          >
            <path d="M12 0l2.5 8.5L23 11l-8.5 2.5L12 22l-2.5-8.5L1 11l8.5-2.5z" />
          </svg>

          <div className="relative z-10 flex w-full max-w-xl flex-col items-start">
            <span className="rounded-md bg-white/10 px-3 py-1 font-heading text-[10px] font-bold uppercase tracking-[0.2em] text-teal-100">
              Voyager Insights
            </span>

            <h4 className="mt-5 font-heading text-2xl font-bold leading-tight md:text-[32px]">
              Boost your bookings this summer with AI-driven pricing.
            </h4>

            <p className="mt-3 text-sm text-white/80 md:text-base">
              Your workspace currently has {dashboard?.summary?.pendingAiRequests || 0} open AI requests and {dashboard?.summary?.servicesCount || 0} connected services.
            </p>

            <Link to="/provider/manage-tours" className="mt-8 rounded-xl bg-white px-6 py-3 font-heading text-sm font-bold text-[#125d4f] transition-colors hover:bg-gray-100 shadow-sm">
              Apply Optimization
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProviderDashboard;
