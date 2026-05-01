import React from "react";

export default function TourDetailSkeleton() {
    return (
        <div className="animate-pulse bg-surface font-body">
            {/* HERO */}
            <div className="h-[716px] w-full bg-gray-200 relative">
                <div className="absolute bottom-0 left-0 w-full p-8 md:p-16 space-y-4">
                    <div className="h-6 w-32 bg-gray-300 rounded-full" />
                    <div className="h-12 w-2/3 bg-gray-300 rounded-xl" />
                    <div className="h-4 w-1/2 bg-gray-300 rounded" />
                </div>
            </div>

            <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    {/* LEFT CONTENT */}
                    <div className="lg:col-span-8 space-y-12">
                        {/* overview */}
                        <div className="space-y-4">
                            <div className="h-6 w-64 bg-gray-300 rounded" />
                            <div className="h-4 w-full bg-gray-200 rounded" />
                            <div className="h-4 w-5/6 bg-gray-200 rounded" />
                        </div>

                        {/* feature cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
                            ))}
                        </div>

                        {/* timeline */}
                        <div className="space-y-8">
                            <div className="h-6 w-48 bg-gray-300 rounded" />

                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="pl-12 space-y-3 relative">
                                    <div className="absolute left-0 top-1 w-8 h-8 rounded-full bg-gray-300" />
                                    <div className="h-5 w-32 bg-gray-300 rounded" />
                                    <div className="h-4 w-full bg-gray-200 rounded" />
                                    <div className="grid grid-cols-2 gap-3">
                                        <div className="h-16 bg-gray-200 rounded-xl" />
                                        <div className="h-16 bg-gray-200 rounded-xl" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="h-[500px] bg-gray-200 rounded-3xl" />

                        <div className="h-[120px] bg-gray-200 rounded-2xl" />
                        <div className="h-[120px] bg-gray-200 rounded-2xl" />
                        <div className="h-[120px] bg-gray-200 rounded-2xl" />

                        <div className="h-32 bg-gray-200 rounded-2xl" />

                        <div className="h-12 bg-gray-300 rounded-xl" />
                    </div>
                </div>

                {/* REVIEWS */}
                <div className="mt-20 space-y-6">
                    <div className="h-6 w-56 bg-gray-300 rounded" />

                    <div className="grid lg:grid-cols-3 gap-6">
                        <div className="h-64 bg-gray-200 rounded-2xl" />

                        <div className="lg:col-span-2 space-y-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}