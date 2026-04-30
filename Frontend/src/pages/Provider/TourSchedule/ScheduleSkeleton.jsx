import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleSkeleton() {
    return (
        <div className="rounded-2xl border bg-white shadow-sm overflow-hidden">

            {/* header */}
            <div className="px-6 py-5 border-b bg-slate-50/60">
                <Skeleton className="h-5 w-40" />
            </div>

            {/* rows */}
            <div className="p-6 space-y-4">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="grid grid-cols-6 gap-4 items-center">
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-5 w-full" />
                        <div className="flex justify-end gap-2">
                            <Skeleton className="h-8 w-8 rounded-xl" />
                            <Skeleton className="h-8 w-8 rounded-xl" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}