import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const plannerHeroImage =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCNjl0WISrZSDpHMkNOBIB-DUEvoLWVmXyI-Cn8_s49hdbo-wvLeDe3uWP_1lsg4vyS5B3hSU7ckGSjgup1NO_F_lrxIsnRPeSlduSq_Z0-9GpI4oojraQy3FaVTcg54y93kAeVOSVz_mH-r1tA1sJFDnGjg2e7XnH6yhbrwMF-weLN_PGK8PZW4XCS5xXFLXJ13RoM4uQLXod4pteW2hnQp5DwKsGw89o4TVGyKsnAPQTrknmbrdxVHQTA67dwep3GO9wl2V9jd0Xc";

function PlannerResultHeader({ itinerary }) {
  if (!itinerary) {
    return (
      <div className="relative h-full min-h-[calc(100vh-4rem)] overflow-hidden">
        <style>{`
          @keyframes plannerHeroFadeUp {
            from {
              opacity: 0;
              transform: translate3d(0, 34px, 0) scale(0.975);
              filter: blur(10px);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0) scale(1);
              filter: blur(0);
            }
          }

          @keyframes plannerHeroFloat {
            0% {
              transform: translate3d(0, 0, 0) scale(1);
            }
            50% {
              transform: translate3d(0, -8px, 0) scale(1.012);
            }
            100% {
              transform: translate3d(0, 0, 0) scale(1);
            }
          }

          @keyframes plannerHeroGlow {
            0% {
              text-shadow:
                0 6px 24px rgba(0, 0, 0, 0.22),
                0 0 0 rgba(255, 214, 153, 0);
            }
            50% {
              text-shadow:
                0 14px 38px rgba(0, 0, 0, 0.28),
                0 0 28px rgba(255, 214, 153, 0.2);
            }
            100% {
              text-shadow:
                0 6px 24px rgba(0, 0, 0, 0.22),
                0 0 0 rgba(255, 214, 153, 0);
            }
          }

          @keyframes plannerHeroSheen {
            0% {
              transform: translateX(-140%) skewX(-14deg);
              opacity: 0;
            }
            18% {
              opacity: 0.08;
            }
            32% {
              opacity: 0.22;
            }
            48% {
              transform: translateX(145%) skewX(-14deg);
              opacity: 0;
            }
            100% {
              transform: translateX(145%) skewX(-14deg);
              opacity: 0;
            }
          }

          @keyframes plannerHeroChromatic {
            0% {
              background-position: 0% 50%;
              filter: saturate(1) brightness(1);
            }
            50% {
              background-position: 100% 50%;
              filter: saturate(1.18) brightness(1.08);
            }
            100% {
              background-position: 0% 50%;
              filter: saturate(1) brightness(1);
            }
          }

          @keyframes plannerHeroImageDrift {
            0% {
              transform: scale(1.08) translate3d(0%, 0%, 0);
            }
            50% {
              transform: scale(1.15) translate3d(-1.5%, -1%, 0);
            }
            100% {
              transform: scale(1.09) translate3d(1%, 1.5%, 0);
            }
          }

          @keyframes plannerHeroOrbPulse {
            0% {
              opacity: 0.2;
              transform: scale(0.92);
            }
            50% {
              opacity: 0.42;
              transform: scale(1.06);
            }
            100% {
              opacity: 0.24;
              transform: scale(0.96);
            }
          }

          @keyframes plannerHeroHudFloat {
            0% {
              transform: translate3d(0, 0, 0);
            }
            50% {
              transform: translate3d(0, -10px, 0);
            }
            100% {
              transform: translate3d(0, 0, 0);
            }
          }

          @keyframes plannerHeroPulseDot {
            0% {
              transform: scale(0.9);
              box-shadow: 0 0 0 0 rgba(255, 213, 138, 0.45);
            }
            70% {
              transform: scale(1);
              box-shadow: 0 0 0 18px rgba(255, 213, 138, 0);
            }
            100% {
              transform: scale(0.9);
              box-shadow: 0 0 0 0 rgba(255, 213, 138, 0);
            }
          }

          @keyframes plannerHeroChipFloat {
            0% {
              transform: translate3d(0, 0, 0);
            }
            50% {
              transform: translate3d(0, -6px, 0);
            }
            100% {
              transform: translate3d(0, 0, 0);
            }
          }

          .planner-hero-image {
            transform-origin: center;
            will-change: transform;
            animation: plannerHeroImageDrift 26s ease-in-out infinite alternate;
          }

          .planner-hero-line {
            position: relative;
            display: block;
            width: fit-content;
            will-change: transform, filter, opacity, text-shadow;
            animation:
              plannerHeroFadeUp 1000ms cubic-bezier(0.22, 1, 0.36, 1) forwards,
              plannerHeroFloat 8s ease-in-out 1100ms infinite,
              plannerHeroGlow 6.5s ease-in-out 1100ms infinite;
          }

          .planner-hero-line::after {
            content: "";
            position: absolute;
            inset: -8% -10%;
            background: linear-gradient(
              90deg,
              transparent 0%,
              rgba(255, 255, 255, 0.02) 30%,
              rgba(255, 244, 214, 0.38) 50%,
              rgba(255, 255, 255, 0.02) 70%,
              transparent 100%
            );
            mix-blend-mode: screen;
            pointer-events: none;
            animation: plannerHeroSheen 7.5s ease-in-out 1600ms infinite;
          }

          .planner-hero-accent {
            display: inline-block;
            background-image: linear-gradient(
              120deg,
              #fff5cf 0%,
              #ffd58a 18%,
              #ff9a62 36%,
              #ff6f91 54%,
              #c79bff 72%,
              #8fe6ff 88%,
              #fff3bf 100%
            );
            background-size: 220% 220%;
            background-position: 0% 50%;
            color: transparent;
            -webkit-background-clip: text;
            background-clip: text;
            will-change: background-position, filter;
            animation: plannerHeroChromatic 9s ease-in-out infinite;
          }

          .planner-hero-orb {
            animation: plannerHeroOrbPulse 10s ease-in-out infinite;
          }

          .planner-hero-hud {
            animation: plannerHeroHudFloat 8s ease-in-out infinite;
          }

          .planner-hero-dot {
            animation: plannerHeroPulseDot 3.6s ease-out infinite;
          }

          .planner-hero-chip {
            animation: plannerHeroChipFloat 7s ease-in-out infinite;
          }

          @media (prefers-reduced-motion: reduce) {
            .planner-hero-image,
            .planner-hero-line {
              animation: none !important;
              opacity: 1 !important;
              transform: none !important;
              filter: none !important;
              text-shadow: none !important;
            }

            .planner-hero-line::after {
              animation: none !important;
              opacity: 0 !important;
            }

            .planner-hero-accent {
              animation: none !important;
              background-position: 50% 50% !important;
              filter: none !important;
            }

            .planner-hero-orb,
            .planner-hero-hud,
            .planner-hero-dot,
            .planner-hero-chip {
              animation: none !important;
              transform: none !important;
              box-shadow: none !important;
            }
          }
        `}</style>

        <img
          alt="Travel inspiration background"
          className="planner-hero-image absolute inset-0 h-full w-full object-cover"
          src={plannerHeroImage}
        />
        <div className="planner-hero-orb absolute -right-20 top-10 h-72 w-72 rounded-full bg-[radial-gradient(circle,_rgba(255,176,80,0.42)_0%,_rgba(255,122,69,0.14)_38%,_transparent_72%)] blur-3xl" />
        <div className="planner-hero-orb absolute -left-16 bottom-10 h-64 w-64 rounded-full bg-[radial-gradient(circle,_rgba(86,196,255,0.24)_0%,_rgba(134,94,255,0.12)_40%,_transparent_75%)] blur-3xl" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.1),_transparent_30%),radial-gradient(circle_at_bottom_left,_rgba(37,99,235,0.1),_transparent_26%)]" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/25 to-black/50" />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(255,255,255,0.06),transparent_28%,transparent_68%,rgba(255,255,255,0.04))]" />

        <div className="relative flex h-full flex-col justify-center px-8 py-12 md:px-14 md:py-16">
          <div className="max-w-4xl">
            <h2 className="font-headline text-5xl font-extrabold leading-[0.92] tracking-tight text-white md:text-7xl xl:text-8xl">
              <span
                className="planner-hero-line"
                style={{
                  opacity: 0,
                  animationDelay: "0ms, 1100ms, 1100ms",
                }}
              >
                Your <span className="planner-hero-accent">Viet Nam</span> Story
              </span>
              <span
                className="planner-hero-line"
                style={{
                  opacity: 0,
                  animationDelay: "220ms, 1320ms, 1320ms",
                }}
              >
                <span className="planner-hero-accent">Starts Here</span>
              </span>
            </h2>
          </div>
        </div>

        <div className="planner-hero-hud absolute bottom-8 right-8 hidden h-48 w-48 rounded-full border border-white/15 bg-white/5 backdrop-blur-md lg:block">
          <div className="absolute inset-5 rounded-full border border-white/12" />
          <div className="absolute inset-10 rounded-full border border-white/10" />
          <div className="absolute inset-16 rounded-full border border-white/10" />
          <div className="absolute bottom-5 left-1/2 top-5 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-white/25 to-transparent" />
          <div className="absolute left-5 right-5 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
          <div className="planner-hero-dot absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#ffd58a]" />
          <div className="absolute left-[28%] top-[34%] h-2 w-2 rounded-full bg-white/70" />
          <div className="absolute left-[64%] top-[28%] h-1.5 w-1.5 rounded-full bg-white/55" />
          <div className="absolute left-[67%] top-[66%] h-2 w-2 rounded-full bg-white/65" />
          <div className="absolute left-[33%] top-[70%] h-1.5 w-1.5 rounded-full bg-white/45" />
        </div>

        <div className="absolute bottom-8 left-8 hidden items-center gap-3 md:flex">
          {["flight_takeoff", "landscape", "restaurant"].map((icon, index) => (
            <div
              key={icon}
              className="planner-hero-chip flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-white/10 text-white backdrop-blur-md"
              style={{ animationDelay: `${index * 180}ms` }}
            >
              <span className="material-symbols-outlined text-[20px]">
                {icon}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-12 flex flex-col items-end justify-between gap-6 md:flex-row">
      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge className="border-0 bg-tertiary-container px-3 py-1 text-[10px] font-bold text-on-tertiary-fixed">
            AI RECOMMENDED
          </Badge>
        </div>
        <h2 className="font-headline text-5xl font-extrabold leading-tight text-on-surface">
          {itinerary.location} <br />
          <span className="text-primary">Immersion</span>
        </h2>
      </div>

      <div className="flex gap-4">
        <Button
          type="button"
          variant="outline"
          className="rounded-full bg-white px-6 py-3 text-sm font-bold text-primary shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">share</span>
          <span>Share</span>
        </Button>
        <Button
          type="button"
          className="rounded-full bg-on-surface px-6 py-3 text-sm font-bold text-surface shadow-md hover:bg-on-surface/90"
        >
          <span
            className="material-symbols-outlined text-sm"
            style={{ fontVariationSettings: '"FILL" 1' }}
          >
            bookmark
          </span>
          <span>Save Trip</span>
        </Button>
      </div>
    </div>
  );
}

export default PlannerResultHeader;
