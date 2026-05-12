import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type {
    IIngredientCatalogRow,
    IIngredientPagination,
    ISupplierIngredient,
} from "@/interfaces/ingredient";
import { ingredientToCatalogRow } from "@/utils/commonFunctions";
import type { SelectOption } from "@/utils/model";
import {
    fetchIngredientsPage,
    fetchIngredientDetail,
    fetchIngredientAddFormOptions,
} from "@/redux/ingredient/ingredients-thunks";

export type IngredientStatusFilter = "all" | "active" | "concept" | "flagged";
export type IngredientFormFilter = "all" | "powder" | "liquid" | "puree" | "granule" | "crystal";
export type IngredientCategoryFilter =
    | "all"
    | "food"
    | "beverages"
    | "cosmetic"
    | "household"
    | "supplement";

export interface IngredientCatalogUi {
    statusFilter: IngredientStatusFilter;
    formFilter: IngredientFormFilter;
    categoryFilter: IngredientCategoryFilter;
    displayMode: "grid" | "list";
    searchApplied: string;
}

export interface IngredientDetailState {
    id: string | null;
    data: ISupplierIngredient | undefined;
    status: "idle" | "loading" | "succeeded" | "failed";
}

export type IngredientAddFormOptionsState = {
    countries: SelectOption[];
    companies: SelectOption[];
    status: "idle" | "loading" | "succeeded" | "failed";
};

export interface IngredientState {
    list: ISupplierIngredient[];
    pagination: IIngredientPagination;
    loadStatus: "idle" | "loading" | "succeeded" | "failed";
    ui: IngredientCatalogUi;
    detail: IngredientDetailState;
    addFormOptions: IngredientAddFormOptionsState;
}

const initialPagination: IIngredientPagination = {
    page: 1,
    pages: 1,
    size: 10,
    total: 0,
};

const initialUi: IngredientCatalogUi = {
    statusFilter: "all",
    formFilter: "all",
    categoryFilter: "all",
    displayMode: "grid",
    searchApplied: "",
};

const initialState: IngredientState = {
    list: [],
    pagination: { ...initialPagination },
    loadStatus: "idle",
    ui: { ...initialUi },
    detail: { id: null, data: undefined, status: "idle" },
    addFormOptions: {
        countries: [],
        companies: [],
        status: "idle",
    },
};

const ingredientSlice = createSlice({
    name: "ingredient",
    initialState,
    reducers: {
        setIngredientSearch(state, action: PayloadAction<string>) {
            state.ui.searchApplied = action.payload;
            state.pagination.page = 1;
        },
        setIngredientStatusFilter(state, action: PayloadAction<IngredientStatusFilter>) {
            state.ui.statusFilter = action.payload;
        },
        setIngredientFormFilter(state, action: PayloadAction<IngredientFormFilter>) {
            state.ui.formFilter = action.payload;
        },
        setIngredientCategoryFilter(state, action: PayloadAction<IngredientCategoryFilter>) {
            state.ui.categoryFilter = action.payload;
        },
        setIngredientDisplayMode(state, action: PayloadAction<"grid" | "list">) {
            state.ui.displayMode = action.payload;
        },
        setIngredientPage(state, action: PayloadAction<number>) {
            state.pagination.page = Math.max(1, action.payload);
        },
        setIngredientPageSize(state, action: PayloadAction<number>) {
            const allowed = [10, 20, 50, 100] as const;
            const next = allowed.includes(action.payload as (typeof allowed)[number])
                ? action.payload
                : state.pagination.size;
            state.pagination.size = next;
            state.pagination.page = 1;
        },
        clearIngredientDetail(state) {
            state.detail = { id: null, data: undefined, status: "idle" };
        },
    },
    extraReducers: (builder) => {
        builder
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

type IngredientRoot = { ingredient: IngredientState };

const selectIngredientState = (s: IngredientRoot) => s.ingredient;

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

export const selectIngredientCatalogTotal = createSelector(
    [selectIngredientState],
    (state) => state.pagination.total,
);
