"use client";

import { Link, ShoppingBag, X } from "lucide-react";
import type { PackageDetailDrawerProps } from "@/utils/model";
import PackagingScoreBadge from "@/components/packaging/PackagingScoreBadge";
import { filterProductsByAssociatedIds, getScoreBarClassName } from "@/utils/packaging-helpers";

export default function PackageDetailDrawer({
    pkg,
    products,
    onClose,
    onAssociate,
    copy,
    scoreBadgeCopy,
}: PackageDetailDrawerProps) {
    const associated = filterProductsByAssociatedIds(products, pkg.associatedProducts);

    const statCells = [
        { label: copy.statLabels.type, value: pkg.type },
        { label: copy.statLabels.material, value: pkg.material },
        { label: copy.statLabels.market, value: pkg.market },
        { label: copy.statLabels.costVariance, value: pkg.costVariance ?? copy.costVarianceNoData },
    ];

    return (
        <div className="fixed inset-0 bg-black/30 z-50 flex justify-end" onClick={onClose}>
            <div
                className="bg-white w-full max-w-sm h-full overflow-y-auto shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="sticky top-0 bg-white border-b border-slate-100 p-5 flex items-start justify-between">
                    <div>
                        <h3 className="font-semibold text-slate-800 leading-snug">{pkg.name}</h3>
                        <span className="inline-block mt-1 text-xs font-medium px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full">{pkg.tag}</span>
                    </div>
                    <button type="button" onClick={onClose} className="p-1.5 hover:bg-slate-100 rounded-lg">
                        <X className="h-4 w-4 text-slate-500" />
                    </button>
                </div>

                <div className="p-5 space-y-5">
                    <div className="grid grid-cols-2 gap-3">
                        {statCells.map(({ label, value }) => (
                            <div key={label} className="bg-slate-50 rounded-xl p-3">
                                <p className="text-xs text-slate-500 mb-0.5">{label}</p>
                                <p className="text-sm font-semibold text-slate-800 leading-tight">{value}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-xs font-medium text-slate-500">{copy.packagingScore}</p>
                            <PackagingScoreBadge score={pkg.score} copy={scoreBadgeCopy} />
                        </div>
                        {pkg.score !== null && (
                            <div className="w-full bg-slate-200 rounded-full h-2">
                                <div
                                    className={`h-2 rounded-full transition-all ${getScoreBarClassName(pkg.score)}`}
                                    style={{ width: `${pkg.score}%` }}
                                />
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-3">
                            <p className="text-sm font-semibold text-slate-800">{copy.associatedProducts}</p>
                            <button
                                type="button"
                                onClick={onAssociate}
                                className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors"
                            >
                                <Link className="h-3.5 w-3.5" />
                                {copy.manageLink}
                            </button>
                        </div>
                        {associated.length === 0 ? (
                            <p className="text-xs text-slate-400 italic">{copy.emptyAssociated}</p>
                        ) : (
                            <div className="space-y-2">
                                {associated.map((prod) => (
                                    <div key={prod.id} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl">
                                        <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center shrink-0">
                                            <ShoppingBag className="h-4 w-4 text-blue-600" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-slate-800 truncate">{prod.name}</p>
                                            <p className="text-xs text-slate-500">{prod.sku}</p>
                                        </div>
                                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full shrink-0 ${
                                            prod.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                                        }`}>
                                            {prod.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
