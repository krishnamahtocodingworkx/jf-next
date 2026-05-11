"use client";

import { Product } from "@/components/products/types";
import { Eye } from "lucide-react";

type Props = {
    product: Product;
    onView: () => void;
};

export default function ProductListRow({ product, onView }: Props) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3 px-4 py-3 border-b border-slate-100 hover:bg-slate-50 bg-white">
            <div>
                <h3 className="text-sm font-semibold text-slate-800">{product.name}</h3>
                <p className="text-xs text-slate-500">
                    {product.primaryClass} • {product.productClass || "Uncategorized"}
                </p>
            </div>

            <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
                <p className="text-xs text-slate-600 min-w-16 text-center">{product.nutritionScore}</p>
                <p className="text-xs text-slate-600 min-w-16 text-center">{product.markup}%</p>
                <p className="text-xs text-slate-600 min-w-16 text-center">{product.costMargin}%</p>
                <p className="text-xs font-semibold text-slate-800 min-w-20 text-right">${product.cost.toFixed(2)}</p>
                <p className="text-xs text-slate-600 min-w-20 text-center capitalize">{product.status}</p>
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