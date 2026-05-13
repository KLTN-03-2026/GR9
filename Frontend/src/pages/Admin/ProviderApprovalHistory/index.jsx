import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import PageHero from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { getProcessedProviderApplications } from "@/services/api/provider";
import ProcessedProvidersList from "../ProviderApprovalPage/ProcessedProvidersList";

const formatProviderHistory = (items = []) =>
  items.map((item) => ({
    id: item._id || item.id,
    name: item.fullName || item.email || "Provider",
    initials: String(item.fullName || item.email || "PV")
      .split(" ")
      .map((part) => part[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
    date: item.processedAt || item.updatedAt || item.createdAt,
    status: item.status || (item.isActive ? "approved" : "rejected"),
    reviewer: item.reviewer || "Admin",
    email: item.email,
  }));

const ProviderApprovalHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await getProcessedProviderApplications();
      setHistory(response.data?.data || []);
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Không thể tải lịch sử duyệt provider",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const rows = useMemo(() => formatProviderHistory(history), [history]);
  const filteredRows = useMemo(() => {
    const keyword = query.trim().toLowerCase();
    return rows.filter((item) => {
      const matchesStatus =
        statusFilter === "all" ? true : item.status?.toLowerCase() === statusFilter;
      const matchesQuery = keyword
        ? [item.name, item.email, item.reviewer, item.id]
            .filter(Boolean)
            .some((value) => String(value).toLowerCase().includes(keyword))
        : true;
      return matchesStatus && matchesQuery;
    });
  }, [query, rows, statusFilter]);

  const approvedCount = rows.filter(
    (item) => String(item.status).toLowerCase() === "approved",
  ).length;
  const rejectedCount = rows.filter(
    (item) => String(item.status).toLowerCase() === "rejected",
  ).length;

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 pb-10 pt-6 md:space-y-8 md:pt-24">
      <PageHero
        eyebrow="Audit Trail"
        heading={
          <>
            Lịch sử{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              duyệt đối tác
            </span>
          </>
        }
        description="Xem lại các hồ sơ provider đã được admin chấp nhận hoặc từ chối bằng dữ liệu thật trong hệ thống."
        actions={
          <div className="flex flex-wrap items-center gap-3">
            <Button
              type="button"
              onClick={loadHistory}
              className="rounded-full bg-primary px-6 font-bold text-primary-foreground hover:bg-primary-container hover:text-on-primary-container"
            >
              <span className="material-symbols-outlined mr-2 text-lg">
                refresh
              </span>
              Làm mới
            </Button>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="rounded-[28px] border-outline-variant/20 bg-surface-container-lowest shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Tổng hồ sơ đã xử lý
            </p>
            <p className="mt-3 text-3xl font-extrabold text-on-surface">{rows.length}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border-outline-variant/20 bg-surface-container-lowest shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Đã chấp nhận
            </p>
            <p className="mt-3 text-3xl font-extrabold text-primary">{approvedCount}</p>
          </CardContent>
        </Card>
        <Card className="rounded-[28px] border-outline-variant/20 bg-surface-container-lowest shadow-sm">
          <CardContent className="p-5">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-on-surface-variant">
              Đã từ chối
            </p>
            <p className="mt-3 text-3xl font-extrabold text-destructive">{rejectedCount}</p>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[28px] border-outline-variant/20 bg-surface-container-lowest shadow-sm">
        <CardContent className="flex flex-col gap-4 p-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-1 flex-col gap-3 sm:flex-row sm:items-center">
            <div className="relative w-full sm:max-w-md">
              <span className="material-symbols-outlined pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
                search
              </span>
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Tìm theo tên, email, reviewer hoặc mã hồ sơ..."
                className="h-12 rounded-full border-outline-variant/20 bg-surface-container-low pl-11"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: "all", label: "Tất cả" },
                { key: "approved", label: "Approved" },
                { key: "rejected", label: "Rejected" },
              ].map((item) => (
                <Button
                  key={item.key}
                  type="button"
                  variant={statusFilter === item.key ? "default" : "outline"}
                  onClick={() => setStatusFilter(item.key)}
                  className="rounded-full"
                >
                  {item.label}
                </Button>
              ))}
            </div>
          </div>
          <div className="text-sm text-on-surface-variant">
            Đang hiển thị <span className="font-bold text-on-surface">{filteredRows.length}</span> hồ sơ
          </div>
        </CardContent>
      </Card>

      <ProcessedProvidersList data={filteredRows} loading={loading} />
    </div>
  );
};

export default ProviderApprovalHistory;
