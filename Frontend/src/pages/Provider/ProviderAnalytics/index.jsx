import PageHero from "@/components/shared/page-hero";
import {
  AnalyticsBarChart,
  AnalyticsInsightList,
  AnalyticsProgressCard,
  AnalyticsStatCard,
  AnalyticsTable,
} from "@/components/shared/analytics-widgets";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getProviderAnalytics } from "@/services/api/provider";
import { buildProviderAnalyticsView, providerAnalyticsStatic } from "./providerAnalytics.data";
import { RefreshCw } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

function QuickActionCard({ icon: Icon, title, description }) {
  return (
    <Card className="rounded-3xl border-outline-variant/20 bg-surface-container-lowest shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
      <CardContent className="flex items-start gap-4 p-5">
        <div className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-bold text-on-surface">{title}</p>
          <p className="mt-1 text-sm leading-6 text-on-surface-variant">{description}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProviderAnalytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const data = useMemo(() => buildProviderAnalyticsView(analytics), [analytics]);

  const loadAnalytics = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProviderAnalytics();
      setAnalytics(response?.data?.data || null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể tải analytics provider");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAnalytics();
  }, [loadAnalytics]);

  const hero = analytics ? data.hero : providerAnalyticsStatic.hero;

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto w-full space-y-6 sm:space-y-8">
        <PageHero
          eyebrow={hero.eyebrow}
          heading={
            <>
              {hero.titleA}{" "}
              <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
                {hero.titleB}
              </span>
            </>
          }
          description={hero.description}
          actions={
            <Button
              onClick={loadAnalytics}
              disabled={loading}
              className="w-full rounded-full bg-primary px-6 py-5 font-bold text-primary-foreground hover:bg-primary-container hover:text-on-primary-container disabled:opacity-70 sm:w-auto"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới dữ liệu
            </Button>
          }
          showProviderCard
        />

        {loading ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-40 rounded-3xl" />
            ))}
          </section>
        ) : null}

        {!loading ? (
          <>
        <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {data.stats.map((stat) => (
            <AnalyticsStatCard key={stat.label} {...stat} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-8">
            <AnalyticsBarChart {...data.revenueChart} />
          </div>
          <div className="xl:col-span-4">
            <AnalyticsProgressCard {...data.bookingMix} />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-6 xl:grid-cols-12">
          <div className="xl:col-span-7">
            <AnalyticsTable {...data.topTours} />
          </div>
          <div className="xl:col-span-5">
            <AnalyticsInsightList
              {...data.reviews}
              onAction={() => navigate("/provider/reviews")}
            />
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {data.quickActions.map((item) => (
            <QuickActionCard key={item.title} {...item} />
          ))}
        </section>
          </>
        ) : null}
      </div>
    </main>
  );
}
