import { Skeleton } from "@/components/ui/skeleton";

export default function TourListSkeleton() {
    return (
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                    {/* IMAGE - match aspect ratio */}
                    <Skeleton className="aspect-[4/5] w-full" />

                    <div className="p-6">
                        {/* type badge + favorite row */}
                        <div className="flex justify-between mb-4">
                            <Skeleton className="h-5 w-20 rounded-full" />
                            <Skeleton className="h-10 w-10 rounded-full" />
                        </div>

                        {/* location */}
                        <Skeleton className="h-4 w-1/2 mb-2" />

                        {/* title */}
                        <Skeleton className="h-6 w-3/4 mb-6" />

                        {/* price + rating */}
                        <div className="flex justify-between items-center mb-6">
                            <Skeleton className="h-6 w-24" />
                            <Skeleton className="h-4 w-20" />
                        </div>

                        {/* meta */}
                        <div className="flex gap-4 mb-8">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-16" />
                        </div>

                        {/* button */}
                        <Skeleton className="h-11 w-full rounded-xl" />
                    </div>
                </div>
            ))}
        </div>
    );
}
