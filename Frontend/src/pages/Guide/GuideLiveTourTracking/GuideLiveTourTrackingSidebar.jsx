import { Phone, Plus, Stethoscope, ZoomIn, ZoomOut } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function GuideLiveTourTrackingSidebar() {
  return (
    <div className="w-full space-y-6 md:w-[400px]">
      <Card className="overflow-hidden rounded-xl border border-outline-variant/10 py-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between border-b border-outline-variant/10 px-4 py-4">
          <CardTitle className="font-headline text-base font-bold text-on-surface">
            Live Tracking Map
          </CardTitle>
          <span className="rounded bg-teal-50 px-2 py-0.5 text-[10px] font-bold text-teal-600">
            GPS ACTIVE
          </span>
        </CardHeader>

        <CardContent className="relative h-64 p-0">
          <img
            alt="Modern minimalist map interface showing a tropical island with a teal route line and a pulsing guide location marker"
            className="h-full w-full object-cover grayscale-[0.2]"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZEiBR5evS2evQowx9eAJx1ypkkOToHcNRM6E24XelYO27Ep8Hup9QE51bAZ55hsusf0UmY8qW7Q-Ad8go_R9b5gT4tpmXDoP4hLyjmtBGzNwbm_c7GX-HITnRdfwIL0WhpqDfXEus4io7OY1S6ZwUV-5t7rhJcbDzFwlG_nAYXfz2PtgQWVeUK2exvHo7D8cjq1TR-cbLc-oPPapJwfoR1Dg0sUy69kSsKchQJPFQnhb82E4-VLgW3AzDQoTIPzweV5LfOYsjZvTG"
          />
          <div className="pointer-events-none absolute inset-0 bg-primary/5" />

          <div className="absolute right-4 top-4 flex flex-col gap-2 rounded-lg bg-white p-2 shadow-lg">
            <Button
              className="rounded-lg border border-transparent bg-surface-container-low shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/10 hover:bg-white hover:shadow-lg active:translate-y-0"
              size="icon-sm"
              variant="ghost"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              className="rounded-lg border border-transparent bg-surface-container-low shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/10 hover:bg-white hover:shadow-lg active:translate-y-0"
              size="icon-sm"
              variant="ghost"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-xl border border-outline-variant/10 py-0 shadow-sm">
        <CardHeader className="border-b border-outline-variant/10 px-4 py-4">
          <CardTitle className="font-headline text-base font-bold text-on-surface">
            Passenger Notifications
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4 p-4">
          <div className="flex flex-wrap gap-2">
            <Button
              className="rounded-full border border-transparent bg-secondary-container px-4 py-2 text-xs font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/15 hover:bg-white hover:text-secondary hover:shadow-lg active:translate-y-0"
              variant="ghost"
            >
              We are on the way
            </Button>
            <Button
              className="rounded-full border border-transparent bg-secondary-container px-4 py-2 text-xs font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/15 hover:bg-white hover:text-secondary hover:shadow-lg active:translate-y-0"
              variant="ghost"
            >
              Arrived at dock
            </Button>
            <Button
              className="rounded-full border border-transparent bg-secondary-container px-4 py-2 text-xs font-bold shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-secondary/15 hover:bg-white hover:text-secondary hover:shadow-lg active:translate-y-0"
              variant="ghost"
            >
              Lunch is ready
            </Button>
          </div>

          <Separator className="bg-outline-variant/10" />

          <div>
            <p className="mb-3 text-[10px] font-bold uppercase text-on-surface-variant">
              Emergency Contacts
            </p>

            <div className="space-y-3">
              <div className="flex items-center justify-between rounded-xl border border-error/10 bg-error-container/20 p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-error/10 text-error">
                    <Phone className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-on-surface">
                      Operations Desk
                    </p>
                    <p className="text-[10px] font-medium text-on-surface-variant">
                      Priority Support
                    </p>
                  </div>
                </div>

                <Button
                  className="rounded-full border border-transparent bg-transparent text-error shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-error/10 hover:bg-white hover:shadow-lg active:translate-y-0"
                  size="icon-sm"
                  variant="ghost"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-outline-variant/10 bg-surface-container-low p-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-on-secondary-container/10 text-on-secondary-container">
                    <Stethoscope className="h-4 w-4" />
                  </div>

                  <div>
                    <p className="text-xs font-bold text-on-surface">
                      Local Medical
                    </p>
                    <p className="text-[10px] font-medium text-on-surface-variant">
                      +960 333-5335
                    </p>
                  </div>
                </div>

                <Button
                  className="rounded-full border border-transparent bg-transparent text-on-surface-variant shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/10 hover:bg-white hover:text-primary hover:shadow-lg active:translate-y-0"
                  size="icon-sm"
                  variant="ghost"
                >
                  <Phone className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
