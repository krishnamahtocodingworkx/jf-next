"use client";

import { useEffect, useMemo, useState } from "react";
import {
    Bell,
    ChevronLeft,
    ChevronRight,
    Filter,
    LayoutGrid,
    Lightbulb,
    List,
    Package,
    Plus,
    Search,
    TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductCatalog } from "@/redux/product/product-thunks";
import {
    selectCatalogDisplayRows,
    setCatalogDisplayMode,
    setCatalogFilterA,
    setCatalogFilterB,
    setCatalogPage,
    setCatalogSearchApplied,
    type CatalogFilterA,
    type CatalogFilterB,
} from "@/redux/product/product-slice";
import ProductGridCard from "@/components/products/product-grid-card";
import ProductListRow from "@/components/products/product-list-row";
import AddProductPanel from "@/components/products/add-product-panel";
import ProductDetailDrawer from "@/components/products/product-detail-drawer";
import CatalogShimmer from "@/components/common/catalog-shimmer";
import type { IProductCatalogRow } from "@/interfaces/product";

const STATUS_PILLS: Array<{ id: CatalogFilterA; label: string }> = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "concept", label: "Concept" },
];

const CATEGORY_PILLS: Array<{ id: CatalogFilterB; label: string }> = [
    { id: "all", label: "All" },
    { id: "bars", label: "Bars" },
    { id: "beverages", label: "Beverages" },
    { id: "powders", label: "Powders" },
    { id: "snacks", label: "Snacks" },
    { id: "supplements", label: "Supplements" },
];

