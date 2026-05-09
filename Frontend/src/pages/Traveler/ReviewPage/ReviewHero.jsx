import { CheckCircle2, Send } from "lucide-react";

import PageHero from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ReviewHero({ onSubmit, isSubmitting }) {
  return (
    <PageHero
      className="mb-8"
      eyebrow="Traveler Review"
      heading={
        <>
          Share your{" "}
          <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
            experience
          </span>
        </>
      }
      description="Rate your completed tour, leave feedback for the provider, and add trip photos for future travelers."
      actions={
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitting}
          className="rounded-xl bg-teal-600 px-5 font-semibold hover:bg-teal-700"
        >
          <Send className="mr-2 h-4 w-4" />
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </Button>
      }
      rightSlot={
        <Badge className="w-fit bg-primary/10 px-3 py-1 text-primary">
          <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
          Journey Complete
        </Badge>
      }
    />
  );
}
