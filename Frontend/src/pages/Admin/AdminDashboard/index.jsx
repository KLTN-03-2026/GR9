import React from "react";

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

const AdminDashboard = () => {
  const activityItems = [
    {
      id: "BK-9281",
      name: "Emma Wilson",
      message: "booked a private tour:",
      highlight: "Santorini Sunset Sail",
      time: "2 minutes ago",
      meta: "Booking ID: #BK-9281",
      status: { label: "PENDING", variant: "warning" },
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuCGz6dtJJ6pt8L8DFZgHAstBWGkGlOezpWCB1ZzJlZnR5o8kFZu-A75gmDmujUI7eifTGqkj87NHxExcPwUBE4kH5Lrl_4UMceZmMXzyKOpHkPWzZ-lApJpVqZ2dsQxyXrYiSPM4Vj6b8rV102xyMSS7YI5XFn694ZOCS9qwvi4gmlCNkN02gujOf4EWXM-FTtA9QG878bWHbQqiQPJh7rPRgcVD1TwCXYZQtLPS4IUtfbub3qhzb08-dML-sf_XAeKIVR2b3qRNj92",
    },
    {
      id: "QUEUE-VERIFY",
      name: "Skyline Tours",
      message: "submitted a new listing for approval.",
      time: "15 minutes ago",
      meta: "Verification Queue",
      status: { label: "REVIEW", variant: "secondary" },
      icon: <ShieldCheck className="size-5 text-primary" />,
    },
    {
      id: "SUB-001",
      name: "Marcus Chen",
      message: "upgraded to Premium Membership.",
      time: "1 hour ago",
      meta: "Subscription Event",
      status: { label: "SUCCESS", variant: "success" },
      avatar:
        "https://lh3.googleusercontent.com/aida-public/AB6AXuBGEt35LAwsOODKE_4618dGD5fpUf9FTa09Ouav0NV1LiRUTBOHIo4PQNTo04etMWQUWCBMFNWETmVKC5FvqaXXqCdidMXXQy9MBPR1Vgf7iruPoRSCyXbCyPFflMKpYIiQpELiVwewRMo4F66NZvGQSX4XdOsLH2lEfy6RaC_geV0nsD45VPdGqtnwogImR5PmEkrQ5xFVir8sHpzqCTU7IH9WWQNo4gOL9zSoXfOdNq49H_YM27v3rrQHhggv3fAoGNOt2mu_9sYF",
    },
  ];

  const healthMetrics = [
    {
      label: "API Latency",
      valueLabel: "24ms (Optimal)",
      valueClassName: "text-primary",
      percent: 20,
    },
    {
      label: "Server Load",
      valueLabel: "42% (Normal)",
      valueClassName: "text-on-surface-variant",
      percent: 42,
      barClassName: "bg-tertiary-container",
    },
    {
      label: "Storage Capacity",
      valueLabel: "88% (Critical)",
      valueClassName: "text-error",
      percent: 88,
      barClassName: "bg-error",
    },
  ];

  return (
    <div className="mx-auto w-full max-w-[1600px] space-y-8 pb-12 pt-24">
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
      <section className="grid grid-cols-1 gap-6 md:grid-cols-4">
        <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-on-primary md:col-span-2">
          <div className="relative z-10">
            <p className="text-sm font-medium tracking-wide text-primary-fixed/80">
              TOTAL REVENUE (MTD)
            </p>
            <h2 className="mt-2 text-4xl font-extrabold tracking-tighter">
              $1,284,592.00
            </h2>
            <div className="mt-4 inline-flex items-center rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
              <TrendingUp className="mr-1 size-4" />
              +12.4% from last month
            </div>
          </div>

          <div className="pointer-events-none absolute -right-10 -bottom-10 opacity-10">
            <Wallet className="size-[180px]" />
          </div>
        </div>

        <Card className="rounded-2xl border-none bg-surface-container-lowest shadow-sm">
          <CardContent className="flex h-full flex-col justify-between p-8">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-secondary-container text-primary">
                <Users className="size-5" />
              </div>
              <p className="text-sm font-semibold text-on-surface-variant">
                Total Users
              </p>
              <h2 className="mt-1 text-2xl font-bold text-on-surface">
                482.9k
              </h2>
            </div>
            <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-surface-container">
              <div className="h-full w-3/4 bg-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-none bg-surface-container-lowest shadow-sm">
          <CardContent className="flex h-full flex-col justify-between p-8">
            <div>
              <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-tertiary-container/10 text-tertiary">
                <Ticket className="size-5" />
              </div>
              <p className="text-sm font-semibold text-on-surface-variant">
                Total Bookings
              </p>
              <h2 className="mt-1 text-2xl font-bold text-on-surface">
                12,481
              </h2>
            </div>
            <div className="mt-4 flex items-center text-xs font-bold text-error">
              <TrendingDown className="mr-1 size-4" />
              -2.1% spike
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-on-surface">
              Global Activity Feed
            </h3>
            <Button className="h-auto px-0 text-primary" variant="link">
              View All
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
                    All 14 regions operating normally
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
              14 listings require manual verification.
            </p>
            <Button className="relative z-10 mt-4 rounded-lg bg-on-tertiary-container px-4 text-xs font-bold text-tertiary hover:bg-on-tertiary-container/90">
              Review Now
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
