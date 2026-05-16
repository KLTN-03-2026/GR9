import {
  ArrowUpRight,
  CalendarRange,
  MapPinned,
  ShieldCheck,
  Star,
} from "lucide-react";

import authBayVertical from "@/assets/redesign/auth-bay-vertical.png";
import BrandLogo from "@/components/shared/brand-logo";
import { useI18n } from "@/i18n/I18nProvider";
import { buildAuthCopy } from "@/pages/Auth/auth-copy";

export default function AuthFeaturePanel({
  badge,
  title,
  description,
  image = authBayVertical,
  journeyLabel,
  journeyTitle,
  journeyDates,
  stats = [],
  quote,
  quoteAuthor,
}) {
  const { language } = useI18n();
  const copy = buildAuthCopy(language).featurePanel;

  return (
    <section className="relative hidden min-h-screen overflow-hidden lg:block">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(18,16,14,0.12)_0%,rgba(18,16,14,0.26)_36%,rgba(18,16,14,0.68)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,241,220,0.18),transparent_36%),radial-gradient(circle_at_bottom_left,rgba(12,92,90,0.18),transparent_32%)]" />

      <div className="relative z-10 flex min-h-screen flex-col justify-between p-8 xl:p-11">
        <div className="flex items-start justify-between gap-4">
          <BrandLogo light className="gap-3" iconClassName="size-10" showTagline />
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span className="rounded-full border border-white/18 bg-white/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.24em] text-white/78 backdrop-blur-xl">
              {badge}
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-black/10 px-3.5 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/72 backdrop-blur-xl">
              <ShieldCheck className="size-3.5" />
              {copy.protectedAccess}
            </span>
          </div>
        </div>

        <div className="max-w-[430px]">
          <h2 className="max-w-[390px] [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[3rem] leading-[0.96] tracking-[-0.045em] text-white xl:text-[3.45rem]">
            {title}
          </h2>
          <p className="mt-4 max-w-[360px] text-[0.95rem] leading-7 text-white/74">
            {description}
          </p>

          <div className="mt-8 grid gap-3 xl:grid-cols-[1.05fr_0.95fr]">
            <div className="rounded-[26px] border border-white/14 bg-white/10 p-4 shadow-[0_24px_60px_rgba(0,0,0,0.18)] backdrop-blur-2xl">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/58">
                    {journeyLabel}
                  </p>
                  <h3 className="mt-2.5 text-[1.45rem] leading-tight [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-white">
                    {journeyTitle}
                  </h3>
                </div>
                <ArrowUpRight className="size-4.5 text-white/82" />
              </div>

              <div className="mt-4 flex items-center gap-3 rounded-[18px] bg-black/10 px-3.5 py-2.5 text-sm text-white/82">
                <CalendarRange className="size-4 text-white/74" />
                <span>{journeyDates}</span>
              </div>

              <div className="mt-3 flex items-center gap-3 rounded-[18px] bg-black/10 px-3.5 py-2.5 text-sm text-white/76">
                <MapPinned className="size-4 text-white/74" />
                {copy.refinedBy}
              </div>
            </div>

            <div className="grid gap-3">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[22px] border border-white/12 bg-black/10 px-4 py-3.5 backdrop-blur-xl"
                >
                  <p className="text-[1.5rem] leading-none [font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-white">
                    {item.value}
                  </p>
                  <p className="mt-1.5 text-[10px] uppercase tracking-[0.16em] text-white/56">
                    {item.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-[440px]">
          <div className="rounded-[26px] border border-white/14 bg-white/10 p-5 backdrop-blur-2xl">
            <div className="flex items-center gap-1 text-[#f5d591]">
              {Array.from({ length: 5 }).map((_, index) => (
                <Star key={index} className="size-4 fill-current" />
              ))}
            </div>
            <p className="mt-3.5 text-[0.95rem] leading-7 text-white/84">
              "{quote}"
            </p>
            <div className="mt-4 flex items-center justify-between gap-4 border-t border-white/12 pt-3.5 text-sm text-white/64">
              <span>{quoteAuthor}</span>
              <span className="inline-flex items-center gap-2">
                <MapPinned className="size-4" />
                {copy.verifiedTraveler}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
