"use client";

import { useCallback, useState } from "react";
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    Package,
    AlertTriangle,
    Zap,
    Eye,
    Link,
    Check,
    Box,
} from "lucide-react";
import type { PackagingDashboardCopy, PackagingDashboardProps, PackageItem } from "@/utils/model";
import {
    PACKAGING_ITEMS_PER_PAGE,
    packagingPackagesData,
    packagingProductsData,
    packagingSustainabilityPointsData,
} from "@/utils/mockData";
import { PACKAGING_STRINGS } from "@/utils/strings";
import AssociatePackageModal from "@/components/packaging/AssociatePackageModal";
import PackageDetailDrawer from "@/components/packaging/PackageDetailDrawer";
import PackagingScoreBadge from "@/components/packaging/PackagingScoreBadge";
import SustainabilityMiniChart from "@/components/packaging/SustainabilityMiniChart";
import {
    getCostVarianceTextClassName,
    getPackagingTagPillClassName,
} from "@/utils/packaging-helpers";

const defaultPackagingDashboardCopy: PackagingDashboardCopy = PACKAGING_STRINGS.packagingDashboard;

function applyPackagingCountTemplate(template: string, count: number): string {
    return template.replace(/\{count\}/g, String(count));
}

export default function PackagingDashboard({
    packages: initialPackages,
    products: initialProducts,
    copy = defaultPackagingDashboardCopy,
}: PackagingDashboardProps) {
    const [packages, setPackages] = useState<PackageItem[]>(initialPackages ?? packagingPackagesData);
    const [products] = useState(initialProducts ?? packagingProductsData);
    const [page, setPage] = useState(1);
    const [showAll, setShowAll] = useState(false);
    const [selectedPkg, setSelectedPkg] = useState<PackageItem | null>(null);
    const [associatingPkg, setAssociatingPkg] = useState<PackageItem | null>(null);

    const displayed = showAll ? packages : packages.filter((p) => p.tag === "Retail");
    const totalPages = Math.ceil(displayed.length / PACKAGING_ITEMS_PER_PAGE);
    const paginated = displayed.slice((page - 1) * PACKAGING_ITEMS_PER_PAGE, page * PACKAGING_ITEMS_PER_PAGE);

    const unmatchedActive = products.filter((p) => p.status === "Active" && !p.packagingId).length;
    const unmatchedConcept = products.filter((p) => p.status === "Concept" && !p.packagingId).length;

    const handleSaveAssociations = useCallback(
        (pkgId: string, productIds: string[]) => {
            console.log("[Packaging] save associations", { pkgId, productIds });
            setPackages((prev) =>
                prev.map((p) => (p.id === pkgId ? { ...p, associatedProducts: productIds } : p))
            );
            setAssociatingPkg(null);
            if (selectedPkg?.id === pkgId) {
                setSelectedPkg((prev) => (prev ? { ...prev, associatedProducts: productIds } : null));
            }
        },
        [selectedPkg?.id]
    );

    const c = copy;
    const unmatchedTotal = unmatchedActive + unmatchedConcept;

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="text-sm font-semibold text-slate-800">{c.actions.title}</span>
                        <Bell className="h-4 w-4 text-slate-400" />
                    </div>
                    <div className="space-y-3">
                        {[
                            { label: c.actions.notificationsPending, count: 0 },
                            { label: c.actions.actionsPending, count: 0 },
                        ].map(({ label, count }) => (
                            <div key={label} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-2xl font-bold text-slate-800">{count}</span>
                                    <span className="text-xs text-slate-500">{label}</span>
                                </div>
                                <button type="button" className="text-xs text-blue-600 font-medium hover:text-blue-700 transition-colors">
                                    {c.actions.viewAll}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-xl p-5 text-white" style={{ background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 50%, #818cf8 100%)" }}>
                    <div className="space-y-3">
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold">{unmatchedActive}</span>
                            <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 py-0.5">
                                <Box className="h-3.5 w-3.5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-white/80">{c.unmatched.unmatchedLabel}</p>
                                <p className="text-xs font-semibold">{c.unmatched.activeProducts}</p>
                            </div>
                        </div>
                        <div className="h-px bg-white/20" />
                        <div className="flex items-center gap-2">
                            <span className="text-3xl font-bold">{unmatchedConcept}</span>
                            <div className="flex items-center gap-1.5 bg-white/20 rounded-lg px-2 py-0.5">
                                <Package className="h-3.5 w-3.5" />
                            </div>
                            <div>
                                <p className="text-xs font-medium text-white/80">{c.unmatched.unmatchedLabel}</p>
                                <p className="text-xs font-semibold">{c.unmatched.conceptProducts}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <SustainabilityMiniChart points={packagingSustainabilityPointsData} copy={c.sustainabilityChart} />
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-semibold text-slate-800">{c.recommendations.title}</h2>
                        <span className="text-sm font-medium text-blue-600">
                            {applyPackagingCountTemplate(c.recommendations.matchedPackagesLineTemplate, displayed.length)}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1 text-sm text-slate-600">
                            <button
                                type="button"
                                disabled={page === 1}
                                onClick={() => setPage((p) => Math.max(1, p - 1))}
                                className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((n) => (
                                <button
                                    key={n}
                                    type="button"
                                    onClick={() => setPage(n)}
                                    className={`w-7 h-7 rounded-lg text-xs font-medium transition-colors ${
                                        page === n ? "bg-slate-800 text-white" : "hover:bg-slate-100 text-slate-600"
                                    }`}
                                >
                                    {n}
                                </button>
                            ))}
                            <button
                                type="button"
                                disabled={page === totalPages}
                                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                className="p-1 rounded-lg hover:bg-slate-100 disabled:opacity-30 transition-colors"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="px-6 py-3 border-b border-slate-100 flex items-center gap-2">
                    <button
                        type="button"
                        role="checkbox"
                        aria-checked={showAll}
                        onClick={() => {
                            setShowAll((v) => !v);
                            setPage(1);
                        }}
                        className={`h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                            showAll ? "bg-slate-800 border-slate-800" : "border-slate-300 bg-white"
                        }`}
                    >
                        {showAll && <Check className="h-2.5 w-2.5 text-white" />}
                    </button>
                    <span className="text-sm text-slate-600">{c.recommendations.showAllPackages}</span>
                </div>

                <div className="grid grid-cols-12 gap-4 px-6 py-3 text-xs font-medium text-slate-500 border-b border-slate-100">
                    <span className="col-span-1" />
                    <span className="col-span-4">{c.recommendations.tableHeaders.packageName}</span>
                    <span className="col-span-2 text-right">{c.recommendations.tableHeaders.costVariance}</span>
                    <span className="col-span-2">{c.recommendations.tableHeaders.market}</span>
                    <span className="col-span-1">{c.recommendations.tableHeaders.material}</span>
                    <span className="col-span-1 text-center">{c.recommendations.tableHeaders.score}</span>
                    <span className="col-span-1 text-right">{c.recommendations.tableHeaders.actions}</span>
                </div>

                <div className="divide-y divide-slate-100">
                    {paginated.map((pkg) => {
                        const assocCount = pkg.associatedProducts.length;
                        const tagPill = getPackagingTagPillClassName(pkg.tag);
                        const linkedTemplate =
                            assocCount === 1
                                ? c.recommendations.linkedProductsSingularTemplate
                                : c.recommendations.linkedProductsPluralTemplate;
                        return (
                            <div
                                key={pkg.id}
                                className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-slate-50 transition-colors group"
                            >
                                <div className="col-span-1 flex items-center justify-center">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center">
                                        <Package className="h-5 w-5 text-slate-400" />
                                    </div>
                                </div>

                                <div className="col-span-4">
                                    <div className="flex items-center gap-2 flex-wrap">
                                        <span className="text-sm font-medium text-slate-800">{pkg.name}</span>
                                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${tagPill}`}>
                                            {pkg.tag}
                                        </span>
                                    </div>
                                    {assocCount > 0 && (
                                        <p className="text-xs text-emerald-600 mt-0.5 font-medium">
                                            {applyPackagingCountTemplate(linkedTemplate, assocCount)}
                                        </p>
                                    )}
                                </div>

                                <div className="col-span-2 text-right">
                                    {pkg.costVariance ? (
                                        <span className={`text-sm font-semibold ${getCostVarianceTextClassName(pkg.costVariance)}`}>
                                            {pkg.costVariance}
                                        </span>
                                    ) : (
                                        <span className="text-slate-400 text-sm">{c.scoreBadge.emptyLabel}</span>
                                    )}
                                </div>

                                <div className="col-span-2">
                                    <span className="text-xs text-slate-600">{pkg.market}</span>
                                </div>

                                <div className="col-span-1">
                                    <span className="text-xs text-slate-500 leading-tight line-clamp-2">{pkg.material}</span>
                                </div>

                                <div className="col-span-1 flex justify-center">
                                    <PackagingScoreBadge score={pkg.score} copy={c.scoreBadge} />
                                </div>

                                <div className="col-span-1 flex items-center justify-end gap-1">
                                    <button
                                        type="button"
                                        title={c.recommendations.associateProductsAriaTitle}
                                        onClick={() => setAssociatingPkg(pkg)}
                                        className="p-1.5 rounded-lg hover:bg-blue-50 text-slate-400 hover:text-blue-600 transition-colors opacity-0 group-hover:opacity-100"
                                    >
                                        <Link className="h-3.5 w-3.5" />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setSelectedPkg(pkg)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                                    >
                                        <Eye className="h-3 w-3" />
                                        {c.recommendations.viewButton}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="mt-4 p-4 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                    <p className="text-sm font-semibold text-amber-800">
                        {applyPackagingCountTemplate(c.alert.unassignedTitleTemplate, unmatchedTotal)}
                    </p>
                    <p className="text-xs text-amber-600 mt-0.5">
                        {c.alert.bodyBeforeLink}
                        <span className="font-semibold">{c.alert.linkWord}</span>
                        {c.alert.bodyAfterLink}
                    </p>
                </div>
                <button type="button" className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 text-white text-xs font-semibold rounded-lg hover:bg-amber-600 transition-colors shrink-0">
                    <Zap className="h-3.5 w-3.5" />
                    {c.alert.autoMatch}
                </button>
            </div>

            {selectedPkg && (
                <PackageDetailDrawer
                    pkg={selectedPkg}
                    products={products}
                    onClose={() => setSelectedPkg(null)}
                    onAssociate={() => setAssociatingPkg(selectedPkg)}
                    copy={c.detailDrawer}
                    scoreBadgeCopy={c.scoreBadge}
                />
            )}

            {associatingPkg && (
                <AssociatePackageModal
                    key={associatingPkg.id}
                    pkg={associatingPkg}
                    products={products}
                    onClose={() => setAssociatingPkg(null)}
                    onSave={handleSaveAssociations}
                    copy={c.associateModal}
                />
            )}
        </div>
    );
}
