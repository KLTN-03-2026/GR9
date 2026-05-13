import PageHero from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getProviderReviews } from "@/services/api/review";
import { useI18n } from "@/i18n/I18nProvider";
import { RefreshCw, Star } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

function RatingPill({ value }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
      <Star className="size-3.5 fill-current" />
      {Number(value || 0).toFixed(1)}
    </span>
  );
}

function ReviewSummaryCard({ label, value, helper }) {
  return (
    <Card className="rounded-3xl border-outline-variant/20 bg-surface-container-lowest shadow-sm">
      <CardContent className="p-5">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
          {label}
        </p>
        <p className="mt-2 font-headline text-3xl font-extrabold text-on-surface">
          {value}
        </p>
        <p className="mt-2 text-sm text-on-surface-variant">{helper}</p>
      </CardContent>
    </Card>
  );
}

const formatDate = (value, locale) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat(locale).format(date);
};

function ProviderReviewTable({ reviews, t, locale }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-outline-variant/20 bg-surface-container-lowest shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-on-surface">
          {t("provider.reviews.listTitle")}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("provider.reviews.traveler")}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("provider.reviews.tour")}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("provider.reviews.rating")}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("provider.reviews.content")}
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                {t("provider.reviews.date")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.length ? (
              reviews.map((review) => (
                <TableRow key={review._id} className="hover:bg-surface-container-low">
                  <TableCell className="px-6 py-4">
                    <div>
                      <p className="font-bold text-on-surface">
                        {review.reviewerId?.fullName || "Traveler"}
                      </p>
                      <p className="text-xs text-on-surface-variant">
                        {review.reviewerId?.email || t("provider.reviews.noEmail")}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="font-semibold text-on-surface">
                      {review.tourId?.name || "Tour"}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {review.tourId?.location || t("provider.reviews.noLocation")}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <RatingPill value={review.ratingTour} />
                      <span className="text-xs text-on-surface-variant">
                        {t("provider.reviews.guide")}: {Number(review.ratingGuide || 0).toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md px-6 py-4">
                    <p className="line-clamp-2 text-sm text-on-surface">
                      {review.contentTour || t("provider.reviews.noTourComment")}
                    </p>
                    {review.contentGuide ? (
                      <p className="mt-1 line-clamp-1 text-xs text-on-surface-variant">
                        {t("provider.reviews.guide")}: {review.contentGuide}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-semibold text-on-surface-variant">
                    {formatDate(review.createdAt, locale)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-on-surface-variant">
                  {t("provider.reviews.empty")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function ProviderReviewManagement() {
  const { language, t } = useI18n();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const locale = language === "vi" ? "vi-VN" : "en-US";

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProviderReviews();
      setReviews(response?.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || t("provider.reviews.loadError"));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadReviews();
  }, [loadReviews]);

  const summary = useMemo(() => {
    const total = reviews.length;
    const averageTour = total
      ? reviews.reduce((sum, item) => sum + (Number(item.ratingTour) || 0), 0) / total
      : 0;
    const averageGuide = total
      ? reviews.reduce((sum, item) => sum + (Number(item.ratingGuide) || 0), 0) / total
      : 0;

    return {
      total,
      averageTour: averageTour.toFixed(1),
      averageGuide: averageGuide.toFixed(1),
    };
  }, [reviews]);

  return (
    <main className="min-h-screen bg-surface text-on-surface">
      <div className="mx-auto w-full space-y-6 sm:space-y-8">
        <PageHero
          eyebrow={t("provider.reviews.heroEyebrow")}
          heading={
            <>
              {t("provider.reviews.titleA")}{" "}
              <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
                {t("provider.reviews.titleB")}
              </span>
            </>
          }
          description={t("provider.reviews.description")}
          actions={
            <Button
              onClick={loadReviews}
              disabled={loading}
              className="w-full rounded-full bg-primary px-6 py-5 font-bold text-primary-foreground hover:bg-primary-container hover:text-on-primary-container sm:w-auto"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              {t("provider.reviews.refresh")}
            </Button>
          }
        />

        {loading ? (
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-3xl" />
            ))}
          </section>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
              <ReviewSummaryCard
                label={t("provider.reviews.totalReviews")}
                value={summary.total}
                helper={t("provider.reviews.totalReviewsHelper")}
              />
              <ReviewSummaryCard
                label={t("provider.reviews.tourRating")}
                value={summary.averageTour}
                helper={t("provider.reviews.tourRatingHelper")}
              />
              <ReviewSummaryCard
                label={t("provider.reviews.guideRating")}
                value={summary.averageGuide}
                helper={t("provider.reviews.guideRatingHelper")}
              />
            </section>

            <ProviderReviewTable reviews={reviews} t={t} locale={locale} />
          </>
        )}
      </div>
    </main>
  );
}
