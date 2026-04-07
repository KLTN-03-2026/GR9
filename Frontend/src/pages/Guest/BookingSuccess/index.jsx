import React, { useState } from "react";
import {
  CalendarDays,
  CheckCircle2,
  Copy,
  Download,
  Lightbulb,
  Link as LinkIcon,
  MapPin,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const trackingLink = "https://voyager.ai/track/882910-azure";

const bookingDetails = [
  {
    icon: CalendarDays,
    label: "Date & Time",
    value: "October 24, 2024 • 09:00 AM",
  },
  {
    icon: MapPin,
    label: "Meeting Point",
    value: "Voyager Private Lounge, Terminal 4",
  },
];

const qrPattern = [
  "dark",
  "dark",
  "light",
  "dark",
  "light",
  "dark",
  "dark",
  "light",
  "dark",
  "light",
  "dark",
  "dark",
  "dark",
  "dark",
  "light",
  "dark",
];

const BookingSuccess = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(trackingLink);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      setCopied(false);
    }
  };

  return (
    <div>
      <main className="mx-auto grid w-full max-w-7xl gap-8 px-6 pb-16 lg:grid-cols-12">
        <section className="space-y-8 lg:col-span-7">
          <div className="space-y-4">
            <div className="inline-flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 shadow-inner shadow-emerald-200">
              <CheckCircle2 className="size-9 fill-current stroke-[1.5]" />
            </div>
            <div className="space-y-3">
              <h1 className="max-w-2xl text-4xl font-black tracking-tight text-slate-950 md:text-5xl">
                Booking Confirmed
              </h1>
              <p className="max-w-xl text-lg leading-8 text-slate-600">
                Pack your bags! Your expedition to the{" "}
                <span className="font-bold text-emerald-700">
                  Azure Horizon
                </span>{" "}
                is officially locked in. A confirmation email has been sent to
                your inbox.
              </p>
            </div>
          </div>

          <Card className="overflow-hidden border-0 bg-white py-0 shadow-[0_24px_80px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/70">
            <CardContent className="space-y-6 p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <p className="mb-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
                    Reservation ID
                  </p>
                  <p className="text-2xl font-black tracking-tight text-slate-950">
                    #VY-882910-AZ
                  </p>
                </div>
                <span className="inline-flex w-fit items-center rounded-full bg-orange-100 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-orange-700">
                  AI Recommended
                </span>
              </div>

              <div className="space-y-4">
                {bookingDetails.map(({ icon: Icon, label, value }) => (
                  <div key={label} className="flex items-center gap-4">
                    <div className="flex size-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                      <Icon className="size-5" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">{label}</p>
                      <p className="font-semibold text-slate-900">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator className="bg-slate-200/80" />

              <div className="flex items-center justify-between gap-4">
                <span className="text-slate-500">Total Amount Paid</span>
                <span className="text-3xl font-black tracking-tight text-emerald-700">
                  $1,240.00
                </span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-slate-50/90 py-0 shadow-[0_18px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70">
            <CardContent className="space-y-6 p-8">
              <div className="flex items-start gap-4">
                <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-700 to-teal-500 text-white shadow-lg shadow-emerald-200/70">
                  <Users className="size-6" />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-black tracking-tight text-slate-950">
                    Shared Passenger Tracking Link
                  </h2>
                  <p className="leading-7 text-slate-600">
                    Keep everyone in the loop. Share this live-tracking
                    dashboard with your group members so they can follow the
                    journey in real-time.
                  </p>
                </div>
              </div>

              <div className="space-y-5">
                <div className="flex flex-col gap-3 md:flex-row">
                  <div className="relative flex-1">
                    <Input
                      readOnly
                      value={trackingLink}
                      className="h-14 rounded-2xl border-slate-200 bg-white px-4 pr-12 font-mono text-sm text-slate-700 shadow-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-100"
                    />
                    <LinkIcon className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  </div>

                  <Button
                    onClick={handleCopy}
                    className="h-14 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-500 px-8 text-white shadow-lg shadow-emerald-200 transition hover:opacity-95"
                  >
                    <Copy className="size-4" />
                    {copied ? "Copied" : "Copy Link"}
                  </Button>
                </div>

                <div className="flex flex-col items-center gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 md:flex-row">
                  <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
                    <div className="grid h-32 w-32 grid-cols-4 gap-1 overflow-hidden rounded-lg border-4 border-white bg-slate-100 p-4">
                      {qrPattern.map((cell, index) => (
                        <div
                          key={`${cell}-${index}`}
                          className={
                            cell === "dark" ? "bg-slate-800" : "bg-slate-300"
                          }
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 text-center md:text-left">
                    <p className="text-lg font-bold text-slate-900">
                      Scan to Share
                    </p>
                    <p className="max-w-md leading-7 text-slate-600">
                      Let your companions scan this QR code directly from your
                      screen for instant mobile tracking access.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-28 lg:col-span-5">
          <div className="relative overflow-hidden rounded-[28px] shadow-[0_28px_90px_rgba(15,23,42,0.18)]">
            <img
              alt="Azure Horizon"
              className="aspect-[4/5] w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuC4-uJ-PvLUyy3V5Xcghc6WHePwWWJfxOr2aCh_VVA7u7hx4p4WGrmhT6Pz9piMJR7-IvOCPOO16ZrPHWjGHySpZv4Cyy9_0WFQAUn0h1gTGrgDxDs959nlZqmFFaISeKJc79JVaz7Ql2Y9tb-eYZAxW8_7XNibWr4JABCqjK5aXwgN0V2VgrCP_AkU2WQ8ChBV2z82uOyTavylKvqE4E3d-P5PRGA_C_KW0Py1eBvwD_QAbY_YUdki9hgZmc-zcZj1lMcyVWpB2RDS"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 space-y-3 p-8 text-white">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1.5 backdrop-blur-sm">
                <Sparkles className="size-4 text-emerald-300" />
                <span className="text-xs font-bold uppercase tracking-[0.25em] text-emerald-100">
                  Voyager Exclusive
                </span>
              </div>
              <div>
                <h3 className="text-3xl font-black tracking-tight">
                  Azure Horizon Expedition
                </h3>
                <p className="mt-2 text-sm font-medium text-white/80">
                  French Polynesia • 8 Days
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-4">
            
            <Button
              variant="ghost"
              className="h-14 rounded-2xl border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            >
              <Download className="size-4" />
              Download Receipt (PDF)
            </Button>
          </div>

          <Card className="border border-orange-200/70 bg-gradient-to-br from-orange-50 to-amber-50 py-0 shadow-[0_18px_50px_rgba(245,158,11,0.10)]">
            <CardContent className="p-6">
              <div className="mb-3 flex items-center gap-2 text-orange-700">
                <Lightbulb className="size-5" />
                <span className="text-xs font-bold uppercase tracking-[0.2em]">
                  Voyager Tip
                </span>
              </div>
              <p className="leading-7 text-orange-950/80">
                The weather forecast for your destination suggests light rain on
                day 2. Don&apos;t worry, your itinerary has been automatically
                adjusted with a luxury spa afternoon.
              </p>
            </CardContent>
          </Card>
        </aside>
      </main>
    </div>
  );
};

export default BookingSuccess;
