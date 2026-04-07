import React from 'react';
import { Card } from "@/components/ui/card";
import { MapPin } from "lucide-react";

const CurrentLocationMap = () => {
  return (
    <Card className="rounded-3xl overflow-hidden shadow-sm aspect-video md:h-[400px] relative border-none bg-slate-200">
      <div className="absolute top-6 left-6 z-10 bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-xl flex items-center gap-3 border border-white/20 shadow-lg">
        <MapPin className="w-5 h-5 text-teal-600" />
        <span className="text-sm font-bold text-slate-800 tracking-tight">
          Current Location: Stone village
        </span>
      </div>
      <img 
        alt="Tracking map" 
        className="w-full h-full object-cover opacity-80 grayscale" 
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBPMtui2OLB2kvFBCVO5QcyZ3an7WGQE8kaAOwfbK22CM3ZLKl028JjqUWWQkPKKpjyxNl9DIzGcTt2g9A6agBjapBdLR3PkeaS7Y6tGaaXwLw4SW0ZRNRh7pvPpovme-u0oLHw54QtNNYJEaeTFOH9I3K3zm9thWWSp5c5G_GEycLwsvCN-mKWM2OK8hhoe6_G81agnV_v9kTTn40kFsm-AsG4PI0M46A48gfrQQfPMY1KQhgKh_ZhDv0vL-t1FhvT0t8di5JnL7I-" 
      />
    </Card>
  );
};

export default CurrentLocationMap;