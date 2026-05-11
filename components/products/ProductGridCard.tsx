"use client";

import { Product } from "@/components/products/types";
import { Eye, Package, ShieldCheck, Tag } from "lucide-react";

type Props = {
    product: Product;
    onView: () => void;
};

const statusStyleMap: Record<Product["status"], string> = {
    active: "bg-emerald-100 text-emerald-700",
    inactive: "bg-amber-100 text-amber-700",
};

export default function ProductGridCard({ product, onView }: Props) {
    return (
        <article className="rounded-xl border border-slate-200 p-4 hover:shadow-sm transition-shadow bg-white">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h3 className="text-sm font-semibold text-slate-800 line-clamp-2">{product.name}</h3>
                    <p className="text-xs text-slate-500 mt-1">{product.primaryClass}</p>
                </div>
                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyleMap[product.status]}`}>
                    {product.status}
                </span>
            </div>

            <div className="mt-3 flex items-center justify-between text-xs text-slate-600 gap-3">
                <span className="flex items-center gap-1 truncate"><Tag className="h-3.5 w-3.5" />{product.productClass || "Uncategorized"}</span>
                <span className="font-semibold text-slate-800">${product.cost.toFixed(2)}</span>
            </div>

            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="font-semibold text-slate-800">{product.nutritionScore}</p>
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                        <ShieldCheck className="h-3 w-3" />
                        Nutrition
                    </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="font-semibold text-slate-800">{product.markup}%</p>
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                        <Package className="h-3 w-3" />
                        Markup
                    </div>
                </div>
                <div className="rounded-lg bg-slate-50 p-2 text-center">
                    <p className="font-semibold text-slate-800">{product.costMargin}%</p>
                    <div className="flex items-center justify-center gap-1 text-slate-500">
                        <Tag className="h-3 w-3" />
                        Margin
                    </div>
                </div>
            </div>

            <div className="mt-3 flex items-center justify-between">
                <span className="text-xs text-slate-500">{product.id}</span>
                <button
                    type="button"
                    onClick={onView}
                    className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                >
                    <Eye className="h-3.5 w-3.5" />
                    View
                </button>
            </div>
        </article>
    );
}