/** Minimal supplier-dashboard ingredient row . */
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

export interface IIngredientPagination {
    page: number;
    pages: number;
    size: number;
    total: number;
}

export interface IIngredientUsageChart {
    labels: string[];
    activeCounts: number[];
    conceptCounts: number[];
}

/** Normalised row used by the catalog cards in the UI. */
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
