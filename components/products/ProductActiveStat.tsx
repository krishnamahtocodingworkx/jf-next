"use client";

import { Package, TrendingUp } from "lucide-react";

type Props = {
    activeCount: number;
    total: number;
    averageNutritionScore: number;
};

export default function ProductActiveStat({ activeCount, total, averageNutritionScore }: Props) {
    return (
        <div
            className="rounded-xl p-5 text-white relative overflow-hidden h-full flex flex-col"
            style={{ background: "linear-gradient(135deg, #22c55e 0%, #059669 100%)" }}
        >
            <div className="absolute top-4 right-4 opacity-20">
                <Package className="h-20 w-20" />
            </div>
            <p className="text-sm font-medium text-green-100">Active Products</p>
            <p className="text-4xl font-bold mt-1">{activeCount}</p>
            <p className="text-sm text-green-100 mt-1">In your catalog</p>
            <div className="flex items-center gap-1 mt-2 text-sm text-green-100">
                <TrendingUp className="h-3.5 w-3.5" />
                <span className="text-green-200 font-medium">Avg score {averageNutritionScore.toFixed(0)} / {total || 0}</span>
            </div>
        </div>
    );
}