import React, { useContext } from "react";
import { Bell, ChevronDown, LogOut, Search, UserRound } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import AuthContext from "@/context/authContext";
import { getProviderAiNotifications } from "@/services/api/ai";

const PAGE_META = {
  "/traveler": {
    role: "Traveler",
    title: "Traveler Dashboard",
    searchPlaceholder: "Search in traveler pages...",
    avatarFallback: "T",
  },
  "/admin": {
    role: "Admin",
    title: "Admin Dashboard",
    searchPlaceholder: "Search in admin pages...",
    avatarFallback: "A",
  },
  "/guide": {
    role: "Guide",
    title: "Guide Dashboard",
    searchPlaceholder: "Search in guide pages...",
    avatarFallback: "G",
  },
  "/provider": {
    role: "Provider",
    title: "Provider Dashboard",
    searchPlaceholder: "Search in provider pages...",
    avatarFallback: "P",
  },
};

const PROFILE_PATHS = {
  admin: "/admin/profile",
  traveler: "/traveler/profile",
  guide: "/guide/profile",
  provider: "/provider/profile",
};

const DEFAULT_SEARCH_PATHS = {
  admin: "/admin/users",
  traveler: "/traveler/tour-list",
  guide: "/guide/assigned-tours",
  provider: "/provider/manage-tours",
};

const SEARCH_INTENTS = {
  traveler: [
    {
      path: "/traveler/my-booking-traveler",
      keywords: ["my booking", "booking", "bookings", "dat tour", "đặt tour"],
    },
    {
      path: "/traveler/tour-tracking",
      keywords: ["tracking", "track tour", "theo doi", "theo dõi"],
    },
    {
      path: "/traveler/traveler-tracking-link-management",
      keywords: ["tracking link", "share tracking", "link tracking"],
    },
    {
      path: "/traveler/ai-travel-planner",
      keywords: ["ai planner", "travel planner", "lap lich trinh", "lập lịch trình"],
    },
    {
      path: "/traveler/ai-tour-history",
      keywords: ["ai history", "tour history", "lich su ai", "lịch sử ai"],
    },
    {
      path: "/traveler/tour-list",
      keywords: ["tour", "tour list", "destination", "diem den", "điểm đến"],
    },
  ],
  admin: [
    {
      path: "/admin/users",
      keywords: ["user", "users", "account", "tai khoan", "tài khoản"],
    },
    {
      path: "/admin/provider-approval",
      keywords: ["provider approval", "approve provider", "phe duyet", "phê duyệt"],
    },
    {
      path: "/admin/provider-approval-history",
      keywords: ["approval history", "lich su phe duyet", "lịch sử phê duyệt"],
    },
  ],
  guide: [
    {
      path: "/guide/assigned-tours",
      keywords: ["assigned", "assigned tours", "tour", "lich trinh", "lịch trình"],
    },
    {
      path: "/guide/live-tour-tracking",
      keywords: ["live tracking", "tracking", "theo doi", "theo dõi"],
    },
  ],
  provider: [
    {
      path: "/provider/bookings-management",
      keywords: ["booking", "bookings", "reservation", "dat tour", "đặt tour"],
    },
    {
      path: "/provider/manage-tours",
      keywords: ["tour", "manage tours", "tour management"],
    },
    {
      path: "/provider/service-management",
      keywords: ["service", "services", "dich vu", "dịch vụ"],
    },
    {
      path: "/provider/guide-management",
      keywords: ["guide", "guides", "huong dan vien", "hướng dẫn viên"],
    },
  ],
};

const SEARCHABLE_PATHS = [
  "/admin/users",
  "/traveler/tour-list",
  "/guide/assigned-tours",
  "/provider/manage-tours",
  "/provider/service-management",
  "/provider/guide-management",
  "/provider/bookings-management",
];

/** More specific routes first. */
const ROUTE_TITLES = [
  {
    test: (p) => p.startsWith("/guide/tour-detail-ops"),
    title: "Guide Tour Detail Ops",
  },
  {
    test: (p) => p.startsWith("/guide/live-tour-tracking"),
    title: "Guide Live Tour Tracking",
  },
  {
    test: (p) => p.startsWith("/guide/assigned-tours"),
    title: "Assigned Tours List Guide",
  },
  { test: (p) => p.startsWith("/guide/profile"), title: "Guide Profile" },
  { test: (p) => p === "/guide" || p === "/guide/", title: "Guide Dashboard" },
  {
    test: (p) => p.startsWith("/provider/edit-tour"),
    title: "Create or Edit Tour",
  },
  {
    test: (p) => p.startsWith("/provider/manage-tours"),
    title: "Manage Tours",
  },
  {
    test: (p) => p.startsWith("/provider/service-management"),
    title: "Service Management",
  },
  {
    test: (p) => p.startsWith("/provider/guide-management"),
    title: "Guide Management Provider",
  },
  {
    test: (p) => p.startsWith("/provider/bookings-management"),
    title: "Bookings Management",
  },
  {
    test: (p) => p.startsWith("/provider/ai-tour-requests"),
    title: "AI Tour Request",
  },
  {
    test: (p) => p.startsWith("/provider/hotel-management"),
    title: "Hotels Management",
  },
  { test: (p) => p.startsWith("/provider/profile"), title: "Provider Profile" },
  {
    test: (p) => p === "/provider" || p === "/provider/",
    title: "Provider Dashboard",
  },
  { test: (p) => p.startsWith("/traveler/profile"), title: "Traveler Profile" },
  { test: (p) => p.startsWith("/traveler/tour-list"), title: "Tour List" },
  { test: (p) => p.startsWith("/traveler/tour-detail"), title: "Tour Detail" },
  {
    test: (p) => p.startsWith("/traveler/ai-travel-planner"),
    title: "AI Travel Planner",
  },
  {
    test: (p) => p.startsWith("/traveler/my-booking-traveler"),
    title: "My Booking",
  },
  {
    test: (p) => p.startsWith("/traveler/traveler-tracking-link-management"),
    title: "Tracking Link Management",
  },
  {
    test: (p) => p.startsWith("/traveler/tour-tracking"),
    title: "Tour Tracking",
  },
  {
    test: (p) => p.startsWith("/traveler/") || p === "/traveler",
    title: "Traveler Dashboard",
  },
  { test: (p) => p.startsWith("/admin/profile"), title: "Admin Profile" },
  { test: (p) => p.startsWith("/admin/users"), title: "User Management" },
  {
    test: (p) => p.startsWith("/admin/provider-approval"),
    title: "Provider Approval",
  },
  {
    test: (p) => p.startsWith("/admin/") || p === "/admin",
    title: "Admin Dashboard",
  },
];
function resolveBreadcrumbTitle(pathname, fallbackTitle) {
  const normalized = pathname.replace(/\/+$/, "") || "/";
  const hit = ROUTE_TITLES.find(({ test }) => test(normalized));
  return hit?.title ?? fallbackTitle;
}

