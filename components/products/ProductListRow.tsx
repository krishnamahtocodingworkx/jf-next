"use client";

// List-view row for a single product on the catalog page; compact alternate layout to the grid card.
import { Package } from "lucide-react";
import ScoreRing from "@/components/products/ScoreRing";
import type { IProductCatalogRow } from "@/interfaces/product";

type ProductListRowProps = {
    product: IProductCatalogRow;
    onView: () => void;
};

export default function ProductListRow({ product, onView }: ProductListRowProps) {
    const status: "active" | "concept" = product.product_status ? "active" : "concept";
    console.log("[ProductListRow]", product.id);
    return (
        <div
            className="flex items-center gap-4 px-4 py-3.5 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-100 last:border-0 group"
            onClick={onView}
        >
            <div className="h-10 w-10 rounded-lg bg-linear-to-br from-blue-100 to-blue-50 border border-blue-200 flex items-center justify-center shrink-0">
                <Package className="h-5 w-5 text-blue-500" />
            </div>

            <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-slate-800 truncate">{product.name}</p>
                <p className="text-xs text-slate-500">{product.subline}</p>
            </div>

            <div className="flex items-center gap-6 shrink-0">
                <div className="text-center w-16">
                    <p className="text-sm font-semibold text-slate-700">{product.nutrition}</p>
                    <p className="text-xs text-slate-400">Nutrition</p>
                </div>
                <div className="text-center w-16">
                    <p className="text-sm font-semibold text-slate-700">{product.sustain}</p>
                    <p className="text-xs text-slate-400">Sustain.</p>
                </div>
                <div className="text-center w-16">
                    <p className="text-sm font-semibold text-slate-700">{product.cost || "-"}</p>
                    <p className="text-xs text-slate-400">Cost</p>
                </div>
            </div>

            <div className="flex items-center gap-3">
                <span
                    className={`px-2.5 py-1 text-xs font-medium rounded-full ${
                        status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-amber-100 text-amber-700"
                    }`}
                >
                    {status}
                </span>
                <ScoreRing value={product.overallScore} size={36} />
            </div>
        </div>
    );
}
