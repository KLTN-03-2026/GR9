import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import PageHero from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
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
        }
      />

      <ProcessedProvidersList data={rows} loading={loading} />
    </div>
  );
};

export default ProviderApprovalHistory;
