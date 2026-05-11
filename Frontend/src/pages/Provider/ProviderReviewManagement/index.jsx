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

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return new Intl.DateTimeFormat("vi-VN").format(date);
};

function ProviderReviewTable({ reviews }) {
  return (
    <Card className="overflow-hidden rounded-3xl border-outline-variant/20 bg-surface-container-lowest shadow-sm">
      <CardHeader>
        <CardTitle className="font-headline text-xl text-on-surface">
          Danh sách review
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="bg-surface-container-low hover:bg-surface-container-low">
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Traveler
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Tour
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Rating
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Nội dung
              </TableHead>
              <TableHead className="px-6 py-4 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                Ngày
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
                        {review.reviewerId?.email || "Không có email"}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <p className="font-semibold text-on-surface">
                      {review.tourId?.name || "Tour"}
                    </p>
                    <p className="text-xs text-on-surface-variant">
                      {review.tourId?.location || "Chưa có địa điểm"}
                    </p>
                  </TableCell>
                  <TableCell className="px-6 py-4">
                    <div className="flex flex-col gap-2">
                      <RatingPill value={review.ratingTour} />
                      <span className="text-xs text-on-surface-variant">
                        Guide: {Number(review.ratingGuide || 0).toFixed(1)}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-md px-6 py-4">
                    <p className="line-clamp-2 text-sm text-on-surface">
                      {review.contentTour || "Traveler chưa ghi nhận xét cho tour."}
                    </p>
                    {review.contentGuide ? (
                      <p className="mt-1 line-clamp-1 text-xs text-on-surface-variant">
                        Guide: {review.contentGuide}
                      </p>
                    ) : null}
                  </TableCell>
                  <TableCell className="px-6 py-4 text-sm font-semibold text-on-surface-variant">
                    {formatDate(review.createdAt)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center text-on-surface-variant">
                  Chưa có review nào cho các tour của provider.
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
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadReviews = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getProviderReviews();
      setReviews(response?.data?.data || []);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Không thể tải review provider");
    } finally {
      setLoading(false);
    }
  }, []);

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
      <div className="mx-auto w-full space-y-8">
        <PageHero
          eyebrow="PROVIDER REVIEWS"
          heading={
            <>
              Quản lý{" "}
              <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
                review
              </span>
            </>
          }
          description="Theo dõi đánh giá thật của traveler cho tour và guide thuộc provider của bạn."
          actions={
            <Button
              onClick={loadReviews}
              disabled={loading}
              className="rounded-full bg-primary px-6 py-5 font-bold text-primary-foreground hover:bg-primary-container hover:text-on-primary-container"
            >
              <RefreshCw className={`size-4 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </Button>
          }
        />

        {loading ? (
          <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-32 rounded-3xl" />
            ))}
          </section>
        ) : (
          <>
            <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
              <ReviewSummaryCard
                label="Tổng review"
                value={summary.total}
                helper="Tất cả review thuộc tour của provider"
              />
              <ReviewSummaryCard
                label="Rating tour"
                value={summary.averageTour}
                helper="Điểm trung bình cho trải nghiệm tour"
              />
              <ReviewSummaryCard
                label="Rating guide"
                value={summary.averageGuide}
                helper="Điểm trung bình cho hướng dẫn viên"
              />
            </section>

            <ProviderReviewTable reviews={reviews} />
          </>
        )}
      </div>
    </main>
  );
}
