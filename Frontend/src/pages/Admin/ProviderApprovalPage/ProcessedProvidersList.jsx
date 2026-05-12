import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const formatDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const ProcessedProvidersList = ({ data = [], loading = false }) => {
  if (loading) {
    return (
      <div className="space-y-4">
        {[0, 1, 2].map((item) => (
          <Card
            key={item}
            className="rounded-3xl border-outline-variant/20 bg-surface-container-low shadow-sm"
          >
            <CardContent className="h-28 animate-pulse" />
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card
          key={item.id}
          className="rounded-3xl border-outline-variant/20 bg-surface-container-low shadow-sm"
        >
          <CardHeader className="pb-0">
            <CardTitle className="text-base font-semibold text-on-surface">
              {item.name}
            </CardTitle>
            {item.email && (
              <p className="text-sm text-on-surface-variant">{item.email}</p>
            )}
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-3 sm:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                Reviewer
              </p>
              <p className="text-sm text-on-surface">{item.reviewer}</p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-on-surface-variant">
                Date
              </p>
              <p className="text-sm text-on-surface">{formatDate(item.date)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                variant={item.status === "approved" ? "default" : "destructive"}
                className="text-[11px] font-bold uppercase tracking-[0.18em]"
              >
                {item.status}
              </Badge>
            </div>
          </CardContent>
        </Card>
      ))}
      {data.length === 0 && (
        <div className="rounded-3xl border border-dashed border-outline-variant/30 bg-surface-container-low p-8 text-center text-on-surface-variant">
          Chưa có hồ sơ nào trong lịch sử.
        </div>
      )}
    </div>
  );
};

export default ProcessedProvidersList;
