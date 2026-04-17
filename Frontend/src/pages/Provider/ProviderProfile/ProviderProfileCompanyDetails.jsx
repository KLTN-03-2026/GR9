import { Building2, Globe, MapPin, ShieldCheck } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function ProviderProfileCompanyDetails() {
  return (
    <Card className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest py-0 shadow-[0_18px_40px_rgba(25,28,30,0.04)] transition-shadow duration-300 hover:shadow-[0_24px_50px_rgba(25,28,30,0.08)]">
      <CardContent className="p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Building2 className="size-5" />
          </div>
          <h2 className="font-headline text-2xl font-bold">Company Details</h2>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              Legal Name
            </p>
            <p className="text-lg font-semibold">Skyline Tours Co., Ltd</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              Website
            </p>
            <div className="flex items-center gap-2">
              <Globe className="size-4 text-primary" />
              <p className="text-lg font-semibold text-primary">
                www.skylinetours.vn
              </p>
            </div>
          </div>

          <div className="space-y-1 md:col-span-2">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              Headquarters
            </p>
            <div className="flex items-start gap-2">
              <MapPin className="mt-1 size-4 text-on-surface-variant" />
              <p className="text-lg font-semibold">
                123 Vo Nguyen Giap St, Son Tra District, Da Nang, Vietnam
              </p>
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60">
              Business License Number
            </p>
            <div className="flex items-center gap-2">
              <span className="text-lg font-mono font-bold tracking-tight">
                DN-99482-STA-2024
              </span>
              <ShieldCheck className="size-4 text-teal-600" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
