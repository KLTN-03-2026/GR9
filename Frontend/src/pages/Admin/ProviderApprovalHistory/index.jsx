import ProcessedProvidersList from "../ProviderApprovalPage/ProcessedProvidersList";

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
    <div className="pt-24 pb-12 max-w-6xl mx-auto space-y-12">
      <section>
        <h3 className="text-3xl font-extrabold tracking-tight text-slate-900 font-headline">
          Approval History
        </h3>
        <p className="text-slate-500 mt-2 max-w-2xl text-sm">
          Xem lại lịch sử các hồ sơ đăng ký đối tác đã được duyệt hoặc từ chối.
        </p>
      </section>

      <ProcessedProvidersList data={mockHistory} />
    </div>
  );
};

export default ProviderApprovalHistory;
