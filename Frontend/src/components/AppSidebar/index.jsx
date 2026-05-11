import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Sparkles,
  Plane,
  Users,
  Map,
  ClipboardList,
  Link as LinkIcon,
  MapPin,
  Share2,
  FolderKanban,
  ChartNoAxesColumn,
  UserCog,
  BadgeCheck,
  History,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";

const MENU = {
  traveler: [
    { name: "Dashboard", labelKey: "dashboard", href: "", icon: LayoutDashboard },
    { name: "Tours", labelKey: "tours", href: "/tour-list", icon: Plane },
    { name: "AI Travel Planner", labelKey: "aiTravelPlanner", href: "/ai-travel-planner", icon: Sparkles },
    { name: "AI Tour History", labelKey: "aiTourHistory", href: "/ai-tour-history", icon: History },
    {
      name: "My Bookings",
      labelKey: "myBookings",
      href: "/my-booking-traveler",
      icon: ClipboardList,
    },
    {
      name: "Tracking Links",
      labelKey: "trackingLinks",
      href: "/traveler-tracking-link-management",
      icon: LinkIcon,
    },
    { name: "Live Tracking", labelKey: "liveTracking", href: "/tour-tracking", icon: MapPin },
  ],

  admin: [
    { name: "Dashboard", labelKey: "dashboard", href: "", icon: ChartNoAxesColumn },
    { name: "Analytics", labelKey: "analytics", href: "/analytics", icon: ChartNoAxesColumn },
    { name: "Users", labelKey: "users", href: "/users", icon: UserCog },
    { name: "Provider Approval", labelKey: "providerApproval", href: "/provider-approval", icon: BadgeCheck },
    {
      name: "Approval History",
      labelKey: "approvalHistory",
      href: "/provider-approval-history",
      icon: FolderKanban,
    },
  ],

  guide: [
    { name: "Dashboard", labelKey: "dashboard", href: "", icon: LayoutDashboard },
    {
      name: "Assigned Tours",
      labelKey: "assignedTours",
      href: "/assigned-tours",
      icon: ClipboardList,
    },
    {
      name: "Live Tracking",
      labelKey: "liveTracking",
      href: "/live-tour-tracking",
      icon: Share2,
    },
  ],

  provider: [
    { name: "Dashboard", labelKey: "dashboard", href: "", icon: LayoutDashboard },
    {
      name: "Analytics",
      labelKey: "analytics",
      href: "/analytics",
      icon: ChartNoAxesColumn,
    },
    {
      name: "Manage Tours",
      labelKey: "manageTours",
      href: "/manage-tours",
      icon: FolderKanban,
    },
    {
      name: "Services",
      labelKey: "services",
      href: "/service-management",
      icon: ClipboardList,
    },
    {
      name: "Bookings",
      labelKey: "bookings",
      href: "/bookings-management",
      icon: ClipboardList,
    },
    {
      name: "Reviews",
      labelKey: "reviews",
      href: "/reviews",
      icon: BadgeCheck,
    },
    {
      name: "Guides",
      labelKey: "guides",
      href: "/guide-management",
      icon: Users,
    },
  ],
};

const getRoleFromPath = (pathname) => {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/traveler")) return "traveler";
  if (pathname.startsWith("/guide")) return "guide";
  return "provider";
};

export function AppSidebar() {
  const location = useLocation();
  const { t } = useI18n();

  const role = getRoleFromPath(location.pathname);
  const menuItems = MENU[role];
  const basePath = `/${role === "hotel" ? "hotel" : role}`;

  return (
    <Sidebar className="border-r border-outline-variant/20 bg-white shadow-[8px_0px_30px_rgba(25,28,30,0.04)]">
      <SidebarHeader className="px-4 pt-8 pb-4">
        <div className="px-4">
          <Link to={basePath} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/20">
              <Plane className="h-5 w-5" strokeWidth={2.2} />
            </div>

            <div className="min-w-0">
              <h3 className="font-heading text-sm font-bold text-on-surface">
                Voyager AI
              </h3>
              <p className="text-[11px] uppercase tracking-[0.22em] text-on-surface-variant">
                {t(`sidebar.subtitles.${role}`)}
              </p>
            </div>
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-1 px-4 pb-6">
        <nav className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const fullPath = `${basePath}${item.href}`;
            const isActive = item.href
              ? location.pathname.startsWith(fullPath)
              : location.pathname === basePath;

            return (
              <Link
                key={item.name}
                to={fullPath}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 ${
                  isActive
                    ? "bg-primary/12 text-primary"
                    : "text-on-surface-variant hover:bg-surface-container-high hover:text-on-surface"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="app-sidebar-active"
                    className="absolute inset-0 rounded-xl border border-primary/20 bg-primary/12"
                    transition={{
                      type: "spring",
                      stiffness: 380,
                      damping: 32,
                    }}
                  />
                )}

                <Icon
                  className={`relative z-10 h-5 w-5 ${
                    isActive
                      ? "text-primary"
                      : "text-on-surface-variant group-hover:text-on-surface"
                  }`}
                  strokeWidth={2.1}
                />

                <span className="relative z-10 font-heading text-[13px] font-semibold">
                  {t(`sidebar.items.${item.labelKey}`)}
                </span>
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

    </Sidebar>
  );
}
