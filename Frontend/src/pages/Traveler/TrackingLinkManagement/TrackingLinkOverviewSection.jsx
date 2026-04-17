import { CheckCircle2, UserRound, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function TrackingLinkOverviewSection() {
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
              $4,250.00
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
                <p className="font-semibold">Alexander Wright</p>
                <p className="text-sm text-on-surface-variant">
                  alex.w@example.com
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
                <p className="font-semibold">4 Adults</p>
                <p className="text-sm text-on-surface-variant">
                  Private Suite Tier
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
            <article className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-surface-container-low">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAFh3tgNtojKN3KV0ilWZk2rIobYX6kIELbau1C-uCVw-c4fevQpyh-Z6uSLU6wu0JbaPA6a-9eHi8qekfsGCNBoRoNZWGjxCOvsTZGYdFS-DWhikNq0z8Ayea5n2oqztXiR54FedHoyMoTlkFr7a6rtwBcZY3B6TbqivnN2Eqq2vdFPRdWqKDaGVBxXPbKMDLj2ymnKznsKcJmR2VBPsoTYEGcSoIkl9S1zMmEMcQhxg2M65-GYUclFaxx17TJGF7gpelGfTmPCVx7"
                alt="Private Sunset Cruise"
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-on-surface">
                  Private Sunset Cruise
                </p>
                <p className="text-sm text-on-surface-variant">
                  Day 1 • 18:00 PM
                </p>
              </div>
              <CheckCircle2 className="size-5 text-primary" />
            </article>

            <article className="flex items-center gap-4 rounded-2xl p-4 transition-colors hover:bg-surface-container-low">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAgS2I6Cgm-8k4IOx6sQWs2gsXkCnUdr5av8OWwlYDgNi0O5PvDUuvD_fHpM1ySP7uiRerl5u3_6WmWwTTTwBuNEm_Xk8RjebnMRPu6aLKYNk8Gxgqgh1y9lqceY5VJn5bVujjJhtJ0m7zIjxnqDYe9N1RVRv_fj4Q_m_Ty98ro2hL1OKrzcqD7JWniRicYn0j4KnqrYlTp0xsZetTjjYTqyQfKNnYGZreJNMVZKI4IE7hqCKbx4qZ4HszphEM37-61Sf7E1vKsjgfZ"
                alt="Oia Heritage Walk"
                className="h-12 w-12 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-on-surface">Oia Heritage Walk</p>
                <p className="text-sm text-on-surface-variant">
                  Day 2 • 09:00 AM
                </p>
              </div>
              <div className="h-4 w-4 rounded-full border border-outline-variant" />
            </article>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
