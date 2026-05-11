import {
  BadgeCheck,
  CircleAlert,
  FileCheck2,
  HeartPulse,
  ShieldCheck,
  Users,
  WalletCards,
} from "lucide-react";

const formatVnd = (value) =>
  `${Number(value || 0).toLocaleString("vi-VN")} đ`;

const maxOf = (items, key) =>
  Math.max(...items.map((item) => Number(item[key]) || 0), 1);

export const adminAnalyticsStatic = {
  hero: {
    eyebrow: "ADMIN ANALYTICS",
    titleA: "System",
    titleB: "Governance",
    description:
      "Theo dõi sức khỏe nền tảng, kiểm duyệt provider, tăng trưởng người dùng và các cảnh báo vận hành quan trọng.",
  },
  actionCards: [
    { icon: ShieldCheck, title: "Kiểm tra bảo mật", description: "Rà soát quyền admin và trạng thái đăng nhập bất thường." },
    { icon: FileCheck2, title: "Duyệt hồ sơ", description: "Mở hàng chờ provider để xử lý tài liệu xác minh." },
    { icon: CircleAlert, title: "Xem cảnh báo", description: "Ưu tiên các cảnh báo ảnh hưởng booking và thanh toán." },
  ],
};

export const buildAdminAnalyticsView = (analytics) => {
  const growth = analytics?.growth || [];
  const maxUsers = maxOf(growth, "users");
  const maxProviders = maxOf(growth, "providers");

  return {
    ...adminAnalyticsStatic,
    stats: [
      {
        icon: WalletCards,
        label: "Tổng GMV nền tảng",
        value: formatVnd(analytics?.summary?.totalRevenue),
        trend: `${analytics?.summary?.totalBookings || 0} booking toàn hệ thống`,
        tone: "primary",
      },
      {
        icon: Users,
        label: "Người dùng",
        value: Number(analytics?.summary?.totalUsers || 0).toLocaleString("vi-VN"),
        trend: "Tổng tài khoản đã tạo",
        tone: "success",
      },
      {
        icon: BadgeCheck,
        label: "Provider đã xác minh",
        value: Number(analytics?.summary?.activeProviders || 0).toLocaleString("vi-VN"),
        trend: `${analytics?.summary?.verifiedProviderPercent || 0}% provider hoạt động`,
        tone: "primary",
      },
      {
        icon: HeartPulse,
        label: "Uptime hệ thống",
        value: `${analytics?.summary?.systemUptimePercent || 0}%`,
        trend: "Theo health check nội bộ",
        tone: "success",
      },
    ],
    growthChart: {
      title: "Tăng trưởng hệ thống",
      description: "Traveler và provider mới theo dữ liệu tài khoản thật.",
      tabs: [
        { value: "weekly", label: "Theo tháng" },
        { value: "bookings", label: "Booking" },
      ],
      bars: growth.map((item) => ({
        label: item.label,
        primary: Math.max(4, Math.round(((Number(item.users) || 0) / maxUsers) * 100)),
        secondary: Math.max(4, Math.round(((Number(item.providers) || 0) / maxProviders) * 100)),
        primaryLabel: `${item.users} traveler`,
        secondaryLabel: `${item.providers} provider`,
      })),
      legend: [
        { label: "Traveler", className: "bg-primary" },
        { label: "Provider", className: "bg-secondary-container" },
      ],
    },
    regions: {
      title: "Phân bổ khu vực",
      description: "Tỷ trọng booking thật theo địa điểm tour.",
      items: (analytics?.regions || []).map((item) => ({
        label: item.label,
        value: `${item.percent}%`,
        progress: item.percent,
      })),
    },
    queue: {
      title: "Hồ sơ cần duyệt",
      description: "Provider đang chờ admin kiểm tra tài liệu xác minh.",
      actionLabel: "Xem tất cả",
      items: (analytics?.moderationQueue || []).map((item) => ({
        title: item.title,
        description: item.description,
        badge: "Đang chờ",
        badgeClassName: "bg-amber-500/10 text-amber-700",
      })),
    },
    alerts: {
      title: "Cảnh báo hệ thống",
      description: "Sinh từ dữ liệu booking, AI request và moderation hiện tại.",
      items: (analytics?.alerts || []).map((item) => ({
        title: item.title,
        description: item.description,
        badge: item.level === "danger" ? "Cao" : item.level === "warning" ? "Theo dõi" : "Ổn",
        badgeClassName:
          item.level === "danger"
            ? "bg-red-500/10 text-red-600"
            : item.level === "warning"
              ? "bg-amber-500/10 text-amber-700"
              : "bg-emerald-500/10 text-emerald-600",
      })),
    },
    complianceRows: {
      title: "Chỉ số kiểm duyệt",
      columns: [
        { key: "metric", label: "Chỉ số" },
        { key: "value", label: "Giá trị" },
        { key: "status", label: "Trạng thái" },
      ],
      rows: analytics?.complianceRows || [],
    },
  };
};
