"use client";

import { useEffect, useMemo, useState } from "react";
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
} from "lucide-react";
import {
    ComplianceBadge,
    ComplianceIssueCard,
    ComplianceSummaryRow,
    DataSourceBadge,
    RegionTag,
} from "@/components/compliance/ComplianceComponents";
import { getComplianceStatusColor, type ProductComplianceStatus } from "@/lib/compliance-data";
import { deriveProductComplianceFromApi, readProductDataSourceFromApi } from "@/utils/productComplianceFromApi";
import { fetchProductDetail } from "@/redux/product/product-thunks";
import { clearProductDetail } from "@/redux/product/product-slice";
import type { AppDispatch, RootState } from "@/redux/store";
import type { IProductCatalogRow } from "@/interfaces/product";

type ProductDetailDrawerProps = {
    product: IProductCatalogRow | null;
    onClose: () => void;
    onEdit?: () => void;
    asPage?: boolean;
};

const tabs = [
    { id: "current" as const, label: "Current Version", isAction: false },
    { id: "nutrition" as const, label: "Nutrition", isAction: false },
    { id: "compliance" as const, label: "Compliance", isAction: false },
    { id: "label" as const, label: "Generate Label", isAction: true },
    { id: "packaging" as const, label: "Matched Packaging", isAction: false },
];

const versionHistory = [{ id: 1, date: "02/22/24" as string }];

function readStr(r: Record<string, unknown> | undefined, keys: string[]): string {
    if (!r) return "—";
    for (const k of keys) {
        const v = r[k];
        if (v != null && String(v).trim() !== "") return String(v);
    }
    return "—";
}

