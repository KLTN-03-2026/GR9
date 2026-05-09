import { CalendarDays, MapPin, UserRound } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

function DetailItem({ children, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-container text-primary">
        {children}
      </div>
      <div>
        <p className="text-xs font-medium text-on-surface-variant">{label}</p>
        <p className="text-sm font-bold text-on-surface">{value}</p>
      </div>
    </div>
  );
}

export default function ReviewTourSummaryCard({
  bookingCode,
  name,
  type,
  location,
  date,
  guideName,
  guideAvatar,
  coverImage,
  highlights,
}) {
  return (
    <Card className="border-outline-variant/10 bg-surface-container-lowest shadow-[0px_20px_40px_rgba(25,28,30,0.06)]">
      <div className="relative h-40 overflow-hidden">
        <img src={coverImage} alt={name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <Badge className="absolute bottom-4 left-4 bg-white text-primary">
          Booking #{bookingCode}
        </Badge>
      </div>
      <CardContent className="space-y-6 px-6">
        <div>
          <h2 className="brand-font text-xl font-bold text-on-surface">
            {name}
          </h2>
          <p className="mt-1 text-sm text-on-surface-variant">{type}</p>
        </div>

        <div className="space-y-4">
          <DetailItem label="Destination" value={location}>
            <MapPin className="h-5 w-5" />
          </DetailItem>
          <DetailItem label="Tour Date" value={date}>
            <CalendarDays className="h-5 w-5" />
          </DetailItem>
          <DetailItem label="Tour Guide" value={guideName}>
            <UserRound className="h-5 w-5" />
          </DetailItem>
        </div>

        <div className="flex items-center gap-3 rounded-xl bg-surface-container-low p-3">
          <Avatar className="h-11 w-11">
            <AvatarImage src={guideAvatar} alt={guideName} />
            <AvatarFallback>MR</AvatarFallback>
          </Avatar>
          <div>
            <p className="text-sm font-bold text-on-surface">{guideName}</p>
            <p className="text-xs text-on-surface-variant">Lead tour guide</p>
          </div>
        </div>

        <div className="border-t border-surface-container pt-5">
          <h3 className="mb-3 text-xs font-bold uppercase tracking-widest text-on-surface-variant">
            Itinerary Highlights
          </h3>
          <ul className="space-y-3">
            {highlights.map((item) => (
              <li key={item} className="flex items-start gap-3">
                <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                <span className="text-sm text-on-surface">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
