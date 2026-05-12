"use client";

import { AlertTriangle, DollarSign, Package, Star, TrendingDown, TrendingUp } from "lucide-react";
import ScoreRing from "@/components/products/ScoreRing";
import type { IProductCatalogRow } from "@/interfaces/product";

type ProductGridCardProps = {
    product: IProductCatalogRow;
    onView: () => void;
};

export default function ProductGridCard({ product, onView }: ProductGridCardProps) {
    const status: "active" | "concept" = product.product_status ? "active" : "concept";
    console.log("[ProductGridCard]", product.id);
    return (
        <div
            className="bg-white rounded-xl border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
            onClick={onView}
        >
            <div className="flex items-start gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-blue-500" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-semibold text-slate-800 truncate">{product.name}</h3>
                        <div className="flex items-center gap-1 shrink-0">
                            {product.starred && (
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                            )}
                            <ScoreRing value={product.overallScore} size={36} />
                        </div>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">{product.subline}</p>
                </div>
            </div>

            {product.regulatoryWarning && (
                <div className="flex items-center gap-2 p-2 bg-amber-50 border border-amber-200 rounded-lg mb-4 text-xs text-amber-700">
                    <AlertTriangle className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                    <span className="truncate">{product.regulatoryWarning}</span>
                </div>
            )}

            <div className="grid grid-cols-3 gap-2 mb-4">
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{product.nutrition}</p>
                    <p className="text-xs text-slate-400">Nutrition</p>
                </div>
                <div className="text-center border-x border-slate-100">
                    <p className="text-lg font-bold text-slate-800">{product.sustain}</p>
                    <p className="text-xs text-slate-400">Sustain.</p>
                </div>
                <div className="text-center">
                    <p className="text-lg font-bold text-slate-800">{product.cost || "-"}</p>
                    <p className="text-xs text-slate-400">Cost</p>
                </div>
            </div>

            {/* Mock: catalog tag chips (Omega-3, Vegan, etc.) — hidden per product request
            <div className="flex flex-wrap gap-1.5 mb-4">
                {product.tags.slice(0, 3).map((tag) => (
                    <span
                        key={tag}
                        className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-md font-medium"
                    >
                        {tag}
                    </span>
                ))}
            </div>
            */}

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                <div className="flex items-center gap-1">
                    <DollarSign className="h-3.5 w-3.5 text-slate-400" />
                    <span className="text-sm font-semibold text-slate-700">
                        {product.price > 0 ? product.price.toFixed(2) : "-"}
                    </span>
                </div>
                <div className="flex items-center gap-2">
                    <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                            status === "active"
                                ? "bg-green-100 text-green-700"
                                : "bg-amber-100 text-amber-700"
                        }`}
                    >
                        {status}
                    </span>
                    {!product.trendStable && product.trendPositive && (
                        <span className="flex items-center gap-0.5 text-xs font-medium text-green-600">
                            <TrendingUp className="h-3 w-3" />
                            {product.trendPct}%
                        </span>
                    )}
                    {!product.trendStable && !product.trendPositive && (
                        <span className="flex items-center gap-0.5 text-xs font-medium text-red-600">
                            <TrendingDown className="h-3 w-3" />
                            {product.trendPct}%
                        </span>
                    )}
                    {product.trendStable && <span className="text-xs text-slate-400">Stable</span>}
                </div>
            </div>
        </div>
    );
}
