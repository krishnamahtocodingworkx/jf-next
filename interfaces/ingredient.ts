// Wire + UI + slice models for the Ingredients module.
import type {
    IngredientAddFormOptionsState,
    IngredientCategoryFilter,
    IngredientFormFilter,
    IngredientStatusFilter,
    LoadStatus,
} from "@/utils/model";

/** API-side ingredient row used across services + Redux (kept loose so service can unwrap aliased fields). */
export interface ISupplierIngredient {
    id: string;
    jf_display_name?: string;
    image_url?: string;
    active_count?: number;
    concept_count?: number;
    certifications?: unknown[];
    datasheet_url?: string;
    estimated_price?: number;
    nutrition_score?: number;
    sustainability_score?: number;
    cost_score?: number;
    overall_score?: number;
    claim?: string;
    origin_country?: string;
    trend_pct?: number;
    trend_positive?: boolean;
    supplier_audit_scheduled?: boolean;
    is_starred?: boolean;
}

/** Pagination meta produced by the service after normalising the backend response. */
export interface IIngredientPagination {
    page: number;
    pages: number;
    size: number;
    total: number;
}

/** Series for the ingredient usage chart on the Overview module. */
export interface IIngredientUsageChart {
    labels: string[];
    activeCounts: number[];
    conceptCounts: number[];
}

/** UI-side row consumed by the catalog grid/list and detail drawer (produced by `ingredientToCatalogRow`). */
export interface IIngredientCatalogRow {
    id: string;
    name: string;
    category: string;
    form: string;
    nutritionScore: number;
    sustainabilityScore: number;
    costScore: number;
    overallScore: number;
    price: number;
    unit: string;
    activeProducts: number;
    conceptProducts: number;
    origin: string;
    starred: boolean;
    flagged: boolean;
    trendPct: number;
    trendPositive: boolean;
    certifications: string[];
}

/** UI-only state for the catalog page (filters + view mode + applied search term). */
export interface IngredientCatalogUi {
    statusFilter: IngredientStatusFilter;
    formFilter: IngredientFormFilter;
    categoryFilter: IngredientCategoryFilter;
    displayMode: "grid" | "list";
    searchApplied: string;
}

/** Detail page state — single ingredient + load status. */
export interface IngredientDetailState {
    id: string | null;
    data: ISupplierIngredient | undefined;
    status: LoadStatus;
}

/** Combined slice shape stored under `state.ingredient`. */
export interface IngredientState {
    list: ISupplierIngredient[];
    pagination: IIngredientPagination;
    loadStatus: LoadStatus;
    ui: IngredientCatalogUi;
    detail: IngredientDetailState;
    addFormOptions: IngredientAddFormOptionsState;
}
