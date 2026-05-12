"use client";

import { AlertTriangle, DollarSign, Leaf, Star, TrendingDown, TrendingUp } from "lucide-react";
import ScoreRing from "@/components/products/score-ring";
import type { IIngredientCatalogRow } from "@/interfaces/ingredient";

type IngredientGridCardProps = {
    ingredient: IIngredientCatalogRow;
    onView: () => void;
};

export default function IngredientGridCard({ ingredient, onView }: IngredientGridCardProps) {
    const status: "active" | "concept" | "flagged" = ingredient.flagged
        ? "flagged"
        : ingredient.activeProducts > 0
          ? "active"
          : "concept";

    return (
        <div
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
            onClick={onView}
        >
            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center shrink-0">
                    <Leaf className="h-6 w-6 text-emerald-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-800 truncate">
                            {ingredient.name}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                            {ingredient.starred && (
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            )}
                            <ScoreRing value={ingredient.overallScore} size={36} />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                        {ingredient.category} &middot; {ingredient.form}
                    </p>
                </div>
            </div>

            {ingredient.flagged && (
                <div className="flex items-center gap-2 p-2 bg-red-50 border border-red-200 rounded-lg mb-4 text-xs text-red-700">
                    <AlertTriangle className="h-3.5 w-3.5 text-red-500 shrink-0" />
                    <span className="truncate">Supplier audit scheduled</span>
                </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">
                        {ingredient.nutritionScore}
                    </p>
                    <p className="text-xs text-slate-400">Nutrition</p>
                </div>
                <div className="text-center border-x border-slate-100">
                    <p className="text-lg font-bold text-slate-800">
                        {ingredient.sustainabilityScore}
                    </p>
                    <p className="text-xs text-slate-400">Sustain.</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{ingredient.costScore}</p>
                    <p className="text-xs text-slate-400">Cost</p>
                </div>
            </div>

            <div className="flex flex-wrap gap-1.5 mb-4">
                {ingredient.certifications.slice(0, 3).map((c) => (
                    <span
                        key={c}
                        className="px-2 py-0.5 text-xs bg-emerald-50 text-emerald-600 rounded-md font-medium"
                    >
                        {c}
                    </span>
                ))}
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                        {ingredient.price > 0 ? ingredient.price.toFixed(2) : "-"}
                    </span>
                    <span className="text-xs text-slate-400">/{ingredient.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            status === "active"
                                ? "bg-green-100 text-green-700"
                                : status === "concept"
                                  ? "bg-amber-100 text-amber-700"
                                  : "bg-red-100 text-red-700"
                        }`}
                    >
                        {status}
                    </span>
                    {ingredient.trendPct > 0 && ingredient.trendPositive && (
                        <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            {ingredient.trendPct.toFixed(1)}%
                        </span>
                    )}
                    {ingredient.trendPct > 0 && !ingredient.trendPositive && (
                        <span className="flex items-center gap-0.5 text-xs font-medium text-red-600">
                            <TrendingDown className="h-3 w-3" />
                            {ingredient.trendPct.toFixed(1)}%
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
