import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MapPin, MapPinned, Ticket } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
const HeaderGuest = () => {
  const location = useLocation();
  const isBookingSuccessPage = location.pathname === "/guest/booking-success-and-tracking-link";
  return (
    <header className="fixed top-0 right-0 left-0 z-50 h-16 border-b border-outline-variant/20 bg-white/92 px-6 backdrop-blur-xl shadow-sm">
      <div className="mx-auto flex h-full max-w-[1400px] items-center justify-between gap-6">
        {/* Logo */}
       

        {/* Navigation */}
        <nav className="no-scrollbar hidden items-center gap-2 overflow-x-auto md:flex">
          <Link to="/guest">
            <Button
              
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${isBookingSuccessPage === false ? 'bg-teal-50 text-teal-700' : 'bg-0 text-slate-500 hover:bg-slate-100'} `}
            >
              <MapPinned className="h-4 w-4 fill-current" />
              Public Tour Tracking
            </Button>
          </Link>

          <Link to="/guest/booking-success-and-tracking-link">
            <Button
              
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${isBookingSuccessPage ? 'bg-teal-50 text-teal-700' : 'bg-0 text-slate-500 hover:bg-slate-100'} `}
            >
              <Ticket className="h-4  w-4" />
              Booking Success
            </Button>
          </Link>
        </nav>

        {/* Mobile Avatar */}
        <div className="md:hidden">
          <Avatar className="h-9 w-9 border border-outline-variant/30 bg-surface-container-low">
            <AvatarFallback className="text-xs font-bold text-teal-800">
              P
            </AvatarFallback>
          </Avatar>
        </div>
      </div>

      {/* bottom line */}
      <div className="absolute bottom-0 h-[1px] w-full bg-slate-100/50" />
    </header>
  );
};

export default HeaderGuest;
