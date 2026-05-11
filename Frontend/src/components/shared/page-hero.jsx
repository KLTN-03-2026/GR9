import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const DEFAULT_PROVIDER_AVATAR =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC8R7F4kWyZXkBFYRNJ-5cTQabufPxmyzPYbMvhuuW0qOWkqSWA-LpIl7TaWMmC_7vatf2TetuAKpSW-aZK51As1jmjhlfp-IVQ4nGyfR_tjRlCNcrmlpVn_aRDJXiCD2Lac7x-jEz0I95CduYESBTiStix3ZYBa5lS00as3zthRvQpbiYVp_HJ1RmVkugRa-5fhn7VS_1HH5P6Fv8c9cCzp8W86O_4O4reI-xOvXjKG0LBFrcsO6dfW8kvBaip3YeExOFsHzmEDIw6";

export default function PageHero({
  eyebrow,
  heading,
  description,
  actions,
  rightSlot,
  meta,
  showProviderCard = false,
  providerName = "Skyline Tours",
  providerLabel = "Verified Provider",
  providerAvatar = DEFAULT_PROVIDER_AVATAR,
  className,
  contentClassName,
}) {
  return (
    <section
      className={cn(
        "app-page-hero relative overflow-hidden rounded-[2rem] bg-[radial-gradient(circle_at_top_left,_rgba(0,104,95,0.16),_transparent_35%),linear-gradient(135deg,_#ffffff,_#eef7f5)] p-6 shadow-[0_20px_50px_rgba(15,23,42,0.06)] ring-1 ring-slate-200/70 md:p-8 dark:shadow-[0_24px_70px_rgba(0,0,0,0.28)] dark:ring-white/10",
        className,
      )}
    >
      <div className="absolute right-0 top-0 h-44 w-44 rounded-full bg-primary/15 blur-3xl" />
      <div
        className={cn(
          "relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between",
          contentClassName,
        )}
      >
        <div className="max-w-2xl">
          {eyebrow ? (
            <div className="mb-3 text-[11px] font-bold uppercase tracking-[0.3em] text-primary">
              {eyebrow}
            </div>
          ) : null}
          <div className="font-headline text-4xl font-extrabold tracking-tight text-on-surface md:text-5xl">
            {heading}
          </div>
          {description ? (
            <p className="mt-3 max-w-xl text-sm leading-6 text-on-surface-variant md:text-base">
              {description}
            </p>
          ) : null}
          {meta ? <div className="mt-5">{meta}</div> : null}
        </div>

        <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
          {rightSlot ? rightSlot : null}
          {showProviderCard && !rightSlot ? (
            <div className="flex items-center gap-3 rounded-2xl bg-surface-container-lowest/85 px-4 py-3 shadow-sm ring-1 ring-outline-variant/25 backdrop-blur">
              <Avatar className="h-10 w-10">
                <AvatarImage src={providerAvatar} alt={providerName} />
                <AvatarFallback>
                  {providerName
                    .split(" ")
                    .slice(0, 2)
                    .map((word) => word[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-bold text-on-surface">
                  {providerName}
                </p>
                <p className="text-xs font-medium text-on-surface-variant">
                  {providerLabel}
                </p>
              </div>
            </div>
          ) : null}
          {actions ? actions : null}
        </div>
      </div>
    </section>
  );
}
