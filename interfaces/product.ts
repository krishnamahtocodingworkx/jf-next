/** Minimal product shape for search + listing . */
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

export interface IPaginationMeta {
    page: number;
    pages: number;
    size: number;
    total: number;
}

export interface IPaginated<T> {
    list: T[];
    pagination: IPaginationMeta;
}

/** Normalised row used by the catalog cards in the UI. */
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
