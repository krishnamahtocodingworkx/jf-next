// Ingredient slice — owns catalog list/pagination, detail, UI filters, and add-form dropdown caches.
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type { IIngredientCatalogRow, IngredientState } from "@/interfaces/ingredient";
import type {
    IngredientCategoryFilter,
    IngredientFormFilter,
    IngredientStatusFilter,
} from "@/utils/model";
import {
    createInitialIngredientState,
    ingredientToCatalogRow,
} from "@/utils/ingredient-helpers";
import {
    fetchIngredientsPage,
    fetchIngredientDetail,
    fetchIngredientAddFormOptions,
} from "@/redux/ingredient/ingredients-thunks";

const initialState: IngredientState = createInitialIngredientState();

const ingredientSlice = createSlice({
    name: "ingredient",
    initialState,
    reducers: {
        /** Applies the debounced search term and resets to page 1 so the new query starts fresh. */
        setIngredientSearch(state, action: PayloadAction<string>) {
            state.ui.searchApplied = action.payload;
            state.pagination.page = 1;
        },
        /** Sets the status pill (active / concept / flagged / all) — applied client-side by the catalog selector. */
        setIngredientStatusFilter(state, action: PayloadAction<IngredientStatusFilter>) {
            state.ui.statusFilter = action.payload;
        },
        /** Sets the physical-form pill (powder / liquid / etc.) — applied client-side by the catalog selector. */
        setIngredientFormFilter(state, action: PayloadAction<IngredientFormFilter>) {
            state.ui.formFilter = action.payload;
        },
        /** Sets the category pill (food / beverages / cosmetic / …) — applied client-side by the catalog selector. */
        setIngredientCategoryFilter(state, action: PayloadAction<IngredientCategoryFilter>) {
            state.ui.categoryFilter = action.payload;
        },
        /** Toggles the catalog between grid and list views. */
        setIngredientDisplayMode(state, action: PayloadAction<"grid" | "list">) {
            state.ui.displayMode = action.payload;
        },
        /** Jumps to a specific page (1-indexed, clamped to ≥1); the `useEffect` watcher refetches. */
        setIngredientPage(state, action: PayloadAction<number>) {
            state.pagination.page = Math.max(1, action.payload);
        },
        /** Sets the per-page count and resets to page 1; only allows approved sizes to guard against bad query params. */
        setIngredientPageSize(state, action: PayloadAction<number>) {
            const allowed = [10, 20, 50, 100] as const;
            const next = allowed.includes(action.payload as (typeof allowed)[number])
                ? action.payload
                : state.pagination.size;
            state.pagination.size = next;
            state.pagination.page = 1;
        },
        /** Wipes the detail cache when leaving the `[id]` page so reopening fetches fresh data. */
        clearIngredientDetail(state) {
            state.detail = { id: null, data: undefined, status: "idle" };
        },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchIngredientsPage: drives the catalog list — pending shimmers, fulfilled replaces list + pagination.
            .addCase(fetchIngredientsPage.pending, (state) => {
                state.loadStatus = "loading";
            })
            .addCase(fetchIngredientsPage.fulfilled, (state, action) => {
                state.loadStatus = "succeeded";
                state.list = action.payload.list;
                state.pagination = action.payload.pagination;
            })
            .addCase(fetchIngredientsPage.rejected, (state) => {
                state.loadStatus = "failed";
            })
            // ── fetchIngredientDetail: powers the `[id]` page — `failed` if the lookup returns nothing.
            .addCase(fetchIngredientDetail.pending, (state, action) => {
                state.detail.status = "loading";
                state.detail.id = action.meta.arg;
            })
            .addCase(fetchIngredientDetail.fulfilled, (state, action) => {
                state.detail.status = action.payload.ingredient ? "succeeded" : "failed";
                state.detail.data = action.payload.ingredient;
                state.detail.id = action.payload.id;
            })
            .addCase(fetchIngredientDetail.rejected, (state) => {
                state.detail.status = "failed";
                state.detail.data = undefined;
            })
            // ── fetchIngredientAddFormOptions: hydrates country + company dropdowns for the Add Ingredient form.
            .addCase(fetchIngredientAddFormOptions.pending, (state) => {
                state.addFormOptions.status = "loading";
            })
            .addCase(fetchIngredientAddFormOptions.fulfilled, (state, action) => {
                state.addFormOptions.status = "succeeded";
                state.addFormOptions.countries = action.payload.countries;
                state.addFormOptions.companies = action.payload.companies;
            })
            .addCase(fetchIngredientAddFormOptions.rejected, (state) => {
                state.addFormOptions.status = "failed";
            });
    },
});

export const {
    setIngredientSearch,
    setIngredientStatusFilter,
    setIngredientFormFilter,
    setIngredientCategoryFilter,
    setIngredientDisplayMode,
    setIngredientPage,
    setIngredientPageSize,
    clearIngredientDetail,
} = ingredientSlice.actions;

export default ingredientSlice.reducer;

/** Local subset of root state used by selectors so we don't have to import RootState here. */
type IngredientRoot = { ingredient: IngredientState };

const selectIngredientState = (s: IngredientRoot) => s.ingredient;

/** Maps the wire list into catalog rows and applies the active client-side filters. */
export const selectIngredientCatalogRows = createSelector(
    [selectIngredientState],
    (state): IIngredientCatalogRow[] => {
        const rows = state.list.map(ingredientToCatalogRow);
        const { statusFilter, formFilter, categoryFilter } = state.ui;
        return rows.filter((row) => {
            if (statusFilter === "active" && row.activeProducts <= 0) return false;
            if (statusFilter === "concept" && row.conceptProducts <= 0) return false;
            if (statusFilter === "flagged" && !row.flagged) return false;
            if (formFilter !== "all" && row.form.toLowerCase() !== formFilter) return false;
            if (categoryFilter !== "all" && row.category.toLowerCase() !== categoryFilter) return false;
            return true;
        });
    },
);

/** Server-reported total (used for the header counter + pagination math). */
export const selectIngredientCatalogTotal = createSelector(
    [selectIngredientState],
    (state) => state.pagination.total,
);
