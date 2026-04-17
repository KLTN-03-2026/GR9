import { Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function TrackingLinkPrivacyNote() {
  return (
    <Card className="rounded-[2rem] border-none bg-tertiary-container/10 py-0">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Info className="mt-0.5 size-5 shrink-0 text-tertiary" />

          <div>
            <p className="font-bold text-on-tertiary-fixed-variant">
              Privacy Note
            </p>
            <p className="mt-1 text-sm leading-relaxed text-on-tertiary-fixed-variant/80">
              Sharing your live tracking link allows anyone with the URL to see
              your current location and itinerary. Share it only with trusted
              family members and friends.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
