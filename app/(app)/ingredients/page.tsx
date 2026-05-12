"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
    Bell,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Filter,
    LayoutGrid,
    Leaf,
    List,
    Plus,
    Search,
    TrendingUp,
    Zap,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchIngredientsPage } from "@/redux/ingredient/ingredients-thunks";
import {
    selectIngredientCatalogRows,
    setIngredientCategoryFilter,
    setIngredientDisplayMode,
    setIngredientFormFilter,
    setIngredientPage,
    setIngredientPageSize,
    setIngredientSearch,
    setIngredientStatusFilter,
    type IngredientCategoryFilter,
    type IngredientFormFilter,
    type IngredientStatusFilter,
} from "@/redux/ingredient/ingredient-slice";
import IngredientGridCard from "@/components/ingredients/IngredientGridCard";
import IngredientListRow from "@/components/ingredients/IngredientListRow";
import IngredientAlertsPanel from "@/components/ingredients/IngredientAlertsPanel";
import AddIngredientPanel from "@/components/ingredients/AddIngredientPanel";
import CatalogShimmer from "@/components/common/CatalogShimmer";

const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

const STATUS_PILLS: Array<{ id: IngredientStatusFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "concept", label: "Concept" },
    { id: "flagged", label: "Flagged" },
];

const FORM_PILLS: Array<{ id: IngredientFormFilter; label: string }> = [
    { id: "all", label: "All Forms" },
    { id: "powder", label: "Powder" },
    { id: "liquid", label: "Liquid" },
    { id: "puree", label: "Puree" },
    { id: "granule", label: "Granule" },
    { id: "crystal", label: "Crystal" },
];

const CATEGORY_PILLS: Array<{ id: IngredientCategoryFilter; label: string }> = [
    { id: "all", label: "All" },
    { id: "food", label: "Food" },
    { id: "beverages", label: "Beverages" },
    { id: "cosmetic", label: "Cosmetic" },
    { id: "household", label: "Household" },
    { id: "supplement", label: "Supplement" },
];

