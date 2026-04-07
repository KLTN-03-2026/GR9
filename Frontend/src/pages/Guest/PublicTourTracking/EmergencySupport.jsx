import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Phone, Mail, AlertCircle } from "lucide-react";

const EmergencySupport = () => {
  return (
    <Card className="rounded-3xl border-red-100 bg-white shadow-sm overflow-hidden">
      <CardContent className="p-6">
        <h3 className="text-xs font-black text-red-600 mb-5 flex items-center gap-2 uppercase tracking-tighter">
          <AlertCircle className="w-4 h-4" />
          Emergency Assistance
        </h3>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-red-50 rounded-2xl border border-red-100">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Support Line</p>
              <p className="font-black text-red-600">+84 236 234 5678</p>
            </div>
            <div className="h-10 w-10 bg-red-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-red-200">
              <Phone className="w-5 h-5 fill-current" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div>
              <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1">Logistics Desk</p>
              <p className="font-bold text-slate-800">help@voyagerai.travel</p>
            </div>
            <Mail className="w-5 h-5 text-slate-400" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmergencySupport;