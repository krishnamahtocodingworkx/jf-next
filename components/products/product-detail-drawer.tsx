"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    AlertTriangle,
    DollarSign,
    Package,
    Star,
    TrendingDown,
    TrendingUp,
    X,
    Zap,
} from "lucide-react";
import ScoreRing from "@/components/products/score-ring";
import { fetchProductDetail, clearProductDetail } from "@/redux/product/product-slice";
import type { AppDispatch, RootState } from "@/redux/store";
import type { IProductCatalogRow } from "@/interfaces/product";

type ProductDetailDrawerProps = {
    product: IProductCatalogRow | null;
    onClose: () => void;
    onEdit?: () => void;
};

export default function ProductDetailDrawer({
    product,
    onClose,
    onEdit,
}: ProductDetailDrawerProps) {
    const dispatch = useDispatch<AppDispatch>();
    const detail = useSelector((s: RootState) => s.product.detail);
    const [activeTab, setActiveTab] = useState<
        "current" | "nutrition" | "label" | "packaging" | "compliance"
    >("current");

    useEffect(() => {
        if (!product) return;
        console.log("[ProductDetailDrawer] fetch detail", product.id);
        void dispatch(fetchProductDetail(product.id));
        return () => {
            console.log("[ProductDetailDrawer] clear on unmount");
            dispatch(clearProductDetail());
        };
    }, [product, dispatch]);

    if (!product) return null;

    const TrendIcon =
        product.trendPositive && !product.trendStable
            ? TrendingUp
            : !product.trendStable
              ? TrendingDown
              : null;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40" onClick={onClose} />
            <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
                <div className="flex items-start justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-blue-100 to-indigo-50 border border-blue-200 flex items-center justify-center">
                            <Package className="h-7 w-7 text-blue-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-800">
                                    {product.name || "Untitled product"}
                                </h2>
                                {product.starred && (
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                )}
                            </div>
                            <p className="text-sm text-slate-500">
                                {product.brandName || "Unbranded"} · {product.subline || "—"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        product.product_status
                                            ? "bg-green-100 text-green-700"
                                            : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    {product.product_status ? "Active" : "Concept"}
                                </span>
                                {detail.status === "loading" && (
                                    <span className="text-xs text-slate-400">Loading...</span>
                                )}
                            </div>
                        </div>
                    </div>
                    <button
                        type="button"
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Close"
                    >
                        <X className="h-5 w-5 text-slate-500" />
                    </button>
                </div>

                {product.regulatoryWarning && (
                    <div className="mx-6 mt-4 flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{product.regulatoryWarning}</p>
                    </div>
                )}

                <div className="flex border-b border-slate-200 px-6 mt-4 overflow-x-auto">
                    {(["current", "nutrition", "label", "packaging", "compliance"] as const).map(
                        (tab) => (
                            <button
                                key={tab}
                                type="button"
                                onClick={() => setActiveTab(tab)}
                                className={`px-4 py-2.5 text-sm font-medium border-b-2 capitalize transition-colors whitespace-nowrap ${
                                    activeTab === tab
                                        ? "border-slate-800 text-slate-900"
                                        : "border-transparent text-slate-500 hover:text-slate-700"
                                }`}
                            >
                                {tab}
                            </button>
                        ),
                    )}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {activeTab === "current" && (
                        <>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: "Overall", value: product.overallScore },
                                    { label: "Nutrition", value: product.nutrition },
                                    { label: "Sustain.", value: product.sustain },
                                    { label: "Cost", value: product.cost },
                                ].map(({ label, value }) => (
                                    <div
                                        key={label}
                                        className="bg-slate-50 rounded-xl p-3 flex flex-col items-center gap-1"
                                    >
                                        <ScoreRing value={value} size={56} />
                                        <span className="text-xs text-slate-500 font-medium">
                                            {label}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                        <DollarSign className="h-3 w-3" />
                                        Price
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        ${product.price.toFixed(2)}
                                    </p>
                                    <div
                                        className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                                            product.trendStable
                                                ? "text-slate-400"
                                                : product.trendPositive
                                                  ? "text-green-500"
                                                  : "text-red-500"
                                        }`}
                                    >
                                        {TrendIcon ? <TrendIcon className="h-3 w-3" /> : null}
                                        {!product.trendStable
                                            ? `${Math.abs(product.trendPct)}% vs last period`
                                            : "No change"}
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                        <Package className="h-3 w-3" />
                                        Tags
                                    </p>
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        {(product.tags || []).slice(0, 6).map((t) => (
                                            <span
                                                key={t}
                                                className="px-2 py-0.5 text-xs bg-blue-50 text-blue-700 border border-blue-100 rounded-full font-medium"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                        {(product.tags || []).length === 0 && (
                                            <span className="text-xs text-slate-400">No tags</span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {detail.data?.notes ? (
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                        Notes
                                    </p>
                                    <p className="text-sm text-slate-700 whitespace-pre-wrap">
                                        {String(detail.data.notes)}
                                    </p>
                                </div>
                            ) : null}

                            {detail.data?.ingredients?.length ? (
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                        Ingredients ({detail.data.ingredients.length})
                                    </p>
                                    <ul className="text-sm text-slate-700 space-y-1">
                                        {detail.data.ingredients
                                            .slice(0, 12)
                                            .map((ing, idx) => (
                                                <li
                                                    key={`${ing?.ingredient?.id || idx}`}
                                                    className="flex items-center justify-between"
                                                >
                                                    <span>
                                                        {ing?.ingredient?.jf_display_name || "Ingredient"}
                                                    </span>
                                                    <span className="text-xs text-slate-500">
                                                        {ing?.weight ?? ""} {ing?.unit ?? ""}
                                                    </span>
                                                </li>
                                            ))}
                                    </ul>
                                </div>
                            ) : null}
                        </>
                    )}

                    {activeTab === "nutrition" && (
                        <div className="bg-slate-50 rounded-xl p-5 space-y-3">
                            {[
                                { label: "Nutrition Score", value: product.nutrition },
                                { label: "Sustainability Score", value: product.sustain },
                                { label: "Cost Efficiency", value: product.cost },
                            ].map(({ label, value }) => (
                                <div key={label}>
                                    <div className="flex justify-between text-xs text-slate-600 mb-1">
                                        <span>{label}</span>
                                        <span className="font-semibold">{value}/100</span>
                                    </div>
                                    <div className="h-2 bg-slate-200 rounded-full">
                                        <div
                                            className="h-2 rounded-full bg-green-500 transition-all"
                                            style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab !== "current" && activeTab !== "nutrition" && (
                        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} content will
                            appear here once the product has additional data on file.
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 flex gap-3">
                    {onEdit && (
                        <button
                            type="button"
                            onClick={onEdit}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <Zap className="h-4 w-4" />
                            Edit
                        </button>
                    )}
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-sm font-medium rounded-lg hover:bg-slate-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
