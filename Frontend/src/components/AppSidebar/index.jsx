import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  useSidebar,
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
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";
import { useI18n } from "@/i18n/I18nProvider";
import BrandLogo from "@/components/shared/brand-logo";

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
  const { state, toggleSidebar, isMobile } = useSidebar();

  const role = getRoleFromPath(location.pathname);
  const menuItems = MENU[role];
  const basePath = `/${role === "hotel" ? "hotel" : role}`;
  const isCollapsed = state === "collapsed" && !isMobile;
  const ToggleIcon = isCollapsed ? PanelLeftOpen : PanelLeftClose;

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-outline-variant/20 bg-white shadow-[8px_0px_30px_rgba(25,28,30,0.04)]"
    >
      <SidebarHeader className="px-4 pb-5 pt-7 group-data-[collapsible=icon]:px-2">
        <div className="flex items-start justify-between gap-2 rounded-2xl px-2 py-1.5 group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-0">
          <div className="min-w-0 max-w-[calc(100%-2.5rem)] flex-1 overflow-hidden group-data-[collapsible=icon]:max-w-full">
            <Link
              to={basePath}
              className="flex min-w-0 items-center gap-2 overflow-hidden group-data-[collapsible=icon]:justify-center"
            >
              <BrandLogo
                showText={false}
                className="shrink-0"
                iconClassName="h-9 w-9"
              />
              {!isCollapsed ? (
                <div className="min-w-0 overflow-hidden">
                  <p className="truncate font-heading text-[13px] font-extrabold italic tracking-tight text-on-surface">
                    <span className="text-primary">Smart</span>
                    <span>Travel</span>
                  </p>
                </div>
              ) : null}
            </Link>
            {!isCollapsed ? (
              <p className="mt-1 truncate pl-11 text-[9px] font-bold uppercase tracking-[0.22em] text-on-surface-variant">
                {t(`sidebar.subtitles.${role}`)}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            onClick={toggleSidebar}
            title={isCollapsed ? "Mở sidebar" : "Thu sidebar"}
            aria-label={isCollapsed ? "Mở sidebar" : "Thu sidebar"}
            className="mt-0.5 hidden h-8 w-8 shrink-0 items-center justify-center self-start rounded-xl border border-outline-variant/15 bg-surface-container-low text-on-surface-variant transition-all hover:border-primary/25 hover:bg-primary/10 hover:text-primary md:flex group-data-[collapsible=icon]:mt-0 group-data-[collapsible=icon]:h-8 group-data-[collapsible=icon]:w-8"
          >
            <ToggleIcon className="h-4 w-4" />
          </button>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col gap-1 px-4 pb-6 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
        <nav className="w-full space-y-1 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:flex-col group-data-[collapsible=icon]:items-center">
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
                onClick={() => {
                  if (isMobile) {
                    toggleSidebar();
                  }
                }}
                title={isCollapsed ? t(`sidebar.items.${item.labelKey}`) : undefined}
                className={`group relative flex items-center gap-3 rounded-xl px-4 py-3 transition-all duration-200 group-data-[collapsible=icon]:h-10 group-data-[collapsible=icon]:w-10 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0 ${
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

                <span className="relative z-10 font-heading text-[13px] font-semibold transition-all duration-200 group-data-[collapsible=icon]:hidden">
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