function normalizeSearchIntent(value) {
  return String(value || "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function resolveSearchIntentPath(role, keyword) {
  const normalizedKeyword = normalizeSearchIntent(keyword);
  if (!normalizedKeyword) return null;

  return SEARCH_INTENTS[role]?.find((intent) =>
    intent.keywords.some((item) =>
      normalizedKeyword.includes(normalizeSearchIntent(item)),
    ),
  )?.path;
}

const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logOutContext } = useContext(AuthContext);
  const currentRole =
    ["admin", "traveler", "guide", "provider"].find((role) =>
      location.pathname.startsWith(`/${role}`),
    ) || "provider";
  const profilePath = PROFILE_PATHS[currentRole];

  const baseMeta =
    Object.entries(PAGE_META).find(([path]) =>
      location.pathname.startsWith(path),
    )?.[1] ?? PAGE_META["/provider"];

  const currentMeta = {
    ...baseMeta,
    title: resolveBreadcrumbTitle(location.pathname, baseMeta.title),
  };

  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-outline-variant/20 bg-white/92 px-7 backdrop-blur-md md:left-64">
      <div className="mx-auto flex h-full max-w-[1920px] items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-3">
          <h1 className="shrink-0 font-heading text-[1.05rem] font-extrabold tracking-tight text-teal-800">
            Voyager AI
          </h1>

          <div className="hidden min-w-0 items-center gap-2 text-sm font-medium text-on-surface-variant lg:flex">
            <span>/</span>
            <span>{currentMeta.role}</span>
            <span>/</span>
            <span className="truncate text-teal-700">{currentMeta.title}</span>
          </div>

          <div className="min-w-0 lg:hidden">
            <p className="truncate text-sm font-semibold text-teal-700">
              {currentMeta.title}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <form className="relative hidden md:block" onSubmit={handleGlobalSearch}>
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-on-surface-variant" />
            <Input
              type="text"
              value={globalSearch}
              onChange={(event) => setGlobalSearch(event.target.value)}
              placeholder={currentMeta.searchPlaceholder}
              className="h-11 w-72 rounded-full border border-outline-variant/30 bg-surface-container-low px-11 pr-4 text-sm text-on-surface placeholder:text-on-surface-variant focus:border-primary/25 focus-visible:ring-2 focus-visible:ring-primary/15"
            />
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-10 w-10 rounded-full text-on-surface-variant hover:bg-surface-container-low"
              >
                <Bell className="h-5 w-5" />
                {aiNotifications.length ? (
                  <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {aiNotifications.length}
                  </span>
                ) : null}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-96 rounded-xl border-outline-variant/30 bg-white p-2 shadow-xl"
            >
              <div className="px-2 py-2">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                  AI Tour Requests
                </p>
              </div>
              {aiNotifications.length ? (
                aiNotifications.slice(0, 6).map((item) => (
                  <DropdownMenuItem
                    key={item._id}
                    onClick={() => navigate(`/provider/ai-tour-requests/${item._id}`)}
                    className="cursor-pointer rounded-lg p-3"
                  >
                    <div className="flex min-w-0 gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                        <Sparkles className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-900">
                          {item.location || "AI generated tour"}
                        </p>
                        <p className="line-clamp-2 text-xs text-slate-500">
                          {item.travelerId?.fullName || "Traveler"} gửi lịch trình {item.numberOfDay || 1} ngày
                        </p>
                      </div>
                    </div>
                  </DropdownMenuItem>
                ))
              ) : (
                <div className="px-3 py-8 text-center text-sm text-slate-500">
                  No new AI tour requests
                </div>
              )}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="h-11 gap-2 rounded-full px-1.5 pr-2 hover:bg-surface-container-low"
              >
                <Avatar className="h-9 w-9 border border-outline-variant/30 bg-surface-container-low">
                  <AvatarImage src={user?.user?.avatarUrl} />
                </Avatar>
                <ChevronDown className="h-4 w-4 text-on-surface-variant" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align="end"
              className="w-48 rounded-xl border-outline-variant/30 bg-white p-1 shadow-xl"
            >
              <DropdownMenuItem asChild className="cursor-pointer rounded-lg">
                <Link to={profilePath} className="flex items-center gap-2">
                  <UserRound className="h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={logOutContext}
                className="cursor-pointer rounded-lg text-red-600 focus:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
