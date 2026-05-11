import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { ChevronLeft, ChevronRight, Send } from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import {
  createReview,
  deleteReview,
  getMyReviews,
  updateReview,
} from "@/services/api/review";
import ReviewFeedbackCard from "./ReviewFeedbackCard";
import ReviewGalleryCard from "./ReviewGalleryCard";
import ReviewHero from "./ReviewHero";
import ReviewRatingCard from "./ReviewRatingCard";
import ReviewSuggestionCard from "./ReviewSuggestionCard";
import ReviewTourSummaryCard from "./ReviewTourSummaryCard";

const getRatingLabel = (rating) => {
  if (rating >= 5) return "Excellent";
  if (rating === 4) return "Great";
  if (rating === 3) return "Good";
  return "Needs attention";
};

const isValidRating = (rating) => Number(rating) >= 1 && Number(rating) <= 5;

export default function ReviewPage() {
  const [searchParams] = useSearchParams();
  const [tourRating, setTourRating] = useState(4);
  const [guideRating, setGuideRating] = useState(4);
  const [contentTour, setContentTour] = useState("");
  const [contentGuide, setContentGuide] = useState("");
  const [myReviews, setMyReviews] = useState([]);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);
  const reviewPageSize = 4;

  const tourId = searchParams.get("tourId");
  const guideId = searchParams.get("guideId") || searchParams.get("GuideId");
  const bookingId = searchParams.get("bookingId");

  const tourRatingLabel = useMemo(() => getRatingLabel(tourRating), [tourRating]);
  const guideRatingLabel = useMemo(() => getRatingLabel(guideRating), [guideRating]);
  const reviewTotalPages = Math.max(1, Math.ceil(myReviews.length / reviewPageSize));
  const visibleReviews = useMemo(
    () => myReviews.slice((reviewPage - 1) * reviewPageSize, reviewPage * reviewPageSize),
    [myReviews, reviewPage],
  );
  const reviewPageButtons = useMemo(() => {
    const maxButtons = 5;
    if (reviewTotalPages <= maxButtons) {
      return Array.from({ length: reviewTotalPages }, (_, index) => index + 1);
    }

    let start = Math.max(1, reviewPage - Math.floor(maxButtons / 2));
    let end = start + maxButtons - 1;

    if (end > reviewTotalPages) {
      end = reviewTotalPages;
      start = Math.max(1, reviewTotalPages - maxButtons + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, index) => start + index);
  }, [reviewPage, reviewTotalPages]);

  const loadMyReviews = async () => {
    try {
      const response = await getMyReviews();
      setMyReviews(response.data.data || []);
    } catch (error) {
      if (error?.response?.status !== 401) {
        toast.error(error?.response?.data?.message || "Cannot load reviews.");
      }
    }
  };

  useEffect(() => {
    loadMyReviews();
  }, []);

  useEffect(() => {
    setReviewPage((current) => Math.min(current, reviewTotalPages));
  }, [reviewTotalPages]);

  const resetForm = () => {
    setTourRating(4);
    setGuideRating(4);
    setContentTour("");
    setContentGuide("");
    setEditingReviewId(null);
  };

  const buildPayload = () => ({
    tourId,
    GuideId: guideId,
    bookingId,
    ratingTour: tourRating,
    ratingGuide: guideRating,
    contentTour: contentTour.trim(),
    contentGuide: contentGuide.trim(),
  });

  const handleSubmitReview = async () => {
    if (!tourId || !guideId || !bookingId) {
      toast.error("Thiếu thông tin tour, guide hoặc booking để gửi đánh giá.");
      return;
    }

    if (!isValidRating(tourRating) || !isValidRating(guideRating)) {
      toast.error("Điểm đánh giá tour và guide phải từ 1 đến 5 sao.");
      return;
    }

    if (contentTour.trim().length < 10 && contentGuide.trim().length < 10) {
      toast.error("Vui lòng nhập ít nhất một nội dung đánh giá từ 10 ký tự trở lên.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingReviewId) {
        await updateReview(editingReviewId, buildPayload());
        toast.success("Review updated successfully.");
      } else {
        await createReview(buildPayload());
        toast.success("Review submitted successfully.");
      }
      resetForm();
      await loadMyReviews();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cannot save review.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditReview = (review) => {
    setEditingReviewId(review._id);
    setTourRating(review.ratingTour || 4);
    setGuideRating(review.ratingGuide || 4);
    setContentTour(review.contentTour || "");
    setContentGuide(review.contentGuide || "");
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReview(reviewId);
      toast.success("Review deleted successfully.");
      if (editingReviewId === reviewId) resetForm();
      await loadMyReviews();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Cannot delete review.");
    }
  };

  return (
    <main className="relative flex min-w-0 flex-1 flex-col overflow-hidden bg-surface">
      <div className="mx-auto w-full px-6 pb-12 pt-24 md:px-10">
        <ReviewHero
          onSubmit={handleSubmitReview}
          isSubmitting={isSubmitting}
        />

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-6">
            <ReviewRatingCard
              tourName="Amalfi Coast: Hidden Coves & Limoncello"
              guideName="Marco Russo"
              tourRating={tourRating}
              tourRatingLabel={tourRatingLabel}
              guideRating={guideRating}
              guideRatingLabel={guideRatingLabel}
              onTourRatingChange={setTourRating}
              onGuideRatingChange={setGuideRating}
            />

            <ReviewFeedbackCard
              title="Tour Feedback"
              description="Tell the provider what worked well or what should be improved in the tour experience."
              placeholder="What made this tour special?"
              value={contentTour}
              onChange={(event) => setContentTour(event.target.value)}
            />

            <ReviewFeedbackCard
              title="Guide Feedback"
              description="Share feedback about guide support, communication, pacing, and local knowledge."
              placeholder="How was your guide?"
              value={contentGuide}
              onChange={(event) => setContentGuide(event.target.value)}
            />

            <ReviewGalleryCard
              uploadedCount={2}
              maxUpload={5}
              images={[
                {
                  alt: "Coastal boat",
                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuDfImALnXLMf4ysWWwk4Cg5sP8AUj6K6vsnAlZIIHNWXXk0OJfBPDYXCxA_Kja9Iwaei2P4gmWQyF3ZuD3JxKny1X9m9wkLNubCG9DkCiIlYN3ZoYMK1nJyNt-3NVUCP1xkj2qI1QPFZrfE8NE69WuCgxLx-1QatfomYIUoBpFijgz8Waqy3gFKhF-GNI7s-d8QLh41bVTuLT53tcyKjaidj3gWMOOMViGB3WJED5ebx6wUKrK-jlCjNIAaIMr91SKEGiEzawsPheQ",
                },
                {
                  alt: "Italian street",
                  src: "https://lh3.googleusercontent.com/aida-public/AB6AXuBVMbrfUkontqYIU7J8TeV7QEN0wAjLjOi8s0-brSmQcoejFiIBpA5FSgb65N6EaMea2PYyX5OZVxJQv8CrZtgA7wAFA4Iv7ujrX4YWRalssdw1fj9uozsKpmHUuAQKgLjnaKV_XSkBjwcuZOQW7GawN-z2SEsBc0E9B6Yi4ENx72UKz8q8N_6FQEeR52GOYMhBddFyLUbtIEBm66J_hLTp2YriAUx2MNWrEVFsilIo-2QanEfcNTcq1l9E40snJwVJchv60ISOkq8",
                },
              ]}
            />

            <div className="flex justify-end gap-3">
              {editingReviewId ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="rounded-xl bg-white px-6 font-semibold"
                >
                  Cancel Edit
                </Button>
              ) : null}
              <Button
                type="button"
                onClick={handleSubmitReview}
                disabled={isSubmitting}
                className="rounded-xl bg-teal-600 px-6 font-semibold text-white hover:bg-teal-700"
              >
                <Send className="mr-2 h-4 w-4" />
                {isSubmitting
                  ? "Saving..."
                  : editingReviewId
                    ? "Update Review"
                    : "Submit My Review"}
              </Button>
            </div>

            <section className="space-y-4 rounded-xl bg-surface-container-lowest p-6 shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
              <div>
                <h2 className="brand-font text-xl font-bold text-on-surface">
                  My Reviews
                </h2>
                <p className="text-sm text-on-surface-variant">
                  Manage reviews you have submitted.
                </p>
              </div>
              {myReviews.length === 0 ? (
                <p className="rounded-xl bg-surface-container-low p-4 text-sm text-on-surface-variant">
                  You have not created any reviews yet.
                </p>
              ) : (
                <div className="space-y-3">
                  {visibleReviews.map((review) => (
                    <article
                      key={review._id}
                      className="rounded-xl border border-outline-variant/10 bg-white p-4"
                    >
                      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                        <div>
                          <p className="text-sm font-bold text-on-surface">
                            {review.tourId?.name || "Tour review"}
                          </p>
                          <p className="mt-1 text-xs text-on-surface-variant">
                            Tour {review.ratingTour}/5 | Guide{" "}
                            {review.ratingGuide}/5
                          </p>
                          <p className="mt-3 text-sm text-on-surface-variant">
                            {review.contentTour || review.contentGuide || "No comment"}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => handleEditReview(review)}
                            className="rounded-lg bg-white"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="secondary"
                            onClick={() => handleDeleteReview(review._id)}
                            className="rounded-lg"
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </article>
                  ))}
                  {myReviews.length > reviewPageSize ? (
                    <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={reviewPage <= 1}
                        onClick={() => setReviewPage((current) => Math.max(1, current - 1))}
                        className="h-9 w-9 rounded-xl bg-surface-container-lowest"
                      >
                        <ChevronLeft className="size-4" />
                      </Button>
                      {reviewPageButtons.map((pageNumber) => (
                        <Button
                          key={pageNumber}
                          type="button"
                          variant={pageNumber === reviewPage ? "default" : "outline"}
                          onClick={() => setReviewPage(pageNumber)}
                          className={
                            pageNumber === reviewPage
                              ? "h-9 rounded-xl bg-primary px-3 text-primary-foreground"
                              : "h-9 rounded-xl bg-surface-container-lowest px-3"
                          }
                        >
                          {pageNumber}
                        </Button>
                      ))}
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        disabled={reviewPage >= reviewTotalPages}
                        onClick={() => setReviewPage((current) => Math.min(reviewTotalPages, current + 1))}
                        className="h-9 w-9 rounded-xl bg-surface-container-lowest"
                      >
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  ) : null}
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <ReviewTourSummaryCard
              bookingCode={bookingId || "VOY-9928"}
              name="Amalfi Coast: Hidden Coves & Limoncello"
              type="Private Luxury Expedition"
              location="Amalfi Coast, Italy"
              date="Oct 12, 2026"
              guideName="Marco Russo"
              guideAvatar="https://lh3.googleusercontent.com/aida-public/AB6AXuAjjyfwOCxDFal2BuBSYpS8NR3wcM9ls-TdjKYNIJ2rTqvDpf-H691rXKe9hTZa2HMBW0mZL9OjxpXORORc38OoQby6blRrAxzJ7P1exDbLbRIIpKF-aAFXXwcIxtA-DXPNpvk03OkKnfTdmZ3dETCcBAgoZWM7xVdspquvHIzFrS3o2c4HYQ_hE2Bd1WArqIOaAbrG6VlYV4eW6eDpMDHEvRVXLZPyZJ--4sa55V97JwAYBv6UdHNYRRY0yHWGb_Izv2GPp-NIE6A"
              coverImage="https://lh3.googleusercontent.com/aida-public/AB6AXuA48_AAmqgKMm_4GNk-rAkmN8gM7HGxC_reL7pMA5NJcATw3zx6dAUxXfPto0SmS3oCd1M8XZClMfttsTFhfTEZserlLhTZ8CceBk6ifn52StmC_hfAsA0Th3AZEppRmf8Ymse7nH0lEzQBnyoU1n2WHyLUeRS0oDhzUDVK2q9G9asqBA31kFE6t-OML6pwcIpS6fFkDGhjn69elR3wjFoDhxGsEpNhFW21ApozCkG-nNxoh_QhP4QR-ixxPOAFqUt45lm85ScJnuI"
              highlights={[
                "Private boat tour to Emerald Grotto",
                "Cliffside dining in Positano",
                "Limoncello tasting in Ravello gardens",
              ]}
            />

            <ReviewSuggestionCard
              text="Based on this trip, your next best match is a coastal food tour with flexible private dates."
              actionText="Explore similar tours"
            />
          </aside>
        </div>
      </div>
    </main>
  );
}
