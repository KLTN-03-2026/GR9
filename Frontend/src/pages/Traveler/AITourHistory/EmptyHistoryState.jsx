import { Plane } from "lucide-react";

export default function EmptyHistoryState() {
  return (
    <div className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white px-6 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-50 text-teal-700">
        <Plane className="h-7 w-7" />
      </div>
      <h2 className="text-xl font-bold text-slate-950">
        No generated tours yet
      </h2>
      <p className="mt-2 max-w-md text-sm text-slate-500">
        Generate a tour with AI and it will be saved here automatically.
      </p>
    </div>
  );
}