export default function IngredientsPage() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const ingredient = useAppSelector((s) => s.ingredient);
    const rows = useAppSelector(selectIngredientCatalogRows);

    const [localSearch, setLocalSearch] = useState(ingredient.ui.searchApplied);
    const [showFilters, setShowFilters] = useState(false);
    const [showAddPanel, setShowAddPanel] = useState(false);
    useEffect(() => {
        console.log("[IngredientsPage] fetch trigger", {
            page: ingredient.pagination.page,
            search: ingredient.ui.searchApplied,
        });
        dispatch(fetchIngredientsPage());
    }, [
        dispatch,
        ingredient.pagination.page,
        ingredient.pagination.size,
        ingredient.ui.searchApplied,
    ]);

    useEffect(() => {
        const t = setTimeout(() => {
            if (localSearch.trim() !== ingredient.ui.searchApplied) {
                dispatch(setIngredientSearch(localSearch.trim()));
            }
        }, 400);
        return () => clearTimeout(t);
    }, [localSearch, ingredient.ui.searchApplied, dispatch]);

    const counts = useMemo(() => {
        let active = 0;
        let flagged = 0;
        rows.forEach((row) => {
            if (row.flagged) flagged += 1;
            else if (row.activeProducts > 0) active += 1;
        });
        return { active, flagged };
    }, [rows]);

    const totalCount = ingredient.pagination.total || rows.length;
    const totalPages = Math.max(1, ingredient.pagination.pages || 1);
    const isLoading = ingredient.loadStatus === "loading";
    const isFailed = ingredient.loadStatus === "failed";

    const activeBarPct = totalCount
        ? Math.min(100, (counts.active / Math.max(1, totalCount)) * 100)
        : 0;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
                            <Bell className="h-3.5 w-3.5 text-slate-400" />
                            Ingredient Actions
                        </h3>
                    </div>
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Notifications Pending</span>
                            <span className="font-semibold text-slate-800">0</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Actions Pending</span>
                            <span className="font-semibold text-slate-800">0</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                            <span className="text-slate-600">Flagged Ingredients</span>
                            <span className="font-semibold text-red-600">{counts.flagged}</span>
                        </div>
                    </div>
                    <div className="mt-2 h-1 bg-slate-100 rounded-full">
                        <div
                            className="h-1 bg-green-500 rounded-full transition-all"
                            style={{ width: `${activeBarPct}%` }}
                        />
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">
                        {counts.active}/{totalCount} active
                    </p>
                </div>

                <div
                    className="rounded-xl p-4 text-white flex items-center justify-between"
                    style={{
                        background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                    }}
                >
                    <div>
                        <p className="text-blue-200 text-[10px] font-medium mb-0.5">
                            Active Ingredients
                        </p>
                        <p className="text-3xl font-bold">{counts.active}</p>
                        <p className="text-blue-200 text-[10px] mt-0.5">Across all products</p>
                        <div className="flex items-center gap-1 mt-1.5 text-[10px] text-green-300 font-medium">
                            <TrendingUp className="h-2.5 w-2.5" />
                            +12% this period
                        </div>
                    </div>
                    <Leaf className="h-10 w-10 text-blue-300 opacity-50" />
                </div>

                <IngredientAlertsPanel />
            </div>

            <div className="bg-white rounded-xl border border-slate-200">
                <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-100 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                        <h2 className="text-base font-semibold text-slate-800">All Ingredients</h2>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                            {totalCount} items
                        </span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={localSearch}
                                onChange={(e) => setLocalSearch(e.target.value)}
                                placeholder="Search ingredients..."
                                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={ingredient.ui.statusFilter}
                                onChange={(e) =>
                                    dispatch(
                                        setIngredientStatusFilter(
                                            e.target.value as IngredientStatusFilter,
                                        ),
                                    )
                                }
                                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white"
                            >
                                {STATUS_PILLS.map((pill) => (
                                    <option key={pill.id} value={pill.id}>
                                        {pill.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={ingredient.ui.formFilter}
                                onChange={(e) =>
                                    dispatch(
                                        setIngredientFormFilter(
                                            e.target.value as IngredientFormFilter,
                                        ),
                                    )
                                }
                                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white"
                            >
                                {FORM_PILLS.map((pill) => (
                                    <option key={pill.id} value={pill.id}>
                                        {pill.label}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFilters((v) => !v)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Filter className="h-3.5 w-3.5" />
                            Filters
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowAddPanel(true)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <Plus className="h-3.5 w-3.5" />
                            Add
                        </button>

                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() => dispatch(setIngredientDisplayMode("grid"))}
                                className={`p-1.5 transition-colors ${
                                    ingredient.ui.displayMode === "grid"
                                        ? "bg-slate-900 text-white"
                                        : "hover:bg-slate-50 text-slate-500"
                                }`}
                                aria-label="Grid view"
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => dispatch(setIngredientDisplayMode("list"))}
                                className={`p-1.5 transition-colors ${
                                    ingredient.ui.displayMode === "list"
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
                    <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap">
                        {CATEGORY_PILLS.map((pill) => (
                            <button
                                key={pill.id}
                                type="button"
                                onClick={() => dispatch(setIngredientCategoryFilter(pill.id))}
                                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                    ingredient.ui.categoryFilter === pill.id
                                        ? "bg-slate-900 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                }`}
                            >
                                {pill.label}
                            </button>
                        ))}
                    </div>
                )}

                {ingredient.ui.displayMode === "list" &&
                    !isLoading &&
                    !isFailed &&
                    rows.length > 0 && (
                        <div className="hidden md:grid grid-cols-[auto_1fr_auto] gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                            <span className="w-9" />
                            <span>Ingredient</span>
                            <div className="flex items-center gap-6 pr-16">
                                <span className="w-14 text-center">Nutrition</span>
                                <span className="w-14 text-center">Sustain.</span>
                                <span className="w-14 text-center">Cost</span>
                                <span className="w-20 text-right">Price/kg</span>
                                <span className="w-16 text-center">Products</span>
                            </div>
                        </div>
                    )}

                <div
                    className={
                        ingredient.ui.displayMode === "grid" ||
                        isLoading ||
                        isFailed ||
                        rows.length === 0
                            ? "p-4"
                            : ""
                    }
                >
                    {isLoading && (
                        <CatalogShimmer
                            viewMode={ingredient.ui.displayMode}
                            count={ingredient.ui.displayMode === "grid" ? 8 : 6}
                        />
                    )}

                    {isFailed && (
                        <div className="py-12 text-center text-sm text-red-600">
                            Failed to load ingredients. Please try again.
                        </div>
                    )}

                    {!isLoading && !isFailed && rows.length === 0 && (
                        <div className="py-12 text-center text-sm text-slate-500">
                            No ingredients match the current filters.
                        </div>
                    )}

                    {!isLoading &&
                        !isFailed &&
                        rows.length > 0 &&
                        ingredient.ui.displayMode === "grid" && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {rows.map((row) => (
                                    <IngredientGridCard
                                        key={row.id}
                                        ingredient={row}
                                        onView={() => {
                                            console.log("[IngredientsPage] view", row.id);
                                            router.push(`/ingredients/${encodeURIComponent(row.id)}`);
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                    {!isLoading &&
                        !isFailed &&
                        rows.length > 0 &&
                        ingredient.ui.displayMode === "list" && (
                            <div>
                                {rows.map((row) => (
                                    <IngredientListRow
                                        key={row.id}
                                        ingredient={row}
                                        onView={() => {
                                            console.log("[IngredientsPage] view", row.id);
                                            router.push(`/ingredients/${encodeURIComponent(row.id)}`);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                </div>

                {totalCount > 0 && (
                    <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <p className="text-sm text-slate-500">
                            Page {ingredient.pagination.page} of {totalPages}
                            <span className="text-slate-400"> · </span>
                            {totalCount} total
                        </p>
                        <div className="flex flex-wrap items-center gap-3">
                            <label className="flex items-center gap-2 text-sm text-slate-600">
                                <span className="text-slate-500">Per page</span>
                                <select
                                    value={ingredient.pagination.size}
                                    onChange={(e) =>
                                        dispatch(setIngredientPageSize(Number(e.target.value)))
                                    }
                                    className="pl-2 pr-8 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    {PAGE_SIZE_OPTIONS.map((n) => (
                                        <option key={n} value={n}>
                                            {n}
                                        </option>
                                    ))}
                                </select>
                            </label>
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(
                                            setIngredientPage(ingredient.pagination.page - 1),
                                        )
                                    }
                                    disabled={ingredient.pagination.page <= 1}
                                    className="flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        dispatch(
                                            setIngredientPage(ingredient.pagination.page + 1),
                                        )
                                    }
                                    disabled={ingredient.pagination.page >= totalPages}
                                    className="flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5 flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                    <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Quick Tip</h3>
                    <p className="text-sm text-slate-600">
                        Monitor ingredient alerts for supply chain issues, price changes, and quality
                        score updates. Set up notifications to stay ahead of potential disruptions.
                    </p>
                </div>
            </div>

            <AddIngredientPanel
                open={showAddPanel}
                onClose={() => setShowAddPanel(false)}
                onCreated={() => {
                    console.log("[IngredientsPage] ingredient created, refetching");
                    dispatch(fetchIngredientsPage());
                }}
            />
        </div>
    );
}
