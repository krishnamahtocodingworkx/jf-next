"use client";

import { Ingredient } from "@/components/ingredients/types";
import { AlertTriangle, Eye } from "lucide-react";

type Props = {
  ingredient: Ingredient;
  onView: () => void;
};

export default function IngredientListRow({ ingredient, onView }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50">
      <div>
        <h3 className="text-sm font-semibold text-slate-800">{ingredient.name}</h3>
        <p className="text-xs text-slate-500">
          {ingredient.subCategory} • {ingredient.supplier}
        </p>
      </div>

      <div className="flex items-center gap-4">
        <p className="text-xs text-slate-600 min-w-16 text-center">{ingredient.nutritionScore}</p>
        <p className="text-xs text-slate-600 min-w-16 text-center">{ingredient.sustainabilityScore}</p>
        <p className="text-xs text-slate-600 min-w-16 text-center">{ingredient.costScore}</p>
        <p className="text-xs font-semibold text-slate-800 min-w-20 text-right">{ingredient.pricePerKg}</p>
        <p className="text-xs text-slate-600 min-w-12 text-center">{ingredient.productsCount}</p>
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
  );
}
