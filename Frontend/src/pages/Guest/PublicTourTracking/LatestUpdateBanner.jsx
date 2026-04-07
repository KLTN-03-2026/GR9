import React from 'react';
import { Megaphone } from "lucide-react";

const LatestUpdateBanner = () => {
  return (
    <div className="bg-teal-900 text-white rounded-3xl p-6 shadow-xl shadow-teal-900/10 relative overflow-hidden">
      <div className="flex items-center gap-3 mb-3 relative z-10">
        <Megaphone className="w-5 h-5 text-teal-400" />
        <h2 className="font-bold tracking-wider text-sm uppercase">Latest Update</h2>
        <span className="text-[10px] font-medium opacity-60 ml-auto">Mar 30, 11:05 AM</span>
      </div>
      <p className="text-lg font-medium leading-relaxed relative z-10 pr-12">
        The group has started the stone carving workshop at Non Nuoc Village. 
        Lunch remains on schedule for 1:00 PM.
      </p>
      <Megaphone className="absolute -right-6 -bottom-6 size-40 text-white opacity-5 rotate-12" />
    </div>
  );
};

export default LatestUpdateBanner;