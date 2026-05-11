"use client";

import { Lightbulb, TrendingUp } from "lucide-react";

type CategoryItem = {
    label: string;
    count: number;
};

type Props = {
    categories: CategoryItem[];
};

export default function ProductCategoryPanel({ categories }: Props) {
    const topCategory = categories[0];

    return (
        <div
            className="rounded-xl p-5 text-white relative overflow-hidden flex flex-col"
            style={{ background: "linear-gradient(135deg, #334155 0%, #0f172a 100%)" }}
        >
            <div className="absolute top-4 right-4 opacity-20">
                <Lightbulb className="h-20 w-20" />
            </div>
            <p className="text-sm font-medium text-slate-300">Concept Products</p>
            <p className="text-4xl font-bold mt-1">{categories.length}</p>
            <p className="text-sm text-slate-300 mt-1">Product categories in view</p>

            <div className="flex items-center gap-1 mt-2 text-sm text-slate-300">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-green-400 font-medium">
                    {topCategory ? topCategory.label : "No categories yet"}
                </span>
            </div>

            <div className="mt-4 space-y-2 flex-1">
                {categories.slice(0, 3).map((category) => (
                    <div key={category.label} className="flex items-center justify-between text-sm">
                        <span className="text-slate-200 truncate pr-3">{category.label}</span>
                        <span className="font-semibold text-white">{category.count}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}