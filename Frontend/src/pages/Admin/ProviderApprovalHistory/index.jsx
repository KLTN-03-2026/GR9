import ProcessedProvidersList from "../ProviderApprovalPage/ProcessedProvidersList";
import PageHero from "@/components/shared/page-hero";

const mockHistory = [
  {
    id: 1,
    name: "Desert Treks UAE",
    initials: "DT",
    date: "Oct 24, 2023",
    status: "approved",
    reviewer: "admin_martha",
  },
  {
    id: 2,
    name: "Berlin Bike Tours",
    initials: "BB",
    date: "Oct 23, 2023",
    status: "rejected",
    reviewer: "admin_james",
  },
  {
    id: 3,
    name: "Oceanic Yacht Charters",
    initials: "OY",
    date: "Nov 02, 2023",
    status: "approved",
    reviewer: "admin_suzy",
  },
];

const ProviderApprovalHistory = () => {
  return (
    <div className="mx-auto max-w-[1600px] space-y-8 pb-12 pt-24">
      <PageHero
        eyebrow="Audit Trail"
        heading={
          <>
            Approval{" "}
            <span className="rounded-xl bg-primary/8 px-2 py-1 italic text-primary">
              History
            </span>
          </>
        }
        description="Xem lại lịch sử các hồ sơ đăng ký đối tác đã được duyệt hoặc từ chối."
      />

      <ProcessedProvidersList data={mockHistory} />
    </div>
  );
};

export default ProviderApprovalHistory;
