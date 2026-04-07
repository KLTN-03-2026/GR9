import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

const ProcessedProvidersList = ({ data }) => {
  return (
    <section className="space-y-6 pt-10">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4">
        <h4 className="text-lg font-bold text-slate-900 font-headline">
          Recently Processed
        </h4>
        <button className="text-sm font-semibold text-blue-600 flex items-center gap-1 hover:gap-2 transition-all">
          View Audit Log
          <span className="material-symbols-outlined text-sm">
            chevron_right
          </span>
        </button>
      </div>

      <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-200">
        <Table className="w-full text-left border-collapse">
          <TableHeader>
            <TableRow className="bg-slate-50 border-b border-slate-200 hover:bg-slate-50">
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Provider Name
              </TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Submission Date
              </TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                Action Status
              </TableHead>
              <TableHead className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500 text-right">
                Reviewer
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody className="divide-y divide-slate-100">
            {data.map((item) => (
              <TableRow
                key={item.id}
                className="hover:bg-slate-50 transition-colors border-none"
              >
                <TableCell className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-[10px] ${
                        item.status === "approved"
                          ? "bg-teal-50 text-teal-600"
                          : "bg-slate-100 text-slate-400"
                      }`}
                    >
                      {item.initials || "BB"}
                    </div>
                    <span className="text-sm font-semibold text-slate-900">
                      {item.name}
                    </span>
                  </div>
                </TableCell>

                <TableCell className="px-6 py-4 text-sm text-slate-500">
                  {item.date}
                </TableCell>

                <TableCell className="px-6 py-4">
                  {item.status === "approved" ? (
                    <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      <span className="w-1 h-1 rounded-full bg-green-600"></span>
                      Approved
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 py-0.5 px-2.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      <span className="w-1 h-1 rounded-full bg-red-600"></span>
                      Rejected
                    </span>
                  )}
                </TableCell>

                <TableCell className="px-6 py-4 text-sm text-right text-slate-400">
                  {item.reviewer}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};

export default ProcessedProvidersList;