export default function ProductsPage() {
    const dispatch = useAppDispatch();
    const catalog = useAppSelector((s) => s.product.catalog);
    const rows = useAppSelector(selectCatalogDisplayRows);

    const [localSearch, setLocalSearch] = useState(catalog.search);
    const [showFilters, setShowFilters] = useState(false);
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<IProductCatalogRow | null>(null);

    useEffect(() => {
        console.log("[ProductsPage] fetch trigger", {
            page: catalog.page,
            filterA: catalog.filterA,
            search: catalog.search,
        });
        dispatch(fetchProductCatalog());
    }, [dispatch, catalog.page, catalog.filterA, catalog.search]);

    useEffect(() => {
        const t = setTimeout(() => {
            if (localSearch.trim() !== catalog.search) {
                dispatch(setCatalogSearchApplied(localSearch.trim()));
            }
        }, 400);
        return () => clearTimeout(t);
    }, [localSearch, catalog.search, dispatch]);

    const counts = useMemo(() => {
        let active = 0;
        let concept = 0;
        rows.forEach((row) => {
            if (row.product_status) active += 1;
            else concept += 1;
        });
        return { active, concept };
    }, [rows]);

    const totalCount = catalog.total || rows.length;
    const totalPages = Math.max(1, catalog.totalPages || 1);

    const isLoading = catalog.loadStatus === "loading";
    const isFailed = catalog.loadStatus === "failed";

    const activeBarPct = totalCount
        ? Math.min(100, (counts.active / Math.max(1, totalCount)) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="h-4 w-4 text-slate-400" />
                        <h3 className="text-sm font-semibold text-slate-700">Product Actions</h3>
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Notifications Pending</span>
                            <span className="text-sm font-semibold text-slate-800">6</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Actions Pending</span>
                            <span className="text-sm font-semibold text-slate-800">0</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Concept Products</span>
                            <span className="text-sm font-semibold text-blue-600">{counts.concept}</span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-blue-500 rounded-full transition-all"
                                style={{ width: `${activeBarPct}%` }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                            {counts.active}/{totalCount} active
                        </p>
                    </div>
                </div>

                <div className="bg-linear-to-br from-green-500 to-emerald-600 rounded-xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 opacity-20">
                        <Package className="h-20 w-20" />
                    </div>
                    <p className="text-sm font-medium text-green-100">Active Products</p>
                    <p className="text-4xl font-bold mt-1">{counts.active}</p>
                    <p className="text-sm text-green-100 mt-1">In your catalog</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-green-100">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="text-green-200 font-medium">+2.4% this period</span>
                    </div>
                </div>

                <div className="bg-linear-to-br from-slate-700 to-slate-900 rounded-xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 opacity-20">
                        <Lightbulb className="h-20 w-20" />
                    </div>
                    <p className="text-sm font-medium text-slate-300">Concept Products</p>
                    <p className="text-4xl font-bold mt-1">{counts.concept}</p>
                    <p className="text-sm text-slate-300 mt-1">In development</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-slate-300">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="text-green-400 font-medium">+8% this period</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between p-4 border-b border-slate-100 flex-wrap gap-3">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-semibold text-slate-800">All Products</h2>
                        <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full font-medium">
                            {totalCount} items
                        </span>
                    </div>

                    <div className="flex items-center gap-3 flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                            <input
                                type="text"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                placeholder="Search products..."
                                className="pl-9 pr-4 py-2 w-48 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <select
                            value={catalog.filterB}
                            onChange={(e) =>
                                dispatch(setCatalogFilterB(e.target.value as CatalogFilterB))
                            }
                            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white"
                        >
                            {CATEGORY_PILLS.map((pill) => (
                                <option key={pill.id} value={pill.id}>
                                    {pill.label}
                                </option>
                            ))}
                        </select>

                        <select
                            value={catalog.filterA}
                            onChange={(e) =>
                                dispatch(setCatalogFilterA(e.target.value as CatalogFilterA))
                            }
                            className="px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none bg-white"
                        >
                            {STATUS_PILLS.map((pill) => (
                                <option key={pill.id} value={pill.id}>
                                    {pill.label}
                                </option>
                            ))}
                        </select>

                        <button
                            type="button"
                            onClick={() => setShowFilters((v) => !v)}
                            className="flex items-center gap-2 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Filter className="h-4 w-4 text-slate-500" />
                            Filters
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowAddPanel(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-800 transition-colors"
                        >
                            <Plus className="h-4 w-4" />
                            Add
                        </button>

                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white">
                            <button
                                type="button"
                                onClick={() => dispatch(setCatalogDisplayMode("grid"))}
                                className={`p-2 transition-colors ${
                                    catalog.displayMode === "grid"
                                        ? "bg-slate-900 text-white"
                                        : "hover:bg-slate-50 text-slate-500"
                                }`}
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => dispatch(setCatalogDisplayMode("list"))}
                                className={`p-2 transition-colors ${
                                    catalog.displayMode === "list"
                                        ? "bg-slate-900 text-white"
                                        : "hover:bg-slate-50 text-slate-500"
                                }`}
                                aria-label="List view"
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {showFilters && (
                    <div className="px-4 py-3 border-b border-slate-100 flex flex-wrap items-center gap-2">
                        <span className="text-xs uppercase tracking-wide font-medium text-slate-400 mr-1">
                            Status
                        </span>
                        {STATUS_PILLS.map((pill) => (
                            <button
                                key={pill.id}
                                type="button"
                                onClick={() => dispatch(setCatalogFilterA(pill.id))}
                                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                    catalog.filterA === pill.id
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}

                        <span className="text-xs uppercase tracking-wide font-medium text-slate-400 ml-4 mr-1">
                            Category
                        </span>
                        {CATEGORY_PILLS.map((pill) => (
                            <button
                                key={pill.id}
                                type="button"
                                onClick={() => dispatch(setCatalogFilterB(pill.id))}
                                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                    catalog.filterB === pill.id
                                        ? "bg-blue-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                )}

                <div
                    className={
                        catalog.displayMode === "grid" || isLoading || isFailed || rows.length === 0
                            ? "p-4"
                            : ""
                    }
                >
                    {isLoading && (
                        <CatalogShimmer viewMode={catalog.displayMode} count={catalog.displayMode === "grid" ? 8 : 6} />
                    )}

                    {isFailed && (
                        <div className="py-12 text-center text-sm text-red-600">
                            Failed to load products. Please try again.
                        </div>
                    )}

                    {!isLoading && !isFailed && rows.length === 0 && (
                        <div className="py-12 text-center text-sm text-slate-500">
                            No products match the current filters.
                        </div>
                    )}

                    {!isLoading && !isFailed && rows.length > 0 && catalog.displayMode === "grid" && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {rows.map((p) => (
                                <ProductGridCard
                                    key={p.id}
                                    product={p}
                                    onView={() => {
                                        console.log("[ProductsPage] view", p.id);
                                        setSelectedProduct(p);
                                    }}
                                />
                            ))}
                        </div>
                    )}

                    {!isLoading && !isFailed && rows.length > 0 && catalog.displayMode === "list" && (
                        <div>
                            {rows.map((p) => (
                                <ProductListRow
                                    key={p.id}
                                    product={p}
                                    onView={() => {
                                        console.log("[ProductsPage] view", p.id);
                                        setSelectedProduct(p);
                                    }}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {totalPages > 1 && (
                    <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                        <p className="text-sm text-slate-500">
                            Page {catalog.page} of {totalPages}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() => dispatch(setCatalogPage(catalog.page - 1))}
                                disabled={catalog.page <= 1}
                                className="flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => dispatch(setCatalogPage(catalog.page + 1))}
                                disabled={catalog.page >= totalPages}
                                className="flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AddProductPanel
                open={showAddPanel}
                onClose={() => setShowAddPanel(false)}
                onCreated={() => {
                    console.log("[ProductsPage] product created, refetching");
                    dispatch(fetchProductCatalog());
                }}
            />

            <ProductDetailDrawer
                product={selectedProduct}
                onClose={() => setSelectedProduct(null)}
                onEdit={() => setShowAddPanel(true)}
            />
        </div>
    );
}
