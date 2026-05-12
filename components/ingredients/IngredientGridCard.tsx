"use client";

import { DollarSign, Leaf, Package, Star, TrendingDown, TrendingUp, Zap } from "lucide-react";
import type { IIngredientCatalogRow } from "@/interfaces/ingredient";

type IngredientGridCardProps = {
    ingredient: IIngredientCatalogRow;
    onView: () => void;
};

export default function IngredientGridCard({ ingredient, onView }: IngredientGridCardProps) {
    const score = ingredient.overallScore;
    const scoreColor =
        score >= 85 ? "text-green-600" : score >= 70 ? "text-amber-600" : "text-red-600";
    const scoreBg =
        score >= 85
            ? "bg-green-50 border-green-200"
            : score >= 70
              ? "bg-amber-50 border-amber-200"
              : "bg-red-50 border-red-200";

    const trendUp = ingredient.trendPct > 0 && ingredient.trendPositive;
    const trendDown = ingredient.trendPct > 0 && !ingredient.trendPositive;
    /* Mock: supplier audit banner — hidden per product request
    const alertText = ingredient.flagged ? "Supplier audit scheduled" : null;
    */

    console.log("[IngredientGridCard]", ingredient.id, ingredient.name);

    return (
        <div
            className="bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md transition-all cursor-pointer group"
            onClick={onView}
        >
            <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                    <div className="h-11 w-11 rounded-xl bg-linear-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center shrink-0">
                        <Leaf className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-slate-800 truncate leading-tight">
                            {ingredient.name}
                        </h3>
                        <p className="text-xs text-slate-500 mt-0.5">
                            {ingredient.category} · {ingredient.form}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                    {ingredient.starred && (
                        <Star className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400" />
                    )}
                    <span
                        className={`text-xs px-2 py-0.5 rounded-full font-medium border ${scoreBg} ${scoreColor}`}
                    >
                        {score}
                    </span>
                </div>
            </div>

            {/* {alertText && (
                <div className="mb-3 flex items-center gap-1.5 text-xs text-red-600 bg-red-50 rounded-lg px-2.5 py-1.5">
                    <AlertTriangle className="h-3 w-3 shrink-0" />
                    <span className="truncate">{alertText}</span>
                </div>
            )} */}

            <div className="grid grid-cols-3 gap-2 mb-3">
                {(
                    [
                        { label: "Nutrition", value: ingredient.nutritionScore },
                        { label: "Sustain.", value: ingredient.sustainabilityScore },
                        { label: "Cost", value: ingredient.costScore },
                    ] as const
                ).map(({ label, value }) => (
                    <div key={label} className="text-center bg-slate-50 rounded-lg py-2">
                        <p className="text-xs font-bold text-slate-700">{value}</p>
                        <p className="text-[10px] text-slate-400">{label}</p>
                    </div>
                ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1 text-sm font-semibold text-slate-700">
                    <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                    {ingredient.price > 0 ? ingredient.price.toFixed(2) : "—"}
                    <span className="text-xs text-slate-400 font-normal">/{ingredient.unit}</span>
                </div>
                <div
                    className={`flex items-center gap-0.5 text-xs font-medium ${
                        trendUp ? "text-red-500" : trendDown ? "text-green-500" : "text-slate-400"
                    }`}
                >
                    {trendUp ? (
                        <TrendingUp className="h-3 w-3" />
                    ) : trendDown ? (
                        <TrendingDown className="h-3 w-3" />
                    ) : null}
                    {ingredient.trendPct !== 0
                        ? `${Math.abs(ingredient.trendPct).toFixed(1)}%`
                        : "Stable"}
                </div>
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-slate-500">
                <span className="flex items-center gap-1">
                    <Package className="h-3 w-3" />
                    {ingredient.activeProducts} active
                </span>
                <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    {ingredient.conceptProducts} concept
                </span>
                <span className="ml-auto text-slate-400">{ingredient.origin}</span>
            </div>
        </div>
    );
}
