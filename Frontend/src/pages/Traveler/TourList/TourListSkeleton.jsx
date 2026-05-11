import { Skeleton } from "@/components/ui/skeleton";

export default function TourListSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 9 }).map((_, i) => (
                <div key={i} className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <Skeleton className="aspect-[4/3] w-full rounded-none" />

                    <div className="space-y-5 p-5">
                        <div className="flex gap-2">
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-5 w-16 rounded-full" />
                        </div>

                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-2">
                                <Skeleton className="h-3 w-10" />
                                <Skeleton className="h-7 w-28" />
                            </div>
                            <Skeleton className="h-12 w-20 rounded-2xl" />
                        </div>

                        <div className="space-y-2">
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-4 w-2/3" />
                        </div>

                        <div className="grid grid-cols-3 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50">
                            <Skeleton className="h-[72px] rounded-none" />
                            <Skeleton className="h-[72px] rounded-none" />
                            <Skeleton className="h-[72px] rounded-none" />
                        </div>

                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}
