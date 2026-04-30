import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ManageToursSkeleton() {
    return (
        <Card className="overflow-hidden rounded-[2rem] border-none bg-white py-0 shadow-sm">
            <CardContent className="space-y-6 p-5 md:p-6">
                <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                    <div className="flex gap-2">
                        {[1, 2, 3, 4].map((i) => (
                            <Skeleton key={i} className="h-10 w-24 rounded-xl" />
                        ))}
                    </div>

                    <div className="flex flex-col gap-3 md:flex-row md:items-center">
                        <Skeleton className="h-11 w-[300px] rounded-xl" />

                        <div className="flex flex-col gap-2 w-[220px]">
                            <Skeleton className="h-3 w-24" />
                            <Skeleton className="h-4 w-full" />
                            <div className="flex justify-between">
                                <Skeleton className="h-3 w-16" />
                                <Skeleton className="h-3 w-16" />
                            </div>
                        </div>

                        <Skeleton className="h-11 w-[150px] rounded-xl" />
                    </div>
                </div>

                <div className="overflow-hidden rounded-[1.5rem] border border-slate-200">
                    <div className="p-4 space-y-4">
                        {[1, 2, 3, 4, 5].map((row) => (
                            <div key={row} className="grid grid-cols-4 gap-4 items-center">
                                <div className="flex items-center gap-3">
                                    <Skeleton className="h-14 w-14 rounded-2xl" />
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-40" />
                                        <Skeleton className="h-3 w-28" />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-3 w-20" />
                                </div>

                                <Skeleton className="h-6 w-20 rounded-full" />

                                <div className="flex justify-end gap-2">
                                    <Skeleton className="h-9 w-9 rounded-xl" />
                                    <Skeleton className="h-9 w-9 rounded-xl" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-40" />

                    <div className="flex gap-2">
                        <Skeleton className="h-9 w-9 rounded-xl" />
                        <Skeleton className="h-9 w-9 rounded-xl" />
                        <Skeleton className="h-9 w-9 rounded-xl" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
