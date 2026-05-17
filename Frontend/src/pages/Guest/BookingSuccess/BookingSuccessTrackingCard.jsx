import { Copy, Link as LinkIcon, Users } from "lucide-react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/i18n/I18nProvider";

export default function BookingSuccessTrackingCard({ booking }) {
  const { t } = useI18n();
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
    toast.success(t("bookingSuccessPage.copiedLink"));
  };

  return (
    <Card className="overflow-hidden rounded-[30px] border border-[#e8ded0] bg-white/[0.92] py-0 shadow-[0_24px_70px_rgba(38,33,28,0.08)] dark:border-white/12 dark:bg-surface-container-lowest dark:shadow-none">
      <CardContent className="space-y-6 p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex size-14 shrink-0 items-center justify-center rounded-[18px] bg-[#0b8c87] text-white shadow-[0_16px_32px_rgba(11,140,135,0.18)] dark:bg-primary dark:text-primary-foreground">
            <Users className="size-6" />
          </div>
          <div className="space-y-1.5">
            <h2 className="[font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2rem] leading-tight tracking-[-0.03em] text-[#243437] dark:text-on-surface">
              {t("bookingSuccessPage.sharedTrackingTitle")}
            </h2>
            <p className="leading-7 text-[#666a65] dark:text-on-surface-variant">
              {t("bookingSuccessPage.sharedTrackingDescription")}
            </p>
          </div>
        </div>

        <div className="space-y-5">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative flex-1">
              <Input
                readOnly
                value={publicTrackingUrl}
                className="h-14 rounded-[20px] border border-[#e6dac9] bg-[#fcfaf6] px-4 pr-12 font-mono text-sm text-[#556063] shadow-none focus-visible:border-[#0b8c87] focus-visible:ring-[#0b8c87]/10 dark:border-white/12 dark:bg-surface-container dark:text-on-surface"
              />
              <LinkIcon className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-[#8b857c] dark:text-on-surface-variant" />
            </div>

            <Button
              type="button"
              onClick={copyTrackingLink}
              className="h-14 rounded-full bg-[#0b8c87] px-8 text-white shadow-[0_16px_32px_rgba(11,140,135,0.18)] hover:bg-[#09726e] dark:bg-primary dark:text-primary-foreground dark:hover:bg-primary/90"
            >
              <Copy className="size-4" />
              {t("bookingSuccessPage.copyLink")}
            </Button>
          </div>

          <div className="flex flex-col items-center gap-8 rounded-[26px] border border-[#ece2d6] bg-[#fbf8f2] p-6 dark:border-white/12 dark:bg-surface-container md:flex-row">
            <div className="rounded-[20px] bg-white p-4 ring-1 ring-[#ebe0d2] dark:bg-white dark:ring-white/12">
              {qrCodeUrl ? (
                <img
                  alt={t("bookingSuccessPage.qrAlt")}
                  className="h-40 w-40 rounded-lg border-4 border-white bg-white object-cover"
                  src={qrCodeUrl}
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-[#f2eee7] text-center text-xs font-semibold text-[#75726c] dark:bg-surface-container-high dark:text-on-surface-variant">
                  {t("bookingSuccessPage.qrUnavailable")}
                </div>
              )}
            </div>

            <div className="space-y-2 text-center md:text-left">
              <p className="text-lg font-bold text-[#243437] dark:text-on-surface">
                {t("bookingSuccessPage.scanToShare")}
              </p>
              <p className="max-w-md leading-7 text-[#666a65] dark:text-on-surface-variant">
                {t("bookingSuccessPage.scanDescription")}
              </p>
              {publicTrackingUrl ? (
                <Button
                  asChild
                  variant="link"
                  className="h-auto px-0 font-bold text-[#0b8c87] dark:text-primary"
                >
                  <Link to={`/guest?trackingCode=${encodeURIComponent(trackingCode)}`}>
                    {t("bookingSuccessPage.openPublicTracking")}
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
