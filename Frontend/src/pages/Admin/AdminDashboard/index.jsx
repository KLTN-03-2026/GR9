import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import {
  Activity,
  CircleCheck,
  ShieldCheck,
  Ticket,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import PageHero from "@/components/shared/page-hero";
import { getAdminDashboard } from "@/services/api/admin";
import { formatCurrencyVND } from "@/utils/formatPrice";

const AdminDashboard = () => {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    getAdminDashboard()
      .then((response) => setDashboard(response.data.data || null))
      .catch((error) =>
        toast.error(error?.response?.data?.message || "Cannot load admin dashboard"),
      );
  }, []);

  const activityItems = useMemo(
    () =>
      (dashboard?.recentActivity || []).map((item) => ({
        id: item.id,
        name: item.title,
        message: item.message,
        highlight: item.type === "BOOKING" ? item.meta : null,
        time: item.createdAt
          ? new Date(item.createdAt).toLocaleString("en-US")
          : "Recently",
        meta: item.meta,
        status: {
          label: item.status || "INFO",
          variant: item.status === "PENDING" ? "warning" : item.status === "SUCCESS" ? "success" : "secondary",
        },
        avatar:
          item.type === "BOOKING"
            ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCGz6dtJJ6pt8L8DFZgHAstBWGkGlOezpWCB1ZzJlZnR5o8kFZu-A75gmDmujUI7eifTGqkj87NHxExcPwUBE4kH5Lrl_4UMceZmMXzyKOpHkPWzZ-lApJpVqZ2dsQxyXrYiSPM4Vj6b8rV102xyMSS7YI5XFn694ZOCS9qwvi4gmlCNkN02gujOf4EWXM-FTtA9QG878bWHbQqiQPJh7rPRgcVD1TwCXYZQtLPS4IUtfbub3qhzb08-dML-sf_XAeKIVR2b3qRNj92"
            : null,
        icon:
          item.type !== "BOOKING" ? <ShieldCheck className="size-5 text-primary" /> : null,
      })),
    [dashboard],
  );

  const healthMetrics = useMemo(
    () => [
      {
        label: "API Latency",
        valueLabel: `${dashboard?.systemHealth?.apiLatencyMs || 24}ms (Optimal)`,
        valueClassName: "text-primary",
        percent: Math.min(100, dashboard?.systemHealth?.apiLatencyMs || 20),
      },
      {
        label: "Server Load",
        valueLabel: `${dashboard?.systemHealth?.serverLoadPercent || 42}% (Normal)`,
        valueClassName: "text-on-surface-variant",
        percent: dashboard?.systemHealth?.serverLoadPercent || 42,
        barClassName: "bg-tertiary-container",
      },
      {
        label: "Storage Capacity",
        valueLabel: `${dashboard?.systemHealth?.storagePercent || 88}% (Critical)`,
        valueClassName: "text-error",
        percent: dashboard?.systemHealth?.storagePercent || 88,
        barClassName: "bg-error",
      },
    ],
    [dashboard],
  );

  const totalRevenue = formatCurrencyVND(dashboard?.summary?.totalRevenue);
  const totalUsers = Number(dashboard?.summary?.totalUsers || 0).toLocaleString("en-US");
  const totalBookings = Number(dashboard?.summary?.totalBookings || 0).toLocaleString("en-US");

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-6 pb-10 pt-6 md:space-y-8 md:pt-24">
      <PageHero
        eyebrow="Command Center"
        heading={
          <>
            Admin{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              Dashboard
            </span>
          </>
        }
        description="Theo dõi tình trạng hoạt động của nền tảng, xem xét hoạt động trên thị trường và phản hồi nhanh chóng các tín hiệu về kiểm duyệt và vận hành."
      />
      <section className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-5 text-on-primary sm:p-8 md:col-span-2">
          <div className="relative z-10">
            <p className="text-sm font-medium tracking-wide text-primary-fixed/80">
              TOTAL REVENUE (MTD)
            </p>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tighter sm:text-4xl">
              {totalRevenue}
            </h2>
            <div className="mt-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <TrendingUp className="mr-1 size-4" />
              {dashboard?.moderation?.openAiRequests || 0} open AI requests
            </div>
          </div>

          <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-10">
            <Wallet className="size-[180px]" />
          </div>
        </div>

        <Card className="rounded-2xl border-none bg-surface-container-lowest shadow-sm">
          <CardContent className="flex h-full flex-col justify-between p-5 sm:p-8">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
                <Users className="size-5" />
              </div>
              <p className="text-sm font-semibold text-on-surface-variant">
                Total Users
              </p>
              <h2 className="mt-1 text-2xl font-bold text-on-surface">
                {totalUsers}
              </h2>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
              <div className="h-full w-3/4 bg-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none bg-surface-container-lowest shadow-sm">
          <CardContent className="flex h-full flex-col justify-between p-5 sm:p-8">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary-container/10 text-tertiary">
                <Ticket className="size-5" />
              </div>
              <p className="text-sm font-semibold text-on-surface-variant">
                Total Bookings
              </p>
              <h2 className="mt-1 text-2xl font-bold text-on-surface">
                {totalBookings}
              </h2>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-error">
              <TrendingDown className="mr-1 size-4" />
              {dashboard?.moderation?.pendingProviderApplications || 0} pending providers
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <h3 className="text-lg font-bold text-on-surface">
              Global Activity Feed
            </h3>
            <Button className="h-auto px-0 text-primary" variant="link" asChild>
              <Link to="/admin/users">View All</Link>
            </Button>
          </div>

          <Card className="overflow-hidden rounded-2xl border-none bg-surface-container-lowest shadow-sm">
            <CardContent className="p-0">
              <div className="divide-y divide-surface-container/50">
                {activityItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-4 p-6 transition-colors hover:bg-surface-container-low"
                  >
                    {item.avatar ? (
                      <Avatar className="h-10 w-10">
                        <AvatarImage alt={item.name} src={item.avatar} />
                        <AvatarFallback>
                          {item.name
                            .split(" ")
                            .slice(0, 2)
                            .map((part) => part[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container">
                        {item.icon}
                      </div>
                    )}

                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-on-surface">
                        <span className="font-bold">{item.name}</span>{" "}
                        {item.message}{" "}
                        {item.highlight ? (
                          <span className="font-medium text-primary">
                            {item.highlight}
                          </span>
                        ) : null}
                      </p>
                      <p className="mt-1 text-xs text-on-surface-variant">
                        {item.time} • {item.meta}
                      </p>
                    </div>

                    <Badge
                      className="rounded px-2 py-1 text-xs font-bold"
                      variant={item.status.variant}
                    >
                      {item.status.label}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <h3 className="text-lg font-bold text-on-surface">System Health</h3>

          <Card className="rounded-2xl border-none bg-surface-container-lowest shadow-sm">
            <CardContent className="space-y-8 p-6">
              {healthMetrics.map((metric) => (
                <div key={metric.label} className="space-y-3">
                  <div className="flex items-end justify-between">
                    <span className="text-sm font-semibold text-on-surface">
                      {metric.label}
                    </span>
                    <span
                      className={`text-xs font-bold ${metric.valueClassName}`}
                    >
                      {metric.valueLabel}
                    </span>
                  </div>

                  <div className="h-2 w-full overflow-hidden rounded-full bg-surface-container">
                    <div
                      className={`h-full ${
                        metric.barClassName ?? "bg-primary"
                      }`}
                      style={{ width: `${metric.percent}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="border-t border-surface-container-high pt-4">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <CircleCheck className="size-5 text-green-500" />
                  <span className="text-xs font-medium">
                    All core services are reachable
                  </span>
                </div>

                <Button className="mt-6 w-full rounded-xl bg-secondary-container text-on-secondary-container hover:bg-secondary-container/90">
                  Access System Logs
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="relative overflow-hidden rounded-2xl bg-tertiary-container p-6 text-on-tertiary-container">
            <h4 className="relative z-10 text-lg font-bold leading-tight">
              Moderation Pending
            </h4>
            <p className="relative z-10 mt-2 text-sm opacity-90">
              {dashboard?.moderation?.pendingProviderApplications || 0} provider applications require manual verification.
            </p>
            <Button className="relative z-10 mt-4 rounded-lg bg-on-tertiary-container px-4 text-xs font-bold text-tertiary hover:bg-on-tertiary-container/90" asChild>
              <Link to="/admin/provider-approval">Review Now</Link>
            </Button>

            <div className="pointer-events-none absolute -right-4 -bottom-4 opacity-10">
              <Activity className="size-24" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
