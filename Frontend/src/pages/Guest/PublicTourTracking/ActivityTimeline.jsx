import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";

const ActivityTimeline = () => {
  const activities = [
    { title: "Marble Mountains Hike", time: "08:30", status: "completed" },
    { title: "Stone Carving Workshop", time: "11:00", status: "current", note: "Guide is coordinating with local craftsmen." },
    { title: "Lunch: Mi Quang House", time: "13:00", status: "pending" },
    { title: "Dragon Bridge Walk", time: "18:00", status: "pending" },
  ];

  return (
    <Card className="rounded-3xl border-none shadow-sm bg-slate-100/50">
      <CardContent className="p-8">
        <h3 className="text-lg font-extrabold mb-8 flex items-center gap-2 text-slate-900">
          <Clock className="w-5 h-5 text-teal-600" />
          Today's Activities
        </h3>
        
        <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {activities.map((item, idx) => (
            <div key={idx} className="relative pl-10">
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-slate-100 z-10 
                ${item.status === 'completed' ? 'bg-teal-600' : item.status === 'current' ? 'bg-white border-2 border-teal-600' : 'bg-slate-300'}`}>
                {item.status === 'completed' && <Check className="w-3.5 h-3.5 text-white" />}
                {item.status === 'current' && <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />}
              </div>
              
              <div className={item.status === 'pending' ? 'opacity-50' : ''}>
                <Badge variant={item.status === 'completed' ? 'default' : 'secondary'} className="uppercase text-[9px] font-bold px-2 mb-1.5">
                  {item.status}
                </Badge>
                <h4 className="font-bold text-slate-900">{item.title}</h4>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{item.time}</p>
                {item.note && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs italic text-slate-600 shadow-sm">
                    {item.note}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;