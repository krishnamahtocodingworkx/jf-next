"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    ChevronDown,
    ChevronLeft,
    ChevronUp,
    DollarSign,
    Info,
    Leaf,
    Package,
    Pencil,
    Search,
    Share2,
    Shield,
    ShoppingCart,
    Sparkles,
    Star,
} from "lucide-react";
import { fetchProductDetail } from "@/redux/product/product-thunks";
import { clearProductDetail } from "@/redux/product/product-slice";
import type { AppDispatch, RootState } from "@/redux/store";
import type { IProductCatalogRow } from "@/interfaces/product";

type ProductDetailDrawerProps = {
    product: IProductCatalogRow | null;
    onClose: () => void;
    onEdit?: () => void;
};

const tabs = [
    { id: "current" as const, label: "Current Version", isAction: false },
    { id: "nutrition" as const, label: "Nutrition", isAction: false },
    { id: "compliance" as const, label: "Compliance", isAction: false },
    { id: "label" as const, label: "Generate Label", isAction: true },
    { id: "packaging" as const, label: "Matched Packaging", isAction: false },
];

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
    const [showVersionHistory, setShowVersionHistory] = useState(false);

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

    const d = detail.data;
    const brandStr =
        typeof d?.brand === "object" && d?.brand && "name" in d.brand
            ? String((d.brand as { name?: string }).name || product.brandName)
            : typeof d?.brand === "string"
              ? d.brand
              : product.brandName;
    const companyStr = String((d as Record<string, unknown> | undefined)?.company_id ?? "—");
    const skuStr = d?.code ? String(d.code) : product.id;

    const typeLabel = product.product_status ? "Retail" : "Concept";
    const ingList = d?.ingredients ?? [];
    const versionRows = [{ id: 1, date: new Date().toLocaleDateString() }];

    return (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-50">
            <div className="min-h-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Products
                </button>

                <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 flex-wrap">
                            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                            {product.starred && (
                                <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 shrink-0" />
                            )}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 flex-wrap">
                            <span>
                                <span className="font-medium text-slate-700">Company:</span>{" "}
                                {companyStr}
                            </span>
                            <span>
                                <span className="font-medium text-slate-700">Brand:</span> {brandStr}
                            </span>
                            <span>
                                <span className="font-medium text-slate-700">Version:</span>{" "}
                                {d?.version != null ? String(d.version) : "—"}
                            </span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 flex-wrap">
                            <span>
                                <span className="font-medium text-slate-700">Catalog:</span>{" "}
                                {product.subline || "—"}
                            </span>
                            <span>
                                <span className="font-medium text-slate-700">Last viewed:</span>{" "}
                                {new Date().toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                    <button
                        type="button"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors shrink-0"
                    >
                        <ShoppingCart className="h-4 w-4" />
                        {typeLabel}
                    </button>
                </div>

                {product.regulatoryWarning && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                        <p className="text-sm font-medium text-red-800 mb-1">Regulatory</p>
                        <p className="text-sm text-red-700">{product.regulatoryWarning}</p>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white rounded-xl border border-slate-200 p-6">
                            <div className="flex gap-8 flex-col sm:flex-row">
                                <div className="w-48 h-48 rounded-xl bg-linear-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center shrink-0 mx-auto sm:mx-0">
                                    <Package className="h-20 w-20 text-slate-300" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Nutrition</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 text-xs">
                                                    🍊
                                                </div>
                                                <span className="text-2xl font-bold text-slate-800">
                                                    {product.nutrition}%
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">
                                                Sustainability
                                            </p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                                                    <Leaf className="h-3.5 w-3.5 text-green-500" />
                                                </div>
                                                <span className="text-2xl font-bold text-slate-800">
                                                    {product.sustain}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-sm text-slate-500 mb-1">Cost</p>
                                        <div className="flex items-center gap-2">
                                            <DollarSign className="h-5 w-5 text-slate-400" />
                                            <span className="text-2xl font-bold text-slate-800">
                                                {product.price > 0 ? product.price.toFixed(2) : "—"}
                                                /kg
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex flex-wrap items-center gap-4 sm:gap-6 px-4 py-3 bg-slate-700 rounded-lg text-sm text-white">
                                <span>
                                    <span className="text-slate-300">SKU/Code:</span> {skuStr}
                                </span>
                                <span>
                                    <span className="text-slate-300">Date Created:</span> —{" "}
                                </span>
                                <span>
                                    <span className="text-slate-300">Fulfilment Date:</span> —
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-sm font-semibold text-slate-700">Objectives</h3>
                                <Info className="h-4 w-4 text-slate-400" />
                            </div>
                            {product.tags.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {product.tags.map((obj) => (
                                        <span
                                            key={obj}
                                            className="px-3 py-1.5 bg-blue-50 text-blue-700 text-sm rounded-full border border-blue-200"
                                        >
                                            {obj}
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-slate-400 italic">No objectives set</p>
                            )}
                        </div>

                        <div className="rounded-xl border border-amber-200 bg-amber-50/80 p-4 flex items-center justify-between gap-3 flex-wrap">
                            <div className="flex items-center gap-2">
                                <Shield className="h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="text-sm font-semibold text-slate-800">
                                        Regulatory compliance
                                    </p>
                                    <p className="text-xs text-slate-600">
                                        Summary will reflect API data when connected.
                                    </p>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={() => setActiveTab("compliance")}
                                className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                                View details
                            </button>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Ingredients:</p>
                                    <p className="text-lg font-bold text-slate-800">{ingList.length}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Flavor:</p>
                                    <p className="text-lg font-bold text-slate-800">—</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Serving Size:</p>
                                    <p className="text-lg font-bold text-slate-800">—</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Profit Margin:</p>
                                    <p className="text-lg font-bold text-slate-800">— %</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Manufacturer:</p>
                                    <p className="text-lg font-bold text-slate-800 truncate">—</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-500">Data Source: catalog</span>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between border-b border-slate-200 px-4 overflow-x-auto">
                                <div className="flex min-w-0">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                                                activeTab === tab.id
                                                    ? tab.isAction
                                                        ? "border-transparent"
                                                        : "border-slate-800 text-slate-900"
                                                    : "border-transparent text-slate-500 hover:text-slate-700"
                                            } ${tab.isAction ? "bg-blue-600 text-white rounded-lg my-2 mx-1" : ""}`}
                                        >
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 shrink-0 pl-2">
                                    <button
                                        type="button"
                                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                    >
                                        <Search className="h-4 w-4 text-slate-500" />
                                    </button>
                                    {onEdit ? (
                                        <button
                                            type="button"
                                            onClick={onEdit}
                                            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Pencil className="h-4 w-4 text-slate-500" />
                                        </button>
                                    ) : null}
                                </div>
                            </div>

                            <div className="p-4">
                                {(activeTab === "current" ||
                                    activeTab === "packaging" ||
                                    activeTab === "label") && (
                                    <>
                                        <table className="w-full">
                                            <thead>
                                                <tr className="text-xs text-slate-500">
                                                    <th className="text-left py-2 font-medium">
                                                        Current version
                                                    </th>
                                                    <th className="text-center py-2 font-medium">-</th>
                                                    <th className="text-center py-2 font-medium">-</th>
                                                    <th className="text-center py-2 font-medium">-</th>
                                                    <th className="text-center py-2 font-medium">-</th>
                                                    <th className="text-center py-2 font-medium">-</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {versionRows.map((v) => (
                                                    <tr key={v.id} className="border-t border-slate-100">
                                                        <td className="py-3">
                                                            <div className="flex items-center gap-2">
                                                                <div className="w-4 h-4 rounded-full bg-blue-600 flex items-center justify-center">
                                                                    <span className="text-white text-[10px]">
                                                                        {v.id}
                                                                    </span>
                                                                </div>
                                                                <span className="text-xs text-slate-400">*</span>
                                                                <span className="text-sm text-slate-600">
                                                                    {v.date}
                                                                </span>
                                                            </div>
                                                        </td>
                                                        {["Nutrition", "Supply Chain", "Cost", "Sustainability", "Popularity"].map(
                                                            (lab) => (
                                                                <td key={lab} className="py-3 text-center">
                                                                    <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                                                                        {lab}
                                                                    </span>
                                                                </td>
                                                            ),
                                                        )}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                        <button
                                            type="button"
                                            onClick={() => setShowVersionHistory(!showVersionHistory)}
                                            className="flex items-center gap-2 mt-4 px-4 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors"
                                        >
                                            Version History
                                            {showVersionHistory ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                        </button>
                                        {showVersionHistory && (
                                            <div className="mt-3 p-4 bg-slate-50 rounded-lg">
                                                <p className="text-sm text-slate-500">
                                                    No previous versions available
                                                </p>
                                            </div>
                                        )}
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
                                                        style={{
                                                            width: `${Math.min(100, Math.max(0, value))}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                {activeTab === "compliance" && (
                                    <div className="flex flex-col items-center justify-center py-8 text-center">
                                        <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                            <Shield className="h-6 w-6 text-green-600" />
                                        </div>
                                        <h4 className="font-medium text-slate-800">Compliance overview</h4>
                                        <p className="text-sm text-slate-500 mt-1 max-w-md">
                                            Connect compliance services to mirror the Journey Foods dashboard
                                            issue lists and regional badges.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:opacity-95 transition-all shadow-lg shadow-blue-500/25"
                        >
                            <Sparkles className="h-4 w-4" />
                            Generate AI Recommendations
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-sm font-semibold text-slate-700">Recommendations:</span>
                                <span className="text-sm font-bold text-blue-600">0</span>
                            </div>
                            <ChevronDown className="h-4 w-4 text-slate-400 mx-auto" />
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-4">
                            <h3 className="text-sm font-semibold text-slate-700 mb-4">Ingredients</h3>
                            <div className="space-y-3">
                                {ingList.length === 0 ? (
                                    <p className="text-sm text-slate-500">No ingredients on this product yet.</p>
                                ) : (
                                    ingList.slice(0, 8).map((ing, i) => (
                                        <div key={ing?.ingredient?.id ?? i} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center overflow-hidden shrink-0">
                                                    <span className="text-lg">🥔</span>
                                                </div>
                                                <span className="text-sm text-slate-700 truncate">
                                                    {ing?.ingredient?.jf_display_name || "Ingredient"}
                                                </span>
                                            </div>
                                            <span className="text-sm font-semibold text-emerald-600 shrink-0">
                                                {(100 / Math.max(ingList.length, 1)).toFixed(1)}%
                                            </span>
                                        </div>
                                    ))
                                )}
                            </div>
                            <button
                                type="button"
                                className="w-full mt-4 text-sm text-blue-600 hover:text-blue-700 font-medium"
                            >
                                View More
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
