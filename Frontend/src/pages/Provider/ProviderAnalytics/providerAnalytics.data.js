import {
  CalendarCheck,
  ChartNoAxesColumnIncreasing,
  CircleDollarSign,
  Compass,
  MessageSquareText,
  Star,
  UsersRound,
} from "lucide-react";

const formatVnd = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")} đ`;

const maxOf = (items, key) =>
  Math.max(...items.map((item) => Number(item[key]) || 0), 1);

export const getProviderAnalyticsStatic = (t) => ({
  hero: {
    eyebrow: t("providerAnalyticsPage.heroEyebrow"),
    titleA: t("providerAnalyticsPage.heroTitleA"),
    titleB: t("providerAnalyticsPage.heroTitleB"),
    description: t("providerAnalyticsPage.heroDescription"),
  },
  quickActions: [
    {
      icon: ChartNoAxesColumnIncreasing,
      title: t("providerAnalyticsPage.viewGrowth"),
      description: t("providerAnalyticsPage.viewGrowthDescription"),
    },
    {
      icon: Compass,
      title: t("providerAnalyticsPage.optimizeTours"),
      description: t("providerAnalyticsPage.optimizeToursDescription"),
    },
    {
      icon: MessageSquareText,
      title: t("providerAnalyticsPage.respondReviews"),
      description: t("providerAnalyticsPage.respondReviewsDescription"),
    },
  ],
});

export const buildProviderAnalyticsView = (analytics, t) => {
  const trend = analytics?.revenueTrend || [];
  const maxRevenue = maxOf(trend, "revenue");
  const providerAnalyticsStatic = getProviderAnalyticsStatic(t);
  const typeLabels = {
    GROUP: t("providerAnalyticsPage.typeGroup"),
    PRIVATE: t("providerAnalyticsPage.typePrivate"),
    OTHER: t("providerAnalyticsPage.typeOther"),
  };

  return {
    ...providerAnalyticsStatic,
    stats: [
      {
        icon: CircleDollarSign,
        label: t("providerAnalyticsPage.totalRevenue"),
        value: formatVnd(analytics?.summary?.revenueTotal),
        trend: t("providerAnalyticsPage.managedTours", { count: analytics?.summary?.totalTours || 0 }),
        tone: "primary",
      },
      {
        icon: CalendarCheck,
        label: t("providerAnalyticsPage.activeBookings"),
        value: Number(analytics?.summary?.activeBookings || 0).toLocaleString("vi-VN"),
        trend: t("providerAnalyticsPage.guidesInTeam", { count: analytics?.summary?.guidesCount || 0 }),
        tone: "success",
      },
      {
        icon: Star,
        label: t("providerAnalyticsPage.averageRating"),
        value: `${analytics?.summary?.averageRating || 0} / 5`,
        trend: t("providerAnalyticsPage.realReviewBased"),
        tone: "warning",
      },
      {
        icon: UsersRound,
        label: t("providerAnalyticsPage.completionRate"),
        value: `${analytics?.summary?.completionRate || 0}%`,
        trend: t("providerAnalyticsPage.activeServices", { count: analytics?.summary?.servicesCount || 0 }),
        tone: "success",
      },
    ],
    revenueChart: {
      title: t("providerAnalyticsPage.revenueTrend"),
      description: t("providerAnalyticsPage.revenueTrendDescription"),
      tabs: [
        { value: "monthly", label: t("providerAnalyticsPage.monthly") },
        { value: "bookings", label: t("providerAnalyticsPage.booking") },
      ],
      bars: trend.map((item) => ({
        label: item.label,
        primary: Math.max(4, Math.round(((Number(item.revenue) || 0) / maxRevenue) * 100)),
        primaryLabel: formatVnd(item.revenue),
      })),
      legend: [{ label: t("providerAnalyticsPage.revenue"), className: "bg-primary" }],
    },
    bookingMix: {
      title: t("providerAnalyticsPage.bookingMix"),
      description: t("providerAnalyticsPage.bookingMixDescription"),
      items: (analytics?.bookingMix || []).map((item) => ({
        label: typeLabels[item.label] || item.label,
        value: `${item.percent}%`,
        progress: item.percent,
      })),
    },
    topTours: {
      title: t("providerAnalyticsPage.topTours"),
      columns: [
        { key: "tour", label: t("providerAnalyticsPage.tour") },
        { key: "bookings", label: t("providerAnalyticsPage.booking") },
        { key: "revenue", label: t("providerAnalyticsPage.revenue") },
        { key: "rating", label: t("providerAnalyticsPage.rating") },
      ],
      rows: (analytics?.topTours || []).map((item) => ({
        id: item.id,
        tour: item.tour,
        bookings: item.bookings,
        revenue: formatVnd(item.revenue),
        rating: `${item.rating || 0}/5`,
      })),
    },
    reviews: {
      title: t("providerAnalyticsPage.recentReviews"),
      description: t("providerAnalyticsPage.recentReviewsDescription"),
      actionLabel: t("providerAnalyticsPage.manageReviews"),
      items: (analytics?.recentReviews || []).map((item) => ({
        title: item.title,
        description: item.description,
        badge: item.tourName,
        badgeClassName: "bg-primary/10 text-primary",
      })),
    },
  };
};
