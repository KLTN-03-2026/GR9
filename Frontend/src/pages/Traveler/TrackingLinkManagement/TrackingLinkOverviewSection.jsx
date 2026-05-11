import { CheckCircle2, UserRound, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrencyVND } from "@/utils/formatPrice";

const formatPrice = (value) => formatCurrencyVND(value);

export default function TrackingLinkOverviewSection({ tracking }) {
  const highlights = tracking?.highlights || [];

  return (
    <Card className="relative overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.04)]">
      <div className="absolute -right-14 -top-14 h-32 w-32 rounded-full bg-primary/5" />

      <CardContent className="p-6 md:p-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <Badge className="rounded-full bg-primary-fixed px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-on-primary-fixed-variant">
              Confirmed
            </Badge>
            <h2 className="mt-4 font-headline text-2xl font-bold">
              Booking Overview
            </h2>
          </div>

          <div className="text-left sm:text-right">
            <p className="text-sm text-on-surface-variant">Total Amount</p>
            <p className="font-headline text-3xl font-bold text-primary">
              {formatPrice(tracking?.payment?.totalAmount)}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Lead Traveler
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                <UserRound className="size-4" />
              </div>
              <div>
                <p className="font-semibold">{tracking?.traveler?.name || "-"}</p>
                <p className="text-sm text-on-surface-variant">
                  {tracking?.traveler?.email || "-"}
                </p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
              Group Size
            </p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container">
                <Users className="size-4" />
              </div>
              <div>
                <p className="font-semibold">
                  {tracking?.group?.adults || 0} Adults
                  {tracking?.group?.children ? `, ${tracking.group.children} Children` : ""}
                  {tracking?.group?.infants ? `, ${tracking.group.infants} Infants` : ""}
                </p>
                <p className="text-sm text-on-surface-variant">
                  {tracking?.group?.label || "-"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-outline-variant/20" />

        <div>
          <h3 className="mb-4 font-headline text-lg font-bold">
            Itinerary Highlights
          </h3>

          <div className="space-y-4">
            {highlights.length ? (
              highlights.map((item, index) => (
                <article
                  key={`${item.dayNumber}-${item.time}-${item.name}`}
                  className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-surface-container-low"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    {item.dayNumber}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-on-surface">{item.name}</p>
                    <p className="text-sm text-on-surface-variant">
                      Day {item.dayNumber} • {item.time}
                    </p>
                  </div>
                  {index === 0 ? (
                    <CheckCircle2 className="size-5 text-primary" />
                  ) : (
                    <div className="h-4 w-4 rounded-full border border-outline-variant" />
                  )}
                </article>
              ))
            ) : (
              <p className="text-sm text-on-surface-variant">
                No itinerary highlights available.
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
