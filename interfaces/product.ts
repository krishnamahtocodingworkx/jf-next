// Wire + UI models for the Products module.

/** API-side product shape used by detail + catalog (kept loose; the index signature handles unknown fields). */
export interface IProduct {
    id: string;
    name?: string;
    version?: number | string;
    image_uri?: string;
    product_status?: boolean;
    brand?: { name?: string; id?: string } | string;
    nutritionScore?: number;
    sustainabilityScore?: number;
    costScore?: number;
    overallScore?: number;
    code?: string;
    displayPrice?: number;
    notes?: string;
    objective?: string[];
    ingredients?: Array<{
        ingredient?: { jf_display_name?: string; id?: string };
        weight?: string | number;
        unit?: string;
    }>;
    [key: string]: unknown;
}

/** Generic pagination meta. */
export interface IPaginationMeta {
    page: number;
    pages: number;
    size: number;
    total: number;
}

/** Generic `{ list, pagination }` envelope. */
export interface IPaginated<T> {
    list: T[];
    pagination: IPaginationMeta;
}

/** UI-side row consumed by the catalog cards and detail drawer (produced by `apiProductToCatalogRow`). */
export interface IProductCatalogRow {
    id: string;
    name: string;
    image_uri?: string;
    brandName: string;
    subline: string;
    tags: string[];
    overallScore: number;
    nutrition: number;
    sustain: number;
    cost: number;
    price: number;
    trendPct: number;
    trendPositive: boolean;
    trendStable: boolean;
    product_status: boolean;
    starred: boolean;
    regulatoryWarning?: string;
}
