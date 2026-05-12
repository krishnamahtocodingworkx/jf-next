"use client";

import { useEffect } from "react";

export type DetailPageShimmerVariant = "product" | "ingredient";

function ShimmerBlock({ className }: { className: string }) {
    return <div className={`animate-pulse rounded bg-slate-200/80 ${className}`} />;
}

type DetailPageShimmerProps = {
    variant: DetailPageShimmerVariant;
};

export default function DetailPageShimmer({ variant }: DetailPageShimmerProps) {
    useEffect(() => {
            console.log("[DetailPageShimmer] mount", variant);
    }, [variant]);

    if (variant === "ingredient") {
        return (
            <div className="min-h-0 w-full bg-white" aria-hidden>
                <div className="border-b border-slate-200 bg-white">
                    <div className="px-6 py-4 max-w-7xl mx-auto">
                        <ShimmerBlock className="h-4 w-44 mb-4" />
                        <div className="flex items-start justify-between gap-4 flex-wrap">
                            <div className="flex items-center gap-4 min-w-0">
                                <ShimmerBlock className="h-16 w-16 rounded-xl shrink-0" />
                                <div className="min-w-0 space-y-2 flex-1">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <ShimmerBlock className="h-8 w-48 sm:w-64 max-w-full" />
                                        <ShimmerBlock className="h-5 w-5 rounded shrink-0" />
                                        <ShimmerBlock className="h-6 w-16 rounded-full shrink-0" />
                                    </div>
                                    <ShimmerBlock className="h-4 w-72 max-w-full" />
                                    <ShimmerBlock className="h-3 w-28" />
                                </div>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <ShimmerBlock className="h-10 w-10 rounded-lg" />
                                <ShimmerBlock className="h-10 w-10 rounded-lg" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                    <div className="space-y-6">
                        <ShimmerBlock className="aspect-square max-h-80 w-full rounded-2xl" />

                        <div>
                            <ShimmerBlock className="h-3 w-16 mb-2" />
                            <ShimmerBlock className="h-12 w-full rounded-xl" />
                        </div>

                        <div className="border-t border-slate-100 pt-6">
                            <div className="flex items-center gap-2 mb-4">
                                <ShimmerBlock className="h-4 w-4 rounded" />
                                <ShimmerBlock className="h-4 w-32" />
                            </div>
                        </div>

                        <div>
                            <ShimmerBlock className="h-3 w-24 mb-3" />
                            <div className="flex gap-3 flex-wrap">
                                <ShimmerBlock className="h-12 flex-1 min-w-[100px] rounded-xl" />
                                <ShimmerBlock className="h-12 flex-1 min-w-[100px] rounded-xl" />
                                <ShimmerBlock className="h-12 flex-1 min-w-[100px] rounded-xl" />
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-5 space-y-3">
                            <ShimmerBlock className="h-3 w-40" />
                            <ShimmerBlock className="h-10 w-48 rounded-lg" />
                        </div>

                        <div className="border-t border-slate-100 pt-5 space-y-3">
                            <ShimmerBlock className="h-3 w-28" />
                            <div className="flex flex-wrap gap-2">
                                <ShimmerBlock className="h-8 w-24 rounded-lg" />
                                <ShimmerBlock className="h-8 w-28 rounded-lg" />
                            </div>
                        </div>

                        <div className="border-t border-slate-100 pt-5 space-y-3">
                            <ShimmerBlock className="h-3 w-24" />
                            <ShimmerBlock className="h-10 w-40 rounded-lg" />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            {Array.from({ length: 3 }).map((_, i) => (
                                <div key={i} className="bg-slate-50 rounded-xl p-4 space-y-3">
                                    <div className="flex items-center gap-2">
                                        <ShimmerBlock className="h-7 w-7 rounded-lg" />
                                        <ShimmerBlock className="h-3 w-16" />
                                    </div>
                                    <ShimmerBlock className="h-8 w-14" />
                                </div>
                            ))}
                        </div>

                        {Array.from({ length: 4 }).map((_, i) => (
                            <div
                                key={i}
                                className="border border-slate-200 rounded-xl overflow-hidden bg-white"
                            >
                                <div className="flex items-center justify-between p-4 bg-slate-50">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <ShimmerBlock className="h-9 w-9 rounded-lg shrink-0" />
                                        <ShimmerBlock className="h-5 w-40 sm:w-52 max-w-full" />
                                        {i === 3 ? (
                                            <ShimmerBlock className="h-5 w-14 rounded-full shrink-0" />
                                        ) : null}
                                    </div>
                                    <ShimmerBlock className="h-5 w-5 rounded shrink-0" />
                                </div>
                            </div>
                        ))}

                        <div className="bg-slate-50 rounded-xl p-4 space-y-3">
                            <ShimmerBlock className="h-3 w-28" />
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <ShimmerBlock className="h-5 w-5 rounded" />
                                    <div className="space-y-2">
                                        <ShimmerBlock className="h-8 w-12" />
                                        <ShimmerBlock className="h-3 w-24" />
                                    </div>
                                </div>
                                <div className="flex gap-6">
                                    <div className="space-y-2 text-center">
                                        <ShimmerBlock className="h-5 w-8 mx-auto" />
                                        <ShimmerBlock className="h-3 w-12 mx-auto" />
                                    </div>
                                    <div className="space-y-2 text-center">
                                        <ShimmerBlock className="h-5 w-8 mx-auto" />
                                        <ShimmerBlock className="h-3 w-14 mx-auto" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3 pt-2">
                            <ShimmerBlock className="h-10 flex-1 rounded-lg" />
                            <ShimmerBlock className="h-10 w-24 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-0 w-full space-y-6 max-w-7xl mx-auto" aria-hidden>
            <ShimmerBlock className="h-4 w-40" />

            <div className="flex items-start justify-between gap-4 flex-wrap">
                <div className="space-y-3 min-w-0 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                        <ShimmerBlock className="h-8 w-56 sm:w-72 max-w-full" />
                        <ShimmerBlock className="h-6 w-20 rounded-full" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <ShimmerBlock className="h-4 w-36" />
                        <ShimmerBlock className="h-4 w-28" />
                        <ShimmerBlock className="h-4 w-24" />
                    </div>
                    <div className="flex flex-wrap gap-4">
                        <ShimmerBlock className="h-4 w-44" />
                        <ShimmerBlock className="h-4 w-40" />
                    </div>
                </div>
                <ShimmerBlock className="h-10 w-28 rounded-lg shrink-0" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl border border-slate-200 p-6">
                        <div className="flex gap-8 flex-col sm:flex-row">
                            <ShimmerBlock className="h-48 w-48 rounded-xl shrink-0 mx-auto sm:mx-0" />
                            <div className="flex-1 space-y-4 w-full min-w-0">
                                <div className="grid grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <ShimmerBlock className="h-3 w-16" />
                                        <ShimmerBlock className="h-8 w-20" />
                                    </div>
                                    <div className="space-y-2">
                                        <ShimmerBlock className="h-3 w-24" />
                                        <ShimmerBlock className="h-8 w-20" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <ShimmerBlock className="h-3 w-12" />
                                    <ShimmerBlock className="h-8 w-32" />
                                </div>
                            </div>
                        </div>
                        <div className="mt-6 flex flex-wrap gap-4 px-4 py-3 bg-slate-100 rounded-lg">
                            <ShimmerBlock className="h-4 w-40" />
                            <ShimmerBlock className="h-4 w-36" />
                            <ShimmerBlock className="h-4 w-44" />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-3">
                            <ShimmerBlock className="h-4 w-24" />
                            <ShimmerBlock className="h-4 w-4 rounded" />
                        </div>
                        <div className="flex flex-wrap gap-2">
                            <ShimmerBlock className="h-8 w-24 rounded-full" />
                            <ShimmerBlock className="h-8 w-32 rounded-full" />
                            <ShimmerBlock className="h-8 w-28 rounded-full" />
                        </div>
                    </div>

                    <div className="rounded-xl border border-slate-200 bg-white p-4 space-y-3">
                        <div className="flex justify-between gap-4">
                            <ShimmerBlock className="h-5 w-40" />
                            <ShimmerBlock className="h-8 w-28 rounded-lg" />
                        </div>
                        <ShimmerBlock className="h-3 w-full max-w-md" />
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 p-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                            {Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="text-center space-y-2">
                                    <ShimmerBlock className="h-3 w-20 mx-auto" />
                                    <ShimmerBlock className="h-6 w-14 mx-auto" />
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <ShimmerBlock className="h-4 w-4 rounded" />
                        <ShimmerBlock className="h-4 w-28" />
                    </div>

                    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-2 gap-2 overflow-x-auto">
                            <div className="flex gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <ShimmerBlock key={i} className="h-9 w-28 sm:w-32 rounded-lg shrink-0" />
                                ))}
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <ShimmerBlock className="h-9 w-9 rounded-lg" />
                                <ShimmerBlock className="h-9 w-9 rounded-lg" />
                            </div>
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="space-y-2">
                                <ShimmerBlock className="h-3 w-full max-w-2xl" />
                                <ShimmerBlock className="h-3 w-full max-w-lg" />
                                <ShimmerBlock className="h-3 w-full max-w-md" />
                            </div>
                            <div className="grid grid-cols-6 gap-2 pt-2">
                                <ShimmerBlock className="h-10 col-span-2 rounded-lg" />
                                {Array.from({ length: 4 }).map((_, i) => (
                                    <ShimmerBlock key={i} className="h-8 rounded-full" />
                                ))}
                            </div>
                            <ShimmerBlock className="h-10 w-44 rounded-lg mt-4" />
                        </div>
                    </div>

                    <ShimmerBlock className="h-12 w-full rounded-xl" />
                </div>

                <div className="space-y-4">
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                        <div className="flex justify-between">
                            <ShimmerBlock className="h-4 w-36" />
                            <ShimmerBlock className="h-4 w-6" />
                        </div>
                        <ShimmerBlock className="h-4 w-4 mx-auto rounded" />
                    </div>
                    <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3">
                        <ShimmerBlock className="h-4 w-28" />
                        {Array.from({ length: 6 }).map((_, i) => (
                            <div key={i} className="flex items-center justify-between gap-3">
                                <div className="flex items-center gap-3 min-w-0">
                                    <ShimmerBlock className="h-8 w-8 rounded-lg shrink-0" />
                                    <ShimmerBlock className="h-4 flex-1 max-w-[140px]" />
                                </div>
                                <ShimmerBlock className="h-4 w-12 shrink-0" />
                            </div>
                        ))}
                        <ShimmerBlock className="h-4 w-24 mx-auto mt-2" />
                    </div>
                </div>
            </div>
        </div>
    );
}
