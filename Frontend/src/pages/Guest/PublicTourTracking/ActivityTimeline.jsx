import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Clock } from "lucide-react";

const ActivityTimeline = ({ tracking }) => {
  const activities = tracking?.today?.activities || [];

  return (
    <Card className="rounded-3xl border-none shadow-sm bg-slate-100/50">
      <CardContent className="p-8">
        <h3 className="text-lg font-extrabold mb-8 flex items-center gap-2 text-slate-900">
          <Clock className="w-5 h-5 text-teal-600" />
          Today's Activities
        </h3>
        
        <div className="space-y-10 relative before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
          {activities.length ? activities.map((item, idx) => (
            <div key={idx} className="relative pl-10">
              <div className={`absolute left-0 top-1 w-6 h-6 rounded-full flex items-center justify-center ring-4 ring-slate-100 z-10 
                ${item.state === 'completed' ? 'bg-teal-600' : item.state === 'ongoing' ? 'bg-white border-2 border-teal-600' : 'bg-slate-300'}`}>
                {item.state === 'completed' && <Check className="w-3.5 h-3.5 text-white" />}
                {item.state === 'ongoing' && <div className="w-2 h-2 rounded-full bg-teal-600 animate-ping" />}
              </div>
              
              <div className={item.state === 'pending' ? 'opacity-50' : ''}>
                <Badge variant={item.state === 'completed' ? 'default' : 'secondary'} className="uppercase text-[9px] font-bold px-2 mb-1.5">
                  {item.state}
                </Badge>
                <h4 className="font-bold text-slate-900">{item.name}</h4>
                <p className="text-xs font-bold text-slate-500 mt-0.5">{item.time}</p>
                {(item.description || item.address) && (
                  <div className="mt-3 p-3 bg-white rounded-xl border border-slate-200 text-xs italic text-slate-600 shadow-sm">
                    {item.description || item.address}
                  </div>
                )}
              </div>
            </div>
          )) : (
            <p className="text-sm text-slate-500">No activities are available.</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityTimeline;
