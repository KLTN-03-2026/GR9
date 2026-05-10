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

const MENU = {
  traveler: [
    { name: "Dashboard", href: "", icon: LayoutDashboard },
    { name: "Tours", href: "/tour-list", icon: Plane },
    { name: "AI Travel Planner", href: "/ai-travel-planner", icon: Sparkles },
    { name: "AI Tour History", href: "/ai-tour-history", icon: History },
    {
      name: "My Bookings",
      href: "/my-booking-traveler",
      icon: ClipboardList,
    },
    {
      name: "Tracking Links",
      href: "/traveler-tracking-link-management",
      icon: LinkIcon,
    },
    { name: "Live Tracking", href: "/tour-tracking", icon: MapPin },
  ],

  admin: [
    { name: "Dashboard", href: "", icon: ChartNoAxesColumn },
    { name: "Users", href: "/users", icon: UserCog },
    { name: "Provider Approval", href: "/provider-approval", icon: BadgeCheck },
    {
      name: "Approval History",
      href: "/provider-approval-history",
      icon: FolderKanban,
    },
  ],

  guide: [
    { name: "Dashboard", href: "", icon: LayoutDashboard },
    {
      name: "Assigned Tours",
      href: "/assigned-tours",
      icon: ClipboardList,
    },
    {
      name: "Live Tracking",
      href: "/live-tour-tracking",
      icon: Share2,
    },
  ],

  provider: [
    { name: "Dashboard", href: "", icon: LayoutDashboard },
    {
      name: "Manage Tours",
      href: "/manage-tours",
      icon: FolderKanban,
    },
    {
      name: "Services",
      href: "/service-management",
      icon: ClipboardList,
    },
    {
      name: "Bookings",
      href: "/bookings-management",
      icon: ClipboardList,
    },
    {
      name: "Guides",
      href: "/guide-management",
      icon: Users,
    },
  ],
};

const ROLE_META = {
  traveler: {
    subtitle: "Traveler Suite",
  },
  admin: {
    subtitle: "Admin Console",
  },

  guide: {
    subtitle: "Guide Workspace",
  },
  provider: {
    subtitle: "Provider Hub",
  },
};

const getRoleFromPath = (pathname) => {
  if (pathname.startsWith("/admin")) return "admin";
  if (pathname.startsWith("/traveler")) return "traveler";
  if (pathname.startsWith("/guide")) return "guide";
  return "provider";
};

export function AppSidebar() {
  const location = useLocation();

  const role = getRoleFromPath(location.pathname);
  const menuItems = MENU[role];
  const basePath = `/${role === "hotel" ? "hotel" : role}`;
  const roleMeta = ROLE_META[role];

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
                {roleMeta.subtitle}
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
                    ? "bg-teal-50 text-teal-700"
                    : "text-slate-500 hover:bg-slate-100 hover:text-slate-700"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="app-sidebar-active"
                    className="absolute inset-0 rounded-xl border border-teal-100 bg-teal-50"
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
                      ? "text-teal-700"
                      : "text-slate-500 group-hover:text-slate-700"
                  }`}
                  strokeWidth={2.1}
                />

                <span className="relative z-10 font-heading text-[13px] font-semibold">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </nav>
      </SidebarContent>

    </Sidebar>
  );
}
