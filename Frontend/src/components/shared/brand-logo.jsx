import { cn } from "@/lib/utils";

function BrandIcon({ className }) {
  return (
    <svg
      viewBox="0 0 160 160"
      aria-hidden="true"
      className={cn("h-10 w-10 shrink-0", className)}
    >
      <defs>
        <linearGradient id="smarttravel-ring" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#89f5e7" />
          <stop offset="45%" stopColor="#008378" />
          <stop offset="100%" stopColor="#00685f" />
        </linearGradient>
        <linearGradient id="smarttravel-mountain" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#89f5e7" />
          <stop offset="45%" stopColor="#00a397" />
          <stop offset="100%" stopColor="#00685f" />
        </linearGradient>
        <linearGradient id="smarttravel-hill" x1="0%" x2="100%" y1="20%" y2="100%">
          <stop offset="0%" stopColor="#6bd8cb" />
          <stop offset="100%" stopColor="#005049" />
        </linearGradient>
        <linearGradient id="smarttravel-globe" x1="0%" x2="100%" y1="0%" y2="100%">
          <stop offset="0%" stopColor="#dffff8" />
          <stop offset="100%" stopColor="#89f5e7" />
        </linearGradient>
      </defs>

      <circle cx="80" cy="72" r="60" fill="white" stroke="url(#smarttravel-ring)" strokeWidth="8" />

      <path
        d="M44 50c8-9 17-12 26-12c-2 6 3 9 7 10c-3 4-9 5-11 9c-4-2-6-8-12-7c-6 2-9 4-10 0Zm44-7c9-4 18-4 26 0c-2 2-5 4-4 7c5 2 12-1 16 3c-3 6-10 7-14 11c-6-2-8-9-14-10c-4-2-11 0-10-6Z"
        fill="url(#smarttravel-globe)"
        opacity="0.95"
      />
      <path
        d="M63 73l19 29H45l9-14l-5-2l7-13Zm-18 9l5 2l-4 6h5l-1 4h-6l-3 4h-5l14-16Z"
        fill="#0f3d3a"
      />
      <path
        d="M77 102l25-34l17 34H77Zm30-20l-5 7l10 1l-5-8Z"
        fill="url(#smarttravel-mountain)"
      />
      <path d="M101 102l19-24l14 24h-33Z" fill="#008378" />
      <path d="M24 111c20-20 39-20 63-7c21 12 38 14 50 10c-11 20-31 32-58 32c-27 0-44-12-55-35Z" fill="url(#smarttravel-hill)" />
      <path
        d="M61 134c7-15 19-29 32-42c8-8 15-13 23-16c5 4 8 9 11 15c-13 7-27 21-38 41c-5 0-10 1-14 1c-5 0-10 0-14 1Z"
        fill="white"
      />
      <path
        d="M72 134c9-15 20-28 30-38c5-5 11-9 16-11c2 2 4 5 5 8c-11 8-21 20-30 41Z"
        fill="#0b0b0b"
      />
      <path
        d="M47 90c18 0 33-3 43-8c11-6 17-13 29-14l-5-6c-9 1-17 7-28 12c-10 5-25 9-43 11Z"
        fill="#00a397"
      />
      <path
        d="M104 50l8 1l14 9l-3 5l-9-5l2 5l-6 2l-2-5l-2 7l-6 1l1-8l-8-4l4-5l7 4Z"
        fill="#0b0b0b"
      />
    </svg>
  );
}

function EditorialBrandIcon({ className }) {
  return (
    <svg
      viewBox="0 0 64 64"
      aria-hidden="true"
      className={cn("h-10 w-10 shrink-0", className)}
      fill="none"
    >
      <circle cx="32" cy="32" r="24" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M32 13.5 44 25.5 32 50.5 20 25.5 32 13.5Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path d="M20 25.5h24M32 13.5v37" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export default function BrandLogo({
  className,
  iconClassName,
  light = false,
  showText = true,
  showTagline = false,
  stacked = false,
  subLabel,
  variant = "default",
}) {
  const primaryText = light ? "text-white" : "text-on-surface";
  const secondaryText = light ? "text-white/80" : "text-on-surface-variant";
  const editorialPrimary = light ? "text-[#f4e8d5]" : "text-[#173234]";
  const editorialSecondary = light ? "text-[#c8b89e]" : "text-[#6f7f81]";

  if (variant === "editorial") {
    return (
      <div
        className={cn(
          "flex items-center gap-3",
          stacked && "flex-col gap-2 text-center",
          className,
          editorialPrimary,
        )}
      >
        <EditorialBrandIcon className={iconClassName} />

        {showText ? (
          <div className={cn("min-w-0", stacked && "flex flex-col items-center")}>
            <p
              className={cn(
                "[font-family:Iowan_Old_Style,Palatino_Linotype,Book_Antiqua,Georgia,serif] text-[1.5rem] font-semibold uppercase leading-none tracking-[0.22em]",
                editorialPrimary,
              )}
            >
              SmartTravel
            </p>
            {showTagline ? (
              <p
                className={cn(
                  "mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.42em]",
                  editorialSecondary,
                )}
              >
                {subLabel || "Explore More - Live Better"}
              </p>
            ) : null}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-3",
        stacked && "flex-col gap-2 text-center",
        className,
      )}
    >
      <BrandIcon className={iconClassName} />

      {showText ? (
        <div className={cn("min-w-0", stacked && "flex flex-col items-center")}>
          <div className="flex items-baseline gap-0.5 leading-none">
            <span
              className={cn(
                "font-heading text-2xl font-extrabold italic tracking-tight text-primary",
                light && "text-primary-fixed",
              )}
            >
              Smart
            </span>
            <span className={cn("font-heading text-2xl font-extrabold italic tracking-tight", primaryText)}>
              Travel
            </span>
          </div>
          {showTagline ? (
            <p className={cn("mt-1 text-[9px] font-bold uppercase tracking-[0.35em]", secondaryText)}>
              Explore More - Live Better
            </p>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
