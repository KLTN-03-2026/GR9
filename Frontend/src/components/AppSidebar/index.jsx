import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
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
  MessageCircle,
  Link as LinkIcon,
  MapPin,
  Mountain,
  Share2,
  FolderKanban,
  SquarePen,
  ChartNoAxesColumn,
  UserCog,
  BadgeCheck,
  ShieldAlert,
  Hotel,
} from "lucide-react";

const MENU = {
  traveler: [
    { name: "Traveler Dashboard", href: "", icon: LayoutDashboard },
    { name: "Tour List", href: "/tour-list", icon: Plane },
    { name: "Tour Detail", href: "/tour-detail", icon: Mountain },
    { name: "AI Travel Planner", href: "/ai-travel-planner", icon: Sparkles },
    {
      name: "Chat AI Assistant",
      href: "/chat-ai-assistant",
      icon: MessageCircle,
    },
    {
      name: "My Booking Traveler",
      href: "/my-booking-traveler",
      icon: ClipboardList,
    },
    {
      name: "Traveler Tracking Link Management",
      href: "/traveler-tracking-link-management",
      icon: LinkIcon,
    },
    { name: "Tour Tracking", href: "/tour-tracking", icon: MapPin },
  ],

  admin: [
    { name: "Admin Dashboard", href: "", icon: ChartNoAxesColumn },
    { name: "User Management Admin", href: "/users", icon: UserCog },
    { name: "Provider Approval", href: "/provider-approval", icon: BadgeCheck },
    {
      name: "Content Moderation",
      href: "/content-moderation",
      icon: ShieldAlert,
    },
  ],

  guide: [
    { name: "Guide Dashboard Home", href: "", icon: LayoutDashboard },
    {
      name: "Assigned Tours List Guide",
      href: "/assigned-tours",
      icon: ClipboardList,
    },
    {
      name: "Guide Live Tour Tracking",
      href: "/live-tour-tracking",
      icon: Share2,
    },
  ],

  provider: [
    { name: "Provider Dashboard", href: "", icon: LayoutDashboard },
    {
      name: "Manage Tours Provider",
      href: "/manage-tours",
      icon: FolderKanban,
    },
    { name: "Create or Edit Tour", href: "/edit-tour", icon: SquarePen },
    {
      name: "Bookings Management Provider",
      href: "/bookings-management",
      icon: ClipboardList,
    },
    {
      name: "Guide Management Provider",
      href: "/guide-management",
      icon: Users,
    },
    {
      name: "Hotel Management Provider",
      href: "/hotel-management",
      icon: Hotel,
    },
  ],
};

const ROLE_META = {
  traveler: {
    subtitle: "Traveler Suite",
    userName: "Alex Traveler",
    userLabel: "Premium Member",
  },
  admin: {
    subtitle: "Admin Console",
    userName: "System Admin",
    userLabel: "Platform Control",
  },

  guide: {
    subtitle: "Guide Workspace",
    userName: "Tour Guide",
    userLabel: "Field Operations",
  },
  provider: {
    subtitle: "Provider Hub",
    userName: "Tour Provider",
    userLabel: "Operations Center",
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

      <SidebarFooter className="p-4 pt-2">
        <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {role.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-on-surface">
                {roleMeta.userName}
              </p>
              <p className="truncate text-xs text-on-surface-variant">
                {roleMeta.userLabel}
              </p>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