export default function ProductDetailDrawer({
    product,
    onClose,
    onEdit,
    asPage = false,
}: ProductDetailDrawerProps) {
    const dispatch = useDispatch<AppDispatch>();
    const detail = useSelector((s: RootState) => s.product.detail);
    const [activeTab, setActiveTab] = useState<
        "current" | "nutrition" | "label" | "packaging" | "compliance"
    >("current");
    const [showVersionHistory, setShowVersionHistory] = useState(false);

    useEffect(() => {
        if (!product) return;
        if (asPage) return;
        console.log("[ProductDetailDrawer] fetch detail", product.id);
        void dispatch(fetchProductDetail(product.id));
        return () => {
            console.log("[ProductDetailDrawer] clear on unmount");
            dispatch(clearProductDetail());
        };
    }, [product, dispatch, asPage]);

    const complianceStatus: ProductComplianceStatus = useMemo(
        () => deriveProductComplianceFromApi(detail.data, product?.id ?? ""),
        [detail.data, product?.id],
    );

    const ingredientDisplay = useMemo(() => {
        const raw = detail.data?.ingredients;
        const list = Array.isArray(raw) ? raw : [];
        const weights = list.map((ing) => {
            const w = ing?.weight;
            if (typeof w === "number" && Number.isFinite(w)) return w;
            if (typeof w === "string" && w.trim() !== "") {
                const n = parseFloat(w);
                return Number.isFinite(n) ? n : 0;
            }
            return 0;
        });
        const sum = weights.reduce((a, b) => a + b, 0);
        return list.map((ing, i) => ({
            key: String(ing?.ingredient?.id ?? i),
            name: ing?.ingredient?.jf_display_name || "Ingredient",
            pct: sum > 0 ? (weights[i]! / sum) * 100 : 100 / Math.max(list.length, 1),
        }));
    }, [detail.data?.ingredients]);

    if (!product) return null;

    const d = detail.data;
    const meta = (d ?? {}) as Record<string, unknown>;

    const brandStr =
        typeof d?.brand === "object" && d?.brand && "name" in d.brand
            ? String((d.brand as { name?: string }).name || product.brandName)
            : typeof d?.brand === "string"
              ? d.brand
              : product.brandName;
    const companyDisplay = readStr(meta, ["company_name", "company", "company_id"]);
    const skuStr = d?.code ? String(d.code) : product.id;
    const typeLabel = product.product_status ? "Retail" : "Concept";
    const ingList = d?.ingredients ?? [];

    const dataSource = readProductDataSourceFromApi(d);

    const createdByStr = readStr(meta, ["created_by", "createdBy", "uploaded_by", "author"]);
    const lastUpdatedStr =
        readStr(meta, ["updated_at", "last_updated", "updatedAt", "modified_at"]) !== "—"
            ? readStr(meta, ["updated_at", "last_updated", "updatedAt", "modified_at"])
            : new Date().toLocaleDateString();
    const dateCreatedStr = readStr(meta, [
        "created_date",
        "date_created",
        "createdDate",
        "createdAt",
        "dateCreated",
    ]);
    const fulfilmentStr = readStr(meta, ["fulfilment_date", "fulfillment_date", "fulfilmentDate"]);
    const flavorStr = readStr(meta, ["flavor", "flavour", "product_flavor"]);
    const servingStr = readStr(meta, [
        "serving_size",
        "servingSize",
        "serving_amount",
        "Serving Size",
    ]);
    const profitStr = readStr(meta, ["profit_margin", "profitMargin", "margin"]);
    const mfrStr = readStr(meta, ["manufacturer", "manufacturer_name", "manufacture"]);

    const rawObjectives = (d as { objective?: unknown } | undefined)?.objective;
    const objectives: string[] =
        Array.isArray(rawObjectives) && rawObjectives.length > 0
            ? rawObjectives.map((x) => String(x)).filter((s) => s.trim() !== "")
            : product.tags;

    const innerClass = asPage ? "space-y-6 max-w-7xl mx-auto" : "min-h-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6";

    return (
        <div
            className={
                asPage
                    ? "min-h-0 w-full"
                    : "fixed inset-0 z-50 overflow-y-auto bg-slate-50"
            }
        >
            <div className={innerClass}>
                <button
                    type="button"
                    onClick={onClose}
                    className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-800 transition-colors"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Back to Products
                </button>

                <div className="flex items-start justify-between">
                    <div>
                        <div className="flex items-center gap-3">
                            <h1 className="text-2xl font-bold text-slate-900">{product.name}</h1>
                            {dataSource ? <DataSourceBadge source={dataSource} size="md" /> : null}
                        </div>
                        <div className="flex items-center gap-4 mt-2 text-sm text-slate-500 flex-wrap">
                            <span>
                                <span className="font-medium text-slate-700">Company:</span>{" "}
                                {companyDisplay}
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
                                <span className="font-medium text-slate-700">Created By:</span>{" "}
                                {createdByStr}
                            </span>
                            <span>
                                <span className="font-medium text-slate-700">Last Updated:</span>{" "}
                                {lastUpdatedStr}
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
                            <div className="flex gap-8">
                                <div className="w-48 h-48 rounded-xl bg-linear-to-br from-slate-100 to-slate-50 border border-slate-200 flex items-center justify-center shrink-0">
                                    <Package className="h-20 w-20 text-slate-300" />
                                </div>
                                <div className="flex-1 space-y-4">
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Nutrition</p>
                                            <div className="flex items-center gap-2">
                                                <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center">
                                                    <span className="text-orange-500 text-xs">🍊</span>
                                                </div>
                                                <span className="text-2xl font-bold text-slate-800">
                                                    {product.nutrition}%
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-slate-500 mb-1">Sustainability</p>
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
                            <div className="mt-6 flex items-center gap-6 px-4 py-3 bg-slate-700 rounded-lg text-sm text-white flex-wrap">
                                <span>
                                    <span className="text-slate-300">SKU/Code:</span> {skuStr}
                                </span>
                                <span>
                                    <span className="text-slate-300">Date Created:</span>{" "}
                                    {dateCreatedStr}
                                </span>
                                <span>
                                    <span className="text-slate-300">Fulfilment Date:</span>{" "}
                                    {fulfilmentStr}
                                </span>
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-3">
                                <h3 className="text-sm font-semibold text-slate-700">Objectives</h3>
                                <Info className="h-4 w-4 text-slate-400" />
                            </div>
                            {objectives.length > 0 ? (
                                <div className="flex flex-wrap gap-2">
                                    {objectives.map((obj) => (
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

                        <ComplianceSummaryRow
                            status={complianceStatus.overallStatus}
                            regions={complianceStatus.regions}
                            issueCount={complianceStatus.issues.length}
                            onViewDetails={() => setActiveTab("compliance")}
                        />

                        <div className="bg-white rounded-xl border border-slate-200 p-5">
                            <div className="grid grid-cols-5 gap-4 text-center">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Ingredients:</p>
                                    <p className="text-lg font-bold text-slate-800">{ingList.length}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Flavor:</p>
                                    <p className="text-lg font-bold text-slate-800">
                                        {flavorStr !== "—" ? flavorStr : "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Serving Size:</p>
                                    <p className="text-lg font-bold text-slate-800">
                                        {servingStr !== "—" ? servingStr : "—"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Profit Margin:</p>
                                    <p className="text-lg font-bold text-slate-800">
                                        {profitStr !== "—" ? `${profitStr} %` : "— %"}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1">Manufacturer:</p>
                                    <p className="text-lg font-bold text-slate-800 truncate">
                                        {mfrStr !== "—" ? mfrStr : "—"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Share2 className="h-4 w-4 text-slate-400" />
                            <span className="text-sm text-slate-500">Data Source:</span>
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                            <div className="flex items-center justify-between border-b border-slate-200 px-4">
                                <div className="flex">
                                    {tabs.map((tab) => (
                                        <button
                                            key={tab.id}
                                            type="button"
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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
                                <div className="flex items-center gap-2">
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
                                    activeTab === "nutrition" ||
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
                                                {versionHistory.map((v) => (
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
                                                        <td className="py-3 text-center">
                                                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                                                                Nutrition
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                                                                Supply Chain
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                                                                Cost
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                                                                Sustainability
                                                            </span>
                                                        </td>
                                                        <td className="py-3 text-center">
                                                            <span className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full">
                                                                Popularity
                                                            </span>
                                                        </td>
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
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <Shield
                                                    className={`h-5 w-5 ${getComplianceStatusColor(complianceStatus.overallStatus).text}`}
                                                />
                                                <h3 className="font-semibold text-slate-800">
                                                    Regulatory Compliance
                                                </h3>
                                                <ComplianceBadge status={complianceStatus.overallStatus} />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {complianceStatus.regions.map((r) => (
                                                    <RegionTag key={r} regionCode={r} size="sm" />
                                                ))}
                                            </div>
                                        </div>

                                        <p className="text-xs text-slate-500">
                                            Last checked:{" "}
                                            {new Date(complianceStatus.lastChecked).toLocaleDateString()} at{" "}
                                            {new Date(complianceStatus.lastChecked).toLocaleTimeString()}
                                        </p>

                                        {complianceStatus.issues.length > 0 ? (
                                            <div className="space-y-3">
                                                <h4 className="text-sm font-medium text-slate-700">
                                                    {complianceStatus.issues.length} Issue
                                                    {complianceStatus.issues.length !== 1 ? "s" : ""} Found
                                                </h4>
                                                {complianceStatus.issues.map((issue) => (
                                                    <ComplianceIssueCard
                                                        key={issue.id}
                                                        issue={issue}
                                                        showAiFix={true}
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="flex flex-col items-center justify-center py-8 text-center">
                                                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-3">
                                                    <Shield className="h-6 w-6 text-green-600" />
                                                </div>
                                                <h4 className="font-medium text-slate-800">All Clear</h4>
                                                <p className="text-sm text-slate-500 mt-1">
                                                    No regulatory compliance issues detected for this product.
                                                </p>
                                            </div>
                                        )}

                                        <div className="mt-6 pt-4 border-t border-slate-200">
                                            <h4 className="text-sm font-medium text-slate-700 mb-3">
                                                Applicable Regulations
                                            </h4>
                                            <div className="grid grid-cols-2 gap-2">
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                                                    <span className="text-xs font-medium text-slate-600">
                                                        FDA Food Labeling
                                                    </span>
                                                    <span className="text-xs text-slate-400">21 CFR</span>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                                                    <span className="text-xs font-medium text-slate-600">
                                                        EFSA Standards
                                                    </span>
                                                    <span className="text-xs text-slate-400">EU 1169/2011</span>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                                                    <span className="text-xs font-medium text-slate-600">
                                                        Health Canada
                                                    </span>
                                                    <span className="text-xs text-slate-400">Food & Drugs Act</span>
                                                </div>
                                                <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                                                    <span className="text-xs font-medium text-slate-600">
                                                        FSANZ Code
                                                    </span>
                                                    <span className="text-xs text-slate-400">Standard 1.2.7</span>
                                                </div>
                                            </div>
                                        </div>
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
                                {ingredientDisplay.length === 0 ? (
                                    <p className="text-sm text-slate-500">
                                        No ingredients on this product yet.
                                    </p>
                                ) : (
                                    ingredientDisplay.slice(0, 8).map((row) => (
                                        <div key={row.key} className="flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center overflow-hidden">
                                                    <span className="text-lg">🥔</span>
                                                </div>
                                                <span className="text-sm text-slate-700">{row.name}</span>
                                            </div>
                                            <span className="text-sm font-semibold text-emerald-600">
                                                {row.pct.toFixed(1)}%
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
