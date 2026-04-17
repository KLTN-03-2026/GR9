import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const ProcessedProvidersList = ({ data = [] }) => {
  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.id} className="rounded-3xl border-slate-200 shadow-sm">
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold text-slate-900">
              {item.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3 sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Reviewer
              </p>
              <p className="text-sm text-slate-700">{item.reviewer}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
                Date
              </p>
              <p className="text-sm text-slate-700">{item.date}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={item.status === "approved" ? "default" : "destructive"}
                className="uppercase text-[11px] font-bold tracking-[0.18em]"
              >
                {item.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
      {data.length === 0 && (
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">
          Chưa có hồ sơ nào trong lịch sử.
        </div>
      )}
    </div>
  );
};

export default ProcessedProvidersList;
