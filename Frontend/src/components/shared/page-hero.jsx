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
        "app-page-hero relative overflow-hidden rounded-[2rem] border border-[#e8ded0] bg-[radial-gradient(circle_at_top_left,rgba(246,210,165,0.42),transparent_32%),radial-gradient(circle_at_right,rgba(11,140,135,0.12),transparent_24%),linear-gradient(135deg,rgba(255,255,255,0.94),rgba(251,247,240,0.98))] p-6 shadow-[0_24px_70px_rgba(38,33,28,0.08)] sm:p-7 md:p-8",
        className,
      )}
    >
      <div className="absolute -right-10 top-0 h-44 w-44 rounded-full bg-white/55 blur-3xl" />

      <div
        className={cn(
          "relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between",
          contentClassName,
        )}
      >
        <div className="max-w-3xl">
          {eyebrow ? (
            <div className="mb-3 text-[11px] font-black uppercase tracking-[0.3em] text-[#9f7d52]">
              {eyebrow}
            </div>
          ) : null}

          <div className="[font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[2.3rem] leading-[0.96] tracking-[-0.04em] text-[#1f2d2f] sm:text-[2.75rem] md:text-[3.55rem]">
            {heading}
          </div>

          {description ? (
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[#666a65] md:text-base">
              {description}
            </p>
          ) : null}

          {meta ? <div className="mt-5">{meta}</div> : null}
        </div>

        <div className="flex w-full flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center xl:w-auto xl:justify-end">
          {rightSlot ? rightSlot : null}

          {showProviderCard && !rightSlot ? (
            <div className="flex items-center gap-3 rounded-[22px] border border-[#e6dacb] bg-white/72 px-4 py-3 shadow-sm backdrop-blur">
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
                <p className="text-sm font-bold text-[#243437]">
                  {providerName}
                </p>
                <p className="text-xs font-medium text-[#6f7069]">
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
