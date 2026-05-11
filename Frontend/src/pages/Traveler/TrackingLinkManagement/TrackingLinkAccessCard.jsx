import { Copy, LocateFixed, RefreshCcw, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

export default function TrackingLinkAccessCard({ tracking, onRegenerate }) {
  const { t } = useI18n();
  const trackingUrl = tracking?.trackingUrl || "";

  const copyLink = async () => {
    if (!trackingUrl) return;
    await navigator.clipboard.writeText(trackingUrl);
  };

  return (
    <Card className="overflow-hidden rounded-[2rem] border-none bg-surface-container-lowest py-0 shadow-[0_20px_40px_rgba(25,28,30,0.06)]">
      <CardHeader className="px-6 pt-6 md:px-8">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-tertiary-container/10 text-tertiary">
            <LocateFixed className="size-5" />
          </div>

          <div>
            <CardTitle className="font-headline text-xl font-bold">
              {t("trackingLink.sharedAccess")}
            </CardTitle>
            <p className="text-sm text-on-surface-variant">
              {t("trackingLink.sharedAccessText")}
            </p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 px-6 pb-6 md:px-8">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.22em] text-on-surface-variant">
            {t("trackingLink.publicLink")}
          </p>

          <div className="flex items-center gap-2">
            <code className="min-w-0 flex-1 truncate font-mono text-sm font-bold text-primary">
              {trackingUrl || t("trackingLink.noLink")}
            </code>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="rounded-xl text-on-surface-variant hover:bg-white"
              title={t("trackingLink.copyLink")}
              onClick={copyLink}
              disabled={!trackingUrl}
            >
              <Copy className="size-4" />
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            type="button"
            className="h-12 flex-1 rounded-2xl bg-gradient-to-br from-primary to-primary-container font-bold text-on-primary shadow-lg shadow-primary/20"
            onClick={copyLink}
            disabled={!trackingUrl}
          >
            {t("trackingLink.copyLink")}
          </Button>
          <Button
            type="button"
            variant="secondary"
            className="h-12 rounded-2xl bg-secondary-container px-5 font-bold text-on-secondary-container"
            onClick={onRegenerate}
            disabled={!tracking?.bookingId}
          >
            <RefreshCcw className="size-4" />
            {t("trackingLink.regenerate")}
          </Button>
        </div>
      </CardContent>

      <div className="bg-surface-container-low/50 px-6 py-6 md:px-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 size-5 text-on-surface-variant" />
            <div>
              <p className="font-bold">{t("trackingLink.phoneVerification")}</p>
              <p className="text-xs leading-relaxed text-on-surface-variant">
                {t("trackingLink.phoneVerificationText")}
              </p>
            </div>
          </div>

          <div className="relative h-7 w-13 shrink-0 rounded-full bg-primary">
            <span className="absolute left-7 top-1 h-5 w-5 rounded-full bg-white" />
          </div>
        </div>
      </div>
    </Card>
  );
}
