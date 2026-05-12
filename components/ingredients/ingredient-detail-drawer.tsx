"use client";

import { useState } from "react";
import {
    DollarSign,
    Leaf,
    Package,
    Star,
    TrendingDown,
    TrendingUp,
    X,
    Zap,
} from "lucide-react";
import ScoreRing from "@/components/products/score-ring";
import type { IIngredientCatalogRow } from "@/interfaces/ingredient";

type IngredientDetailDrawerProps = {
    ingredient: IIngredientCatalogRow | null;
    onClose: () => void;
};

export default function IngredientDetailDrawer({
    ingredient,
    onClose,
}: IngredientDetailDrawerProps) {
    const [activeTab, setActiveTab] = useState<"overview" | "nutrition" | "supply" | "products">(
        "overview",
    );

    if (!ingredient) return null;

    const TrendIcon =
        ingredient.trendPct === 0
            ? null
            : ingredient.trendPositive
              ? TrendingUp
              : TrendingDown;

    return (
        <div className="fixed inset-0 z-50 flex">
            <div className="flex-1 bg-black/40" onClick={onClose} />
            <div className="w-full max-w-xl bg-white shadow-2xl flex flex-col overflow-hidden">
                <div className="flex items-start justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl bg-linear-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center">
                            <Leaf className="h-7 w-7 text-green-600" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-lg font-bold text-slate-800">
                                    {ingredient.name}
                                </h2>
                                {ingredient.starred && (
                                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                )}
                            </div>
                            <p className="text-sm text-slate-500">
                                {ingredient.category || "—"} · {ingredient.form || "—"} ·{" "}
                                {ingredient.origin || "—"}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                                <span
                                    className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                                        ingredient.flagged
                                            ? "bg-red-100 text-red-700"
                                            : ingredient.activeProducts > 0
                                              ? "bg-green-100 text-green-700"
                                              : "bg-amber-100 text-amber-700"
                                    }`}
                                >
                                    {ingredient.flagged
                                        ? "Flagged"
                                        : ingredient.activeProducts > 0
                                          ? "Active"
                                          : "Concept"}
                                </span>
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

                <div className="flex border-b border-slate-200 px-6 mt-4">
                    {(["overview", "nutrition", "supply", "products"] as const).map((tab) => (
                        <button
                            key={tab}
                            type="button"
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2.5 text-sm font-medium border-b-2 capitalize transition-colors ${
                                activeTab === tab
                                    ? "border-slate-800 text-slate-900"
                                    : "border-transparent text-slate-500 hover:text-slate-700"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                    {activeTab === "overview" && (
                        <>
                            <div className="grid grid-cols-4 gap-3">
                                {[
                                    { label: "Overall", value: ingredient.overallScore },
                                    { label: "Nutrition", value: ingredient.nutritionScore },
                                    { label: "Sustain.", value: ingredient.sustainabilityScore },
                                    { label: "Cost", value: ingredient.costScore },
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
                                        Price per {ingredient.unit || "kg"}
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        ${ingredient.price.toFixed(2)}
                                    </p>
                                    <div
                                        className={`flex items-center gap-1 mt-1 text-xs font-medium ${
                                            ingredient.trendPct === 0
                                                ? "text-slate-400"
                                                : ingredient.trendPositive
                                                  ? "text-green-500"
                                                  : "text-red-500"
                                        }`}
                                    >
                                        {TrendIcon ? <TrendIcon className="h-3 w-3" /> : null}
                                        {ingredient.trendPct !== 0
                                            ? `${Math.abs(ingredient.trendPct)}% vs last period`
                                            : "No change"}
                                    </div>
                                </div>
                                <div className="bg-slate-50 rounded-xl p-4">
                                    <p className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                                        <Package className="h-3 w-3" />
                                        Product usage
                                    </p>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {ingredient.activeProducts + ingredient.conceptProducts}
                                    </p>
                                    <p className="text-xs text-slate-500 mt-1">
                                        {ingredient.activeProducts} active ·{" "}
                                        {ingredient.conceptProducts} concept
                                    </p>
                                </div>
                            </div>

                            {ingredient.certifications.length > 0 && (
                                <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                        Certifications
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {ingredient.certifications.map((c) => (
                                            <span
                                                key={c}
                                                className="px-2.5 py-1 text-xs bg-green-50 text-green-700 border border-green-200 rounded-full font-medium"
                                            >
                                                {c}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            <div className="bg-slate-50 rounded-xl p-4">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
                                    Supplier
                                </p>
                                <p className="text-sm font-semibold text-slate-800">
                                    {ingredient.category || "Unknown supplier"}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                    Origin: {ingredient.origin || "—"}
                                </p>
                            </div>
                        </>
                    )}

                    {activeTab === "nutrition" && (
                        <div className="bg-slate-50 rounded-xl p-5">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-4">
                                Nutritional profile
                            </p>
                            {[
                                { label: "Nutrition Score", value: ingredient.nutritionScore },
                                {
                                    label: "Sustainability Score",
                                    value: ingredient.sustainabilityScore,
                                },
                                { label: "Cost Efficiency", value: ingredient.costScore },
                            ].map(({ label, value }) => (
                                <div key={label} className="mb-3">
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

                    {activeTab === "supply" && (
                        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                            Supply chain history will appear here when available.
                        </div>
                    )}

                    {activeTab === "products" && (
                        <div className="rounded-xl border border-dashed border-slate-200 p-6 text-center text-sm text-slate-500">
                            Used in {ingredient.activeProducts + ingredient.conceptProducts}{" "}
                            products
                        </div>
                    )}
                </div>

                <div className="p-4 border-t border-slate-200 flex gap-3">
                    <button
                        type="button"
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                    >
                        <Zap className="h-4 w-4" />
                        Analyze
                    </button>
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
