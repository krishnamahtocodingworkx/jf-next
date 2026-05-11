"use client";

import IngredientActionsCard from "@/components/ingredients/IngredientsActionsCard";
import IngredientActiveStat from "@/components/ingredients/IngredientsActiveStat";
import IngredientAlertsPanel from "@/components/ingredients/IngredientsAlertsPanel";
import IngredientGridCard from "@/components/ingredients/IngredientsGridCard";
import IngredientListRow from "@/components/ingredients/IngredientsListRow";
import { Ingredient } from "@/components/ingredients/types";
import { setLimit, setSearch } from "@/redux/ingredients/ingredientsSlice";
import { getIngredients } from '@/redux/ingredients/ingredientsThunk';
import { AppDispatch, RootState } from '@/redux/store';
import { normalizeIngredient } from "@/utils/commonFunctions";
import { ChevronDown, ChevronRight, Filter, LayoutGrid, List, Plus, Search, Zap } from "lucide-react";
import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';




const IngredientsClient = () => {
  const dispatch: AppDispatch = useDispatch();
  const ingredientState = useSelector((state: RootState) => state.ingredients);
  const { search, total, limit } = ingredientState.pagination;
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [formFilter, setFormFilter] = useState("All");
  const [showFilters, setShowFilters] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [alertFilter, setAlertFilter] = useState<"all" | "supply" | "price" | "score">("all");
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);

  const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = event.target.value;
    dispatch(setSearch(searchTerm));
  }
  const limitHandler = () => {
    if (showAll) {
      dispatch(setLimit(9));
    } else {
      dispatch(setLimit(total));
    }
    setShowAll((prev) => !prev);
  }

  useEffect(() => {
    dispatch(getIngredients());
  }, [dispatch, search, limit]);

  const ingredients = useMemo(
    () => (Array.isArray(ingredientState.data) ? ingredientState.data.map(normalizeIngredient) : []),
    [ingredientState.data]
  );

  const categoryOptions = useMemo(
    () => ["All", ...new Set(ingredients.map((ingredient) => ingredient.category))],
    [ingredients]
  );
  const statusOptions = useMemo(
    () => ["All", ...new Set(ingredients.map((ingredient) => ingredient.status))],
    [ingredients]
  );
  const formOptions = useMemo(
    () => ["All", ...new Set(ingredients.map((ingredient) => ingredient.form))],
    [ingredients]
  );

  if (ingredientState?.error) {
    return <div className="text-sm text-red-600">{ingredientState.error}</div>;
  }

  return (
    <div className="space-y-6 mt-4">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
        <IngredientActionsCard activeCount={7} flaggedCount={8} total={total} />
        <IngredientActiveStat activeCount={10} />
        <IngredientAlertsPanel
          // alerts={INGREDIENT_ALERTS}
          alertFilter={alertFilter}
          dismissedAlerts={dismissedAlerts}
          onFilterChange={setAlertFilter}
          onDismiss={(id) => setDismissedAlerts((prev) => [...prev, id])}
        />
      </div>

      <div className="bg-white rounded-xl border border-slate-200">
        <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-100 flex-wrap">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base font-semibold text-slate-800">All Ingredients</h2>
            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{ingredients.length} items</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={searchHandler}
                placeholder="Search ingredients..."
                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
              />
            </div>

            <div className="relative">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white"
              >
                {statusOptions.map((status, i) => (
                  <option key={status + i} value={status}>
                    {status}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select
                value={formFilter}
                onChange={(event) => setFormFilter(event.target.value)}
                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white"
              >
                {formOptions.map((form, i) => (
                  <option key={form + i} value={form}>
                    {form}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Filter className="h-3.5 w-3.5" />
              Filters
            </button>

            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-slate-900 text-white rounded-lg hover:bg-slate-700 transition-colors">
              <Plus className="h-3.5 w-3.5" />
              Add
            </button>

            <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"}`}
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("list")}
                className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"}`}
              >
                <List className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap">
            {categoryOptions.map((category, i) => (
              <button
                key={category + i}
                type="button"
                onClick={() => setCategoryFilter(category)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${categoryFilter === category ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
              >
                {category}
              </button>
            ))}
          </div>
        )}

        {viewMode === "list" && (
          <div className="hidden md:grid grid-cols-[1fr_auto] gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
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

        {viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
            {ingredients.map((ingredient) => (
              <IngredientGridCard key={ingredient.id} ingredient={ingredient} onView={() => null} />
            ))}
          </div>
        ) : (
          <div>
            {ingredients.map((ingredient) => (
              <IngredientListRow key={ingredient.id} ingredient={ingredient} onView={() => null} />
            ))}
          </div>
        )}

        {
          <div className="p-4 border-t border-slate-100 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing {ingredients.length} of {total}
            </p>
            <button
              type="button"
              onClick={limitHandler}
              className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              {showAll ? "Show less" : `Show all ${total}`}
              <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
            </button>
          </div>
        }
      </div>

      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5 flex items-start gap-4">
        <div className="p-3 bg-blue-100 rounded-lg shrink-0">
          <Zap className="h-5 w-5 text-blue-600" />
        </div>
        <div>
          <h3 className="font-semibold text-slate-800 mb-1">Quick Tip</h3>
          <p className="text-sm text-slate-600">
            Monitor ingredient alerts for supply chain issues, price changes, and quality score updates.
          </p>
        </div>
      </div>
    </div>
  )
}

export default IngredientsClient;