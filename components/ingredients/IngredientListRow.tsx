"use client";

// List-view row for a single ingredient on the catalog page; dense layout for power users browsing many rows.
import { ChevronRight, Leaf, Star } from "lucide-react";
import type { IIngredientCatalogRow } from "@/interfaces/ingredient";

type IngredientListRowProps = {
    ingredient: IIngredientCatalogRow;
    onView: () => void;
};

export default function IngredientListRow({ ingredient, onView }: IngredientListRowProps) {
    const score = ingredient.overallScore;
    const scoreColor =
        score >= 85 ? "text-green-600 bg-green-50" : score >= 70 ? "text-amber-600 bg-amber-50" : "text-red-600 bg-red-50";

    const status: "active" | "concept" | "flagged" = ingredient.flagged
        ? "flagged"
        : ingredient.activeProducts > 0
          ? "active"
          : "concept";

    console.log("[IngredientListRow]", ingredient.id);

    return (
        <div
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 group"
            onClick={onView}
        >
            <div className="h-9 w-9 rounded-lg bg-linear-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center shrink-0">
                <Leaf className="h-4 w-4 text-green-600" />
            </div>

            <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-slate-800 truncate">{ingredient.name}</p>
                    {ingredient.starred && (
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400 shrink-0" />
                    )}
                    {/* Mock: flagged supplier-audit icon — hidden per product request
                    {ingredient.flagged && <AlertTriangle className="h-3 w-3 text-red-500 shrink-0" />}
                    */}
                </div>
                <p className="text-xs text-slate-500">
                    {ingredient.category} · {ingredient.form} · {ingredient.origin}
                </p>
            </div>

            <div className="hidden md:flex items-center gap-6 text-xs text-slate-600 shrink-0">
                <div className="text-center w-14">
                    <p className="text-[10px] text-slate-400">Nutrition</p>
                    <p className="font-semibold">{ingredient.nutritionScore}</p>
                </div>
                <div className="text-center w-14">
                    <p className="text-[10px] text-slate-400">Sustain.</p>
                    <p className="font-semibold">{ingredient.sustainabilityScore}</p>
                </div>
                <div className="text-center w-14">
                    <p className="text-[10px] text-slate-400">Cost</p>
                    <p className="font-semibold">{ingredient.costScore}</p>
                </div>
                <div className="text-right w-20">
                    <p className="text-[10px] text-slate-400">Price/kg</p>
                    <p className="font-semibold">
                        {ingredient.price > 0 ? `$${ingredient.price.toFixed(2)}` : "—"}
                    </p>
                </div>
                <div className="text-center w-16">
                    <p className="text-[10px] text-slate-400">Products</p>
                    <p className="font-semibold">
                        {ingredient.activeProducts + ingredient.conceptProducts}
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${scoreColor}`}>
                    {score}
                </span>
                <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                        status === "active"
                            ? "bg-green-100 text-green-700"
                            : status === "flagged"
                              ? "bg-red-100 text-red-700"
                              : "bg-amber-100 text-amber-700"
                    }`}
                >
                    {status}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
        </div>
    );
}
