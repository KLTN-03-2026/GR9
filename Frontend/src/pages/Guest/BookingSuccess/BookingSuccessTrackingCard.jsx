import { Copy, Link as LinkIcon, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function BookingSuccessTrackingCard({ booking }) {
  const trackingUrl = booking?.tracking?.url || "";
  const trackingCode = booking?.tracking?.code || "";
  const publicTrackingUrl = trackingCode
    ? `${window.location.origin}/guest?trackingCode=${encodeURIComponent(trackingCode)}`
    : trackingUrl;
  const qrCodeUrl = publicTrackingUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=10&ecc=H&data=${encodeURIComponent(
        publicTrackingUrl,
      )}`
    : "";

  const copyTrackingLink = async () => {
    if (!publicTrackingUrl) return;

    await navigator.clipboard.writeText(publicTrackingUrl);
    toast.success("Đã copy link tracking");
  };

  return (
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
              Keep everyone in the loop. Share this live-tracking dashboard
              with your group members so they can follow the journey in
              real-time.
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Input
                readOnly
                value={publicTrackingUrl}
                className="h-14 rounded-2xl border-slate-200 bg-white px-4 pr-12 font-mono text-sm text-slate-700 shadow-sm focus-visible:border-emerald-500 focus-visible:ring-emerald-100"
              />
              <LinkIcon className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
            </div>

            <Button
              type="button"
              onClick={copyTrackingLink}
              className="h-14 rounded-2xl bg-gradient-to-r from-emerald-700 to-teal-500 px-8 text-white shadow-lg shadow-emerald-200 transition hover:opacity-95"
            >
              <Copy className="size-4" />
              Copy Link
            </Button>
          </div>

          <div className="flex flex-col items-center gap-8 rounded-3xl bg-white p-6 shadow-sm ring-1 ring-slate-200/70 md:flex-row">
            <div className="rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-200">
              {qrCodeUrl ? (
                <img
                  alt="Tracking QR code"
                  className="h-40 w-40 rounded-lg border-4 border-white bg-white object-cover"
                  src={qrCodeUrl}
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-slate-100 text-center text-xs font-semibold text-slate-500">
                  QR not available
                </div>
              )}
            </div>

            <div className="space-y-2 text-center md:text-left">
              <p className="text-lg font-bold text-slate-900">Scan to Share</p>
              <p className="max-w-md leading-7 text-slate-600">
                Let your companions scan this QR code directly from your screen
                for instant mobile tracking access.
              </p>
              {publicTrackingUrl ? (
                <Button asChild variant="link" className="h-auto px-0 font-bold text-emerald-700">
                  <Link to={`/guest?trackingCode=${encodeURIComponent(trackingCode)}`}>
                    Open public tracking
                  </Link>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
