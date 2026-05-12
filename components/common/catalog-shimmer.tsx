"use client";

type CatalogShimmerProps = {
    viewMode: "grid" | "list";
    count?: number;
};

function ShimmerBlock({ className }: { className: string }) {
    return <div className={`animate-pulse rounded bg-slate-200/80 ${className}`} />;
}

function GridCardShimmer() {
    return (
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                    <ShimmerBlock className="h-12 w-12 rounded-xl" />
                    <div className="space-y-2 min-w-0">
                        <ShimmerBlock className="h-4 w-32" />
                        <ShimmerBlock className="h-3 w-24" />
                    </div>
                </div>
                <ShimmerBlock className="h-8 w-8 rounded-full" />
            </div>

            <div className="mt-5 grid grid-cols-3 gap-3">
                <ShimmerBlock className="h-14 rounded-xl" />
                <ShimmerBlock className="h-14 rounded-xl" />
                <ShimmerBlock className="h-14 rounded-xl" />
            </div>

            <div className="mt-5 flex items-center justify-between">
                <div className="space-y-2">
                    <ShimmerBlock className="h-3 w-20" />
                    <ShimmerBlock className="h-4 w-16" />
                </div>
                <ShimmerBlock className="h-8 w-20 rounded-lg" />
            </div>
        </div>
    );
}

function ListRowShimmer() {
    return (
        <div className="flex items-center justify-between gap-4 border-b border-slate-100 bg-white p-4 last:border-b-0">
            <div className="flex items-center gap-3 min-w-0">
                <ShimmerBlock className="h-11 w-11 rounded-xl" />
                <div className="space-y-2 min-w-0">
                    <ShimmerBlock className="h-4 w-44" />
                    <ShimmerBlock className="h-3 w-28" />
                </div>
            </div>
            <div className="hidden items-center gap-6 md:flex">
                <ShimmerBlock className="h-8 w-12 rounded-full" />
                <ShimmerBlock className="h-8 w-12 rounded-full" />
                <ShimmerBlock className="h-8 w-12 rounded-full" />
                <ShimmerBlock className="h-4 w-16" />
            </div>
            <ShimmerBlock className="h-8 w-8 rounded-lg" />
        </div>
    );
}

export default function CatalogShimmer({ viewMode, count = 8 }: CatalogShimmerProps) {
    if (viewMode === "list") {
        return (
            <div className="rounded-lg border border-slate-100 bg-white overflow-hidden">
                {Array.from({ length: count }).map((_, index) => (
                    <ListRowShimmer key={index} />
                ))}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: count }).map((_, index) => (
                <GridCardShimmer key={index} />
            ))}
        </div>
    );
}
