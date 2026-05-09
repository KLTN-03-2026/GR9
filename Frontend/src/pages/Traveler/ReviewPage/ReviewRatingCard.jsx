import { Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

function StaticRatingRow({ label, description, rating, ratingLabel, onChange }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 className="text-sm font-bold text-on-surface">{label}</h3>
          <p className="mt-1 text-xs text-on-surface-variant">{description}</p>
        </div>
        <Badge
          variant={rating >= 4 ? "success" : rating ? "warning" : "muted"}
          className="w-fit"
        >
          {ratingLabel}
        </Badge>
      </div>

      <div className="flex gap-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Button
            key={star}
            type="button"
            variant="ghost"
            size="icon"
            onClick={() => onChange(star)}
            className="h-10 w-10 rounded-lg hover:bg-primary/10"
            aria-label={`${star} star`}
          >
            <Star
              className={cn(
                "h-6 w-6",
                star <= rating
                  ? "fill-primary text-primary"
                  : "text-outline-variant",
              )}
            />
          </Button>
        ))}
      </div>
    </div>
  );
}

export default function ReviewRatingCard({
  tourName,
  guideName,
  tourRating,
  tourRatingLabel,
  guideRating,
  guideRatingLabel,
  onTourRatingChange,
  onGuideRatingChange,
}) {
  return (
    <Card className="border-outline-variant/10 bg-surface-container-lowest shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
      <CardHeader className="px-6">
        <CardTitle className="brand-font text-xl font-bold">
          Rate Your Experience
        </CardTitle>
        <CardDescription>
          Your ratings help us improve tour quality and guide service.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6">
        <StaticRatingRow
          label="Overall Tour Experience"
          description={tourName}
          rating={tourRating}
          ratingLabel={tourRatingLabel}
          onChange={onTourRatingChange}
        />
        <StaticRatingRow
          label="Tour Guide Performance"
          description={`Rating for ${guideName}`}
          rating={guideRating}
          ratingLabel={guideRatingLabel}
          onChange={onGuideRatingChange}
        />
      </CardContent>
    </Card>
  );
}
