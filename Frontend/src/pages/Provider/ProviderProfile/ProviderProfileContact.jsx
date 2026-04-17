import { MessageCircle, Mail, Phone, UserSquare2 } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export default function ProviderProfileContact() {
  return (
    <Card className="rounded-[2rem] border border-outline-variant/20 bg-surface-container-lowest py-0 shadow-[0_18px_40px_rgba(25,28,30,0.04)]">
      <CardContent className="p-8">
        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <UserSquare2 className="size-5" />
          </div>
          <h2 className="font-headline text-2xl font-bold">
            Point of Contact
          </h2>
        </div>

        <div className="mb-8 flex items-center gap-4 rounded-[1.5rem] bg-surface-container-low p-4">
          <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white shadow-md">
            <img
              alt="Primary contact photo"
              className="h-full w-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFdzOgcVHvKr9YzF451dpgVfH31_khQC6EWuIT1w8bRJUlZ4-a2JfgyC0LHHVtHAZvDA04i1skCp96Mnflj145sYgez2AaPulkpUnXHqSK20NEjQuUTJlXNWpY5imjU8gtOvG72w5692-vDTMvHkF1J6AOT0kw3OuH1wcDbsGoRx6ZD5KQ6jhRNia-ySFGW-9lS2h9pt12lIJN_tzKczabM_7MWSO9hW_vX2Fid3ra-CEa47jpODTlj78MpmTIYshzAvrSXZ1K2ahs"
            />
          </div>

          <div>
            <p className="text-xl font-bold leading-none">Nguyen Minh Quang</p>
            <p className="text-sm font-semibold text-primary">
              Chief Operations Officer
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="size-4 text-on-surface-variant" />
            <p className="font-medium text-on-surface">
              quang.nguyen@skylinetours.vn
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="size-4 text-on-surface-variant" />
            <p className="font-medium text-on-surface">+84 236 3838 888</p>
          </div>

          
        </div>
      </CardContent>
    </Card>
  );
}
