import { Info } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { useI18n } from "@/i18n/I18nProvider";

export default function TrackingLinkPrivacyNote() {
  const { t } = useI18n();
  return (
    <Card className="rounded-[2rem] border-none bg-tertiary-container/10 py-0">
      <CardContent className="p-6">
        <div className="flex gap-4">
          <Info className="mt-0.5 size-5 shrink-0 text-tertiary" />

          <div>
            <p className="font-bold text-on-tertiary-fixed-variant">
              {t("trackingLink.privacyNote")}
            </p>
            <p className="mt-1 text-sm leading-relaxed text-on-tertiary-fixed-variant/80">
              {t("trackingLink.privacyText")}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
