"use client";

import { Ingredient } from "@/components/ingredients/types";
import { AlertTriangle, Eye, Leaf, Scale, ShieldCheck } from "lucide-react";

type Props = {
  ingredient: Ingredient;
  onView: () => void;
};

const statusStyleMap: Record<string, string> = {
  active: "bg-emerald-100 text-emerald-700",
  flagged: "bg-red-100 text-red-700",
  pending: "bg-amber-100 text-amber-700",
};

export default function IngredientGridCard({ ingredient, onView }: Props) {
  return (
    <article className="rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold text-slate-800">{ingredient.name}</h3>
          <p className="text-xs text-slate-500">{ingredient.subCategory}</p>
        </div>
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
            statusStyleMap[ingredient.status] || "bg-slate-100 text-slate-700"
          }`}
        >
          {ingredient.status}
        </span>
      </div>

      <div className="mt-3 flex items-center justify-between text-xs text-slate-600">
        <span>{ingredient.supplier}</span>
        <span className="font-semibold text-slate-800">{ingredient.pricePerKg}</span>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-lg bg-slate-50 p-2 text-center">
          <p className="font-semibold text-slate-800">{ingredient.nutritionScore}</p>
          <div className="flex items-center justify-center gap-1 text-slate-500">
            <Scale className="h-3 w-3" />
            Nutrition
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2 text-center">
          <p className="font-semibold text-slate-800">{ingredient.sustainabilityScore}</p>
          <div className="flex items-center justify-center gap-1 text-slate-500">
            <Leaf className="h-3 w-3" />
            Sustain
          </div>
        </div>
        <div className="rounded-lg bg-slate-50 p-2 text-center">
          <p className="font-semibold text-slate-800">{ingredient.costScore}</p>
          <div className="flex items-center justify-center gap-1 text-slate-500">
            <ShieldCheck className="h-3 w-3" />
            Cost
          </div>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <span className="text-xs text-slate-500">{ingredient.productsCount} products</span>
        <div className="flex items-center gap-2">
          {ingredient.alert && <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />}
          <button
            type="button"
            onClick={onView}
            className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
          >
            <Eye className="h-3.5 w-3.5" />
            View
          </button>
        </div>
      </div>
    </article>
  );
}
