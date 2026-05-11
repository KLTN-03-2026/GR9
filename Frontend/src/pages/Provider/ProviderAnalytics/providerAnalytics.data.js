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

const typeLabels = {
  GROUP: "Tour ghép",
  PRIVATE: "Tour riêng",
  OTHER: "Khác",
};

export const providerAnalyticsStatic = {
  hero: {
    eyebrow: "PROVIDER ANALYTICS",
    titleA: "Hiệu suất",
    titleB: "kinh doanh tour",
    description:
      "Dữ liệu thật từ booking, tour, review, guide và dịch vụ của provider.",
  },
  quickActions: [
    { icon: ChartNoAxesColumnIncreasing, title: "Xem tăng trưởng", description: "Theo dõi biến động booking và doanh thu theo tháng." },
    { icon: Compass, title: "Tối ưu tour", description: "Tập trung nâng cấp tour có tỷ lệ chuyển đổi cao." },
    { icon: MessageSquareText, title: "Phản hồi review", description: "Ưu tiên các đánh giá mới để cải thiện chất lượng dịch vụ." },
  ],
};

export const buildProviderAnalyticsView = (analytics) => {
  const trend = analytics?.revenueTrend || [];
  const maxRevenue = maxOf(trend, "revenue");

  return {
    ...providerAnalyticsStatic,
    stats: [
      {
        icon: CircleDollarSign,
        label: "Tổng doanh thu",
        value: formatVnd(analytics?.summary?.revenueTotal),
        trend: `${analytics?.summary?.totalTours || 0} tour đang quản lý`,
        tone: "primary",
      },
      {
        icon: CalendarCheck,
        label: "Booking đang hoạt động",
        value: Number(analytics?.summary?.activeBookings || 0).toLocaleString("vi-VN"),
        trend: `${analytics?.summary?.guidesCount || 0} guide trong đội ngũ`,
        tone: "success",
      },
      {
        icon: Star,
        label: "Đánh giá trung bình",
        value: `${analytics?.summary?.averageRating || 0} / 5`,
        trend: "Dựa trên review tour thật",
        tone: "warning",
      },
      {
        icon: UsersRound,
        label: "Tỉ lệ hoàn tất tour",
        value: `${analytics?.summary?.completionRate || 0}%`,
        trend: `${analytics?.summary?.servicesCount || 0} dịch vụ đang có`,
        tone: "success",
      },
    ],
    revenueChart: {
      title: "Xu hướng doanh thu",
      description: "Doanh thu thanh toán thật theo tháng.",
      tabs: [
        { value: "monthly", label: "Theo tháng" },
        { value: "bookings", label: "Booking" },
      ],
      bars: trend.map((item) => ({
        label: item.label,
        primary: Math.max(4, Math.round(((Number(item.revenue) || 0) / maxRevenue) * 100)),
        primaryLabel: formatVnd(item.revenue),
      })),
      legend: [{ label: "Doanh thu", className: "bg-primary" }],
    },
    bookingMix: {
      title: "Cơ cấu booking",
      description: "Phân bổ booking thật theo loại tour.",
      items: (analytics?.bookingMix || []).map((item) => ({
        label: typeLabels[item.label] || item.label,
        value: `${item.percent}%`,
        progress: item.percent,
      })),
    },
    topTours: {
      title: "Tour hiệu suất cao",
      columns: [
        { key: "tour", label: "Tour" },
        { key: "bookings", label: "Booking" },
        { key: "revenue", label: "Doanh thu" },
        { key: "rating", label: "Đánh giá" },
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
      title: "Đánh giá gần đây",
      description: "Review thật từ traveler trên các tour của provider.",
      actionLabel: "Quản lý review",
      items: (analytics?.recentReviews || []).map((item) => ({
        title: item.title,
        description: item.description,
        badge: item.tourName,
        badgeClassName: "bg-primary/10 text-primary",
      })),
    },
  };
};
