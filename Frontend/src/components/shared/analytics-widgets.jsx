import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Star } from "lucide-react";

export function AnalyticsStatCard({ icon: Icon, label, value, trend, tone = "primary" }) {
  const toneClass =
    tone === "warning"
      ? "bg-amber-500/10 text-amber-600"
      : tone === "success"
        ? "bg-emerald-500/10 text-emerald-600"
        : tone === "danger"
          ? "bg-red-500/10 text-red-600"
          : "bg-primary/10 text-primary";

  return (
    <Card className="group overflow-hidden rounded-3xl border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/10">
      <CardContent className="relative p-6">
        <div className="flex items-start justify-between gap-4">
          <div className={cn("flex size-12 items-center justify-center rounded-2xl", toneClass)}>
            <Icon className="size-5" />
          </div>
          <ArrowUpRight className="size-4 text-on-surface-variant opacity-0 transition-all group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:opacity-100" />
        </div>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          {label}
        </p>
        <p className="mt-2 font-headline text-3xl font-extrabold tracking-tight text-on-surface">
          {value}
        </p>
        <p className="mt-3 text-sm font-semibold text-primary">{trend}</p>
      </CardContent>
    </Card>
  );
}

export function AnalyticsBarChart({ title, description, tabs, bars, legend }) {
  return (
    <Card className="rounded-3xl border-outline-variant/20 bg-surface-container-lowest shadow-sm">
      <CardHeader className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <CardTitle className="font-headline text-2xl text-on-surface">{title}</CardTitle>
          <p className="mt-2 text-sm text-on-surface-variant">{description}</p>
        </div>
        {tabs?.length ? (
          <Tabs defaultValue={tabs[0].value}>
            <TabsList className="rounded-2xl bg-surface-container-low p-1">
              {tabs.map((tab) => (
                <TabsTrigger key={tab.value} value={tab.value} className="rounded-xl px-4">
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        ) : null}
      </CardHeader>
      <CardContent>
        <div className="flex h-72 items-end gap-3 border-b border-outline-variant/20 pb-6">
          {bars.map((bar) => (
            <div key={bar.label} className="flex h-full flex-1 flex-col justify-end gap-1">
              <div
                className="rounded-t-xl bg-primary/20 transition-all hover:bg-primary"
                style={{ height: `${bar.primary}%` }}
                title={`${bar.label}: ${bar.primaryLabel || bar.primary}`}
              />
              {bar.secondary ? (
                <div
                  className="rounded-t-xl bg-secondary-container transition-all hover:bg-secondary"
                  style={{ height: `${bar.secondary}%` }}
                  title={`${bar.label}: ${bar.secondaryLabel || bar.secondary}`}
                />
              ) : null}
              <span className="mt-2 text-center text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">
                {bar.label}
              </span>
            </div>
          ))}
        </div>
        {legend?.length ? (
          <div className="mt-5 flex flex-wrap justify-center gap-5">
            {legend.map((item) => (
              <span key={item.label} className="flex items-center gap-2 text-xs font-semibold text-on-surface-variant">
                <span className={cn("size-3 rounded-full", item.className)} />
                {item.label}
              </span>
            ))}
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

export function AnalyticsProgressCard({ title, description, items }) {
  return (
    <Card className="rounded-3xl border-outline-variant/20 bg-surface-container-lowest shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-on-surface">{title}</CardTitle>
        {description ? <p className="text-sm text-on-surface-variant">{description}</p> : null}
      </CardHeader>
      <CardContent className="space-y-5">
        {items.map((item) => (
          <div key={item.label} className="space-y-2">
            <div className="flex items-center justify-between gap-3 text-sm">
              <span className="font-bold text-on-surface">{item.label}</span>
              <span className="font-extrabold text-primary">{item.value}</span>
            </div>
            <Progress value={item.progress} className="h-2 bg-surface-container" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AnalyticsInsightList({ title, description, items, actionLabel, onAction }) {
  return (
    <Card className="rounded-3xl border-outline-variant/20 bg-surface-container-lowest shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="font-headline text-xl text-on-surface">{title}</CardTitle>
          {description ? <p className="mt-1 text-sm text-on-surface-variant">{description}</p> : null}
        </div>
        {actionLabel ? (
          <Button variant="outline" className="rounded-full" onClick={onAction}>
            {actionLabel}
          </Button>
        ) : null}
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-bold text-on-surface">{item.title}</p>
                <p className="mt-1 text-sm text-on-surface-variant">{item.description}</p>
              </div>
              <Badge className={cn("rounded-full", item.badgeClassName)}>{item.badge}</Badge>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export function AnalyticsTable({ title, columns, rows }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-outline-variant/20 bg-surface-container-lowest shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-on-surface">{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
              {columns.map((column) => (
                <TableHead key={column.key} className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                  {column.label}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id} className="hover:bg-surface-container-low">
                {columns.map((column) => (
                  <TableCell key={column.key} className="px-6 py-4 text-sm font-semibold text-on-surface">
                    {row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export function RatingStars({ value }) {
  return (
    <div className="flex items-center gap-0.5 text-primary">
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn("size-4", index < value ? "fill-current" : "opacity-30")}
        />
      ))}
    </div>
  );
}
