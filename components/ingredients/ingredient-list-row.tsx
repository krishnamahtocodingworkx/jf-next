"use client";

import { Leaf } from "lucide-react";
import ScoreRing from "@/components/products/score-ring";
import type { IIngredientCatalogRow } from "@/interfaces/ingredient";

type IngredientListRowProps = {
    ingredient: IIngredientCatalogRow;
    onView: () => void;
};

export default function IngredientListRow({ ingredient, onView }: IngredientListRowProps) {
    const status: "active" | "concept" | "flagged" = ingredient.flagged
        ? "flagged"
        : ingredient.activeProducts > 0
          ? "active"
          : "concept";

    return (
        <div
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0"
            onClick={onView}
        >
            <div className="h-10 w-10 rounded-lg bg-gradient-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center shrink-0">
                <Leaf className="h-5 w-5 text-emerald-500" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{ingredient.name}</p>
                <p className="text-xs text-slate-500">
                    {ingredient.category} &middot; {ingredient.form}
                </p>
            </div>

            <div className="hidden md:flex items-center gap-6">
                <div className="text-center w-16">
                    <p className="text-sm font-semibold text-slate-700">
                        {ingredient.nutritionScore}
                    </p>
                    <p className="text-xs text-slate-400">Nutrition</p>
                </div>
                <div className="text-center w-16">
                    <p className="text-sm font-semibold text-slate-700">
                        {ingredient.sustainabilityScore}
                    </p>
                    <p className="text-xs text-slate-400">Sustain.</p>
                </div>
                <div className="text-center w-16">
                    <p className="text-sm font-semibold text-slate-700">{ingredient.costScore}</p>
                    <p className="text-xs text-slate-400">Cost</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        status === "active"
                            ? "bg-green-100 text-green-700"
                            : status === "concept"
                              ? "bg-amber-100 text-amber-700"
                              : "bg-red-100 text-red-700"
                    }`}
                >
                    {status}
                </span>
                <ScoreRing value={ingredient.overallScore} size={36} />
            </div>
        </div>
    );
}
