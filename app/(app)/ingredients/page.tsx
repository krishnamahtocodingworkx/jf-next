"use client";

import { useEffect, useMemo, useState } from "react";
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
    Sparkles,
    TrendingUp,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
    fetchIngredientsPage,
    selectIngredientCatalogRows,
    setIngredientCategoryFilter,
    setIngredientDisplayMode,
    setIngredientFormFilter,
    setIngredientPage,
    setIngredientSearch,
    setIngredientStatusFilter,
    type IngredientCategoryFilter,
    type IngredientFormFilter,
    type IngredientStatusFilter,
} from "@/redux/ingredient/ingredient-slice";
import IngredientGridCard from "@/components/ingredients/ingredient-grid-card";
import IngredientListRow from "@/components/ingredients/ingredient-list-row";
import AddIngredientPanel from "@/components/ingredients/add-ingredient-panel";
import IngredientDetailDrawer from "@/components/ingredients/ingredient-detail-drawer";
import CatalogShimmer from "@/components/common/catalog-shimmer";
import type { IIngredientCatalogRow } from "@/interfaces/ingredient";

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
    const dispatch = useAppDispatch();
    const ingredient = useAppSelector((s) => s.ingredient);
    const rows = useAppSelector(selectIngredientCatalogRows);

    const [localSearch, setLocalSearch] = useState(ingredient.ui.searchApplied);
    const [showFilters, setShowFilters] = useState(false);
    const [showAddPanel, setShowAddPanel] = useState(false);
    const [selectedIngredient, setSelectedIngredient] = useState<IIngredientCatalogRow | null>(
        null,
    );

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
        let concept = 0;
        let flagged = 0;
        rows.forEach((row) => {
            if (row.flagged) flagged += 1;
            else if (row.activeProducts > 0) active += 1;
            else concept += 1;
        });
        return { active, concept, flagged };
    }, [rows]);

    const totalCount = ingredient.pagination.total || rows.length;
    const totalPages = Math.max(1, ingredient.pagination.pages || 1);
    const isLoading = ingredient.loadStatus === "loading";
    const isFailed = ingredient.loadStatus === "failed";

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl border border-slate-200 p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <Bell className="h-4 w-4 text-slate-400" />
                        <h3 className="text-sm font-semibold text-slate-700">
                            Ingredient Actions
                        </h3>
                    </div>
                    <div className="space-y-2.5">
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Total Items</span>
                            <span className="text-sm font-semibold text-slate-800">
                                {totalCount}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Flagged (page)</span>
                            <span className="text-sm font-semibold text-red-600">
                                {counts.flagged}
                            </span>
                        </div>
                        <div className="flex items-center justify-between">
                            <span className="text-sm text-slate-600">Concept (page)</span>
                            <span className="text-sm font-semibold text-amber-600">
                                {counts.concept}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-emerald-500 rounded-full transition-all"
                                style={{
                                    width: `${
                                        rows.length
                                            ? (counts.active / Math.max(1, rows.length)) * 100
                                            : 0
                                    }%`,
                                }}
                            />
                        </div>
                        <p className="text-xs text-slate-500 mt-1.5">
                            {counts.active}/{rows.length || 0} active on this page
                        </p>
                    </div>
                </div>

                <div
                    className="rounded-xl p-5 text-white relative overflow-hidden"
                    style={{
                        background: "linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)",
                    }}
                >
                    <div className="absolute top-4 right-4 opacity-20">
                        <Leaf className="h-20 w-20" />
                    </div>
                    <p className="text-sm font-medium text-blue-100">Active Ingredients</p>
                    <p className="text-4xl font-bold mt-1">{counts.active}</p>
                    <p className="text-sm text-blue-100 mt-1">In your current view</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-blue-100">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="font-medium">Live from API</span>
                    </div>
                </div>

                <div className="bg-linear-to-br from-emerald-500 to-green-600 rounded-xl p-5 text-white relative overflow-hidden">
                    <div className="absolute top-4 right-4 opacity-20">
                        <Sparkles className="h-20 w-20" />
                    </div>
                    <p className="text-sm font-medium text-emerald-100">Concept Ingredients</p>
                    <p className="text-4xl font-bold mt-1">{counts.concept}</p>
                    <p className="text-sm text-emerald-100 mt-1">In development</p>
                    <div className="flex items-center gap-1 mt-2 text-sm text-emerald-100">
                        <TrendingUp className="h-3.5 w-3.5" />
                        <span className="font-medium">Live from API</span>
                    </div>
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex flex-col gap-3 p-4 border-b border-slate-100 md:flex-row md:items-center md:justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-base font-semibold text-slate-800">All Ingredients</h2>
                        <span className="px-2 py-0.5 text-xs bg-slate-100 text-slate-600 rounded-full font-medium">
                            {totalCount} items
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
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
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm border rounded-lg transition-colors ${
                                showFilters
                                    ? "border-slate-900 bg-slate-900 text-white"
                                    : "border-slate-200 hover:bg-slate-50"
                            }`}
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

                <div className="p-4">
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
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {rows.map((row) => (
                                    <IngredientGridCard
                                        key={row.id}
                                        ingredient={row}
                                        onView={() => {
                                            console.log("[IngredientsPage] view", row.id);
                                            setSelectedIngredient(row);
                                        }}
                                    />
                                ))}
                            </div>
                        )}

                    {!isLoading &&
                        !isFailed &&
                        rows.length > 0 &&
                        ingredient.ui.displayMode === "list" && (
                            <div className="bg-white rounded-lg border border-slate-100 overflow-hidden">
                                {rows.map((row) => (
                                    <IngredientListRow
                                        key={row.id}
                                        ingredient={row}
                                        onView={() => {
                                            console.log("[IngredientsPage] view", row.id);
                                            setSelectedIngredient(row);
                                        }}
                                    />
                                ))}
                            </div>
                        )}
                </div>

                {totalPages > 1 && (
                    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-100">
                        <p className="text-xs text-slate-500">
                            Page {ingredient.pagination.page} of {totalPages}
                        </p>
                        <div className="flex items-center gap-1">
                            <button
                                type="button"
                                onClick={() =>
                                    dispatch(setIngredientPage(ingredient.pagination.page - 1))
                                }
                                disabled={ingredient.pagination.page <= 1}
                                className="flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronLeft className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() =>
                                    dispatch(setIngredientPage(ingredient.pagination.page + 1))
                                }
                                disabled={ingredient.pagination.page >= totalPages}
                                className="flex items-center justify-center h-8 w-8 rounded-md border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <AddIngredientPanel
                open={showAddPanel}
                onClose={() => setShowAddPanel(false)}
                onCreated={() => {
                    console.log("[IngredientsPage] ingredient created, refetching");
                    dispatch(fetchIngredientsPage());
                }}
            />

            <IngredientDetailDrawer
                ingredient={selectedIngredient}
                onClose={() => setSelectedIngredient(null)}
            />
        </div>
    );
}
