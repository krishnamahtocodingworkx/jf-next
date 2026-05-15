// Module helpers for Products: list-row normalization, create payload builder, category parsing, catalog-card mapping,
// plus the initial-state factories and pure filter utilities consumed by the product slice.
import type { IProductCatalogRow } from "@/interfaces/product";
import type {
    AddPanelBrandsState,
    AddPanelListField,
    CatalogFilterB,
    ProductAddPanelState,
    ProductState,
} from "@/utils/model";
import {
    isValidMongoObjectId,
    toFiniteNumber,
    unwrapApiListData,
} from "@/utils/commonFunctions";

/** Standardises raw API rows from v1 and legacy endpoints into a single shape (always has `id` + `brand` object). */
export function normalizeProductListItem(raw: Record<string, unknown>): Record<string, unknown> {
    const id = String((raw._id as string | undefined) ?? (raw.id as string | undefined) ?? "");
    const brand = raw.brand;
    return {
        ...raw,
        id,
        name: raw.name ?? "",
        product_status:
            raw.product_status ??
            (raw.active === true || raw.active === "true" || String(raw.active) === "1"),
        nutritionScore: raw.nutritionScore,
        brand:
            brand && typeof brand === "object"
                ? brand
                : { name: typeof brand === "string" ? brand : "-" },
    };
}

/** Maps Add Product form values + user profile into the create-product API body; validates Mongo ids and strips custom ingredients. */
export function buildCreateProductPayload(
    values: Record<string, unknown>,
    profile: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
    const rows = Array.isArray(values.ingredients)
        ? (values.ingredients as Array<Record<string, unknown>>)
        : [];
    const isRealIngredient = (row: Record<string, unknown>) =>
        !String((row?.ingredient as { id?: string } | undefined)?.id || "").startsWith("custom:");

    const realRows = rows.filter(isRealIngredient);
    const unit = String((realRows[0]?.unit as string | undefined) || "g");

    const ingredients = realRows.map((row) => ({
        ingredient: String((row.ingredient as { id?: string } | undefined)?.id || ""),
        weight: Number(row.weight) || 0,
        unit: String((row.unit as string | undefined) || "g"),
    }));

    const manufacturerRaw =
        values.manufacturer != null && String(values.manufacturer).trim() !== ""
            ? String(values.manufacturer).trim()
            : "";
    const brandIdRaw = values.brand_id ? String(values.brand_id).trim() : "";
    const profileCompany = profile?.company as { id?: string; _id?: string } | undefined;
    const companyIdRaw = values.company_id
        ? String(values.company_id)
        : String(profileCompany?.id || profileCompany?._id || "");

    const brandId = isValidMongoObjectId(brandIdRaw) ? brandIdRaw : "";
    const manufacturerId = isValidMongoObjectId(manufacturerRaw) ? manufacturerRaw : null;
    const companyId = isValidMongoObjectId(companyIdRaw) ? companyIdRaw : "";

    const payload: Record<string, unknown> = {
        name: String(values.name || "").trim(),
        description: String(values.notes || "").trim(),
        ingredients,
        category: String(values.category || "").trim(),
        brand: brandId,
        unit,
        company: companyId,
        muteNotifications: false,
        muteAnalytics: false,
        newVersion: false,
    };
    if (manufacturerId) payload.manufacturer = manufacturerId;
    return payload;
}

/** Unwraps the category-list envelope (`{ data: [...] }` or `{ data: { data: [...] } }`) into a row array. */
export function parseCategoryListRows(data: unknown): Record<string, unknown>[] {
    const body = (data ?? {}) as Record<string, unknown>;
    if (Array.isArray(body.data)) return body.data as Record<string, unknown>[];
    return unwrapApiListData(body.data ?? body);
}

/** Finds the row that matches the requested category/subCategory; falls back to the first row when nothing matches. */
export function pickCategoryListRow(
    rows: Record<string, unknown>[],
    match: { category?: string; subCategory?: string },
): Record<string, unknown> | undefined {
    const category = String(match.category ?? "").trim();
    const subCategory = String(match.subCategory ?? "").trim();
    if (subCategory) {
        const bySub = rows.find(
            (row) =>
                String(row.subCategory ?? row.subcategory ?? "") === subCategory ||
                String(row.category ?? "") === subCategory,
        );
        if (bySub) return bySub;
    }
    if (category) {
        const byCat = rows.find((row) => String(row.category ?? "") === category);
        if (byCat) return byCat;
    }
    return rows[0];
}

/** Pulls the `productTypes` + `subCategories` arrays out of a category-list row in a type-safe way. */
export function extractCategoryBundle(row: Record<string, unknown> | undefined): {
    productTypes: string[];
    subCategories: string[];
} {
    if (!row) return { productTypes: [], subCategories: [] };
    const productTypes = Array.isArray(row.productTypes)
        ? (row.productTypes as unknown[]).map(String)
        : [];
    const subCategories = Array.isArray(row.subCategories)
        ? (row.subCategories as unknown[]).map(String)
        : [];
    return { productTypes, subCategories };
}

/** Deterministic fallback tag set picked by hash when the API row has no tags/labels/claims. */
const CATALOG_TAG_POOL = [
    ["Vegan", "Non-GMO"],
    ["Gluten-Free", "Low Sugar"],
    ["Electrolytes", "Non-GMO"],
    ["Omega-3", "Vegan"],
];

/** Stable per-row hash used to seed presentational defaults so cards look the same across re-renders. */
function catalogHashSeed(id: string, index: number): number {
    const seed = `${id}#${index}`;
    let hash = 0;
    for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
    return Math.abs(hash);
}

/** Returns the first finite-number value across the given API field aliases. */
function catalogReadNumber(raw: Record<string, unknown>, keys: string[]): number | undefined {
    for (const key of keys) {
        const value = toFiniteNumber(raw[key]);
        if (value !== undefined) return value;
    }
    return undefined;
}

/** Returns the first non-empty string value across the given API field aliases. */
function catalogReadString(raw: Record<string, unknown>, keys: string[]): string {
    for (const key of keys) {
        const value = raw[key];
        if (typeof value === "string" && value.trim()) return value.trim();
    }
    return "";
}

/** Best-effort category label for the catalog subline (category / subcategory / product_type, in that order). */
function catalogCategoryLabel(raw: Record<string, unknown>): string {
    const category = raw.category;
    if (typeof category === "string" && category.trim()) return category.trim();
    if (category && typeof category === "object") {
        const obj = category as Record<string, unknown>;
        const text = catalogReadString(obj, ["name", "title", "label"]);
        if (text) return text;
    }
    const sub = catalogReadString(raw, ["subcategory", "sub_category", "product_subcategory", "type"]);
    if (sub) return sub;
    const productType = raw.product_type;
    if (productType && typeof productType === "object") {
        const obj = productType as Record<string, unknown>;
        const text = catalogReadString(obj, ["name", "title", "label"]);
        if (text) return text;
    }
    return "";
}

/** Collects tag strings from `tags`/`labels`/`claims`/`certifications` arrays (deduped, capped at 8). */
function catalogParseTags(raw: Record<string, unknown>): string[] {
    const out: string[] = [];
    const pushMany = (arr: unknown) => {
        if (!Array.isArray(arr)) return;
        for (const item of arr) {
            if (typeof item === "string" && item.trim()) out.push(item.trim());
            else if (item && typeof item === "object") {
                const obj = item as Record<string, unknown>;
                const name = catalogReadString(obj, ["name", "title", "label"]);
                if (name) out.push(name);
            }
        }
    };
    pushMany(raw.tags);
    pushMany(raw.labels);
    pushMany(raw.claims);
    pushMany(raw.certifications);
    return Array.from(new Set(out)).slice(0, 8);
}

/** Converts a wire product into the catalog card row used by grid + list views; fills gaps with hash-seeded defaults. */
export function apiProductToCatalogRow(
    raw: Record<string, unknown>,
    index: number,
): IProductCatalogRow {
    const id = String(raw.id ?? raw._id ?? index);
    const hash = catalogHashSeed(id, index);
    const name = String(raw.name ?? "Product");
    const brandName =
        raw.brand && typeof raw.brand === "object" && (raw.brand as { name?: string }).name
            ? String((raw.brand as { name?: string }).name)
            : catalogReadString(raw, ["brand_name", "brandName"]) || "Brand";

    const category = catalogCategoryLabel(raw);
    const subline = category ? `${brandName} · ${category}` : `${brandName}`;

    const nutrition =
        catalogReadNumber(raw, ["nutritionScore", "nutrition_score", "nutrition", "Nutrition"]) ??
        78 + (hash % 15);
    const sustain =
        catalogReadNumber(raw, [
            "sustainabilityScore",
            "sustainability_score",
            "sustain_score",
            "sustain",
            "Sustainability",
        ]) ?? 76 + (hash % 16);
    const cost =
        catalogReadNumber(raw, ["costScore", "cost_score", "cost", "commercial_score", "Cost"]) ??
        74 + (hash % 18);

    const overallFromApi = catalogReadNumber(raw, [
        "overallScore",
        "overall_score",
        "portfolio_score",
        "guava_score",
        "average_score",
        "score",
    ]);
    const overallScore =
        overallFromApi != null
            ? Math.min(100, Math.round(overallFromApi))
            : Math.min(100, Math.round((nutrition + sustain + cost) / 3));

    const priceNum =
        catalogReadNumber(raw, [
            "retail_price",
            "price",
            "unit_price",
            "selling_price",
            "markup",
            "retailCost",
        ]) ?? 2.5 + (hash % 80) / 10;

    const trendPct =
        catalogReadNumber(raw, [
            "trend_pct",
            "trendPct",
            "change_percent",
            "price_change_pct",
            "delta_pct",
        ]) ?? ((hash % 25) + 5) / 10;
    const trendStableRaw = raw.trend_stable ?? raw.trendStable;
    const trendStable =
        trendStableRaw === true ||
        trendStableRaw === "true" ||
        String(trendStableRaw).toLowerCase() === "stable" ||
        (trendPct === 0 && catalogReadString(raw, ["trend_label"]) === "Stable");

    let trendPositive = hash % 3 !== 0;
    const trendPositiveRaw = raw.trend_positive ?? raw.trendPositive;
    if (typeof trendPositiveRaw === "boolean") trendPositive = trendPositiveRaw;
    else if (catalogReadString(raw, ["trend_direction"]) === "down") trendPositive = false;
    else if (catalogReadString(raw, ["trend_direction"]) === "up") trendPositive = true;

    const tags = catalogParseTags(raw);
    const tagList = tags.length ? tags : CATALOG_TAG_POOL[hash % CATALOG_TAG_POOL.length];

    const statusRaw = raw.product_status ?? raw.active ?? raw.retail;
    const product_status =
        statusRaw === true ||
        statusRaw === "true" ||
        String(statusRaw) === "1" ||
        String(statusRaw).toLowerCase() === "active"
            ? true
            : statusRaw === false ||
                statusRaw === "false" ||
                String(statusRaw) === "0" ||
                String(statusRaw).toLowerCase() === "concept" ||
                String(statusRaw).toLowerCase() === "inactive"
              ? false
              : hash % 2 === 0;

    const starred =
        raw.starred === true ||
        raw.is_guava === true ||
        raw.featured === true ||
        catalogReadString(raw, ["badge"]) === "star" ||
        hash % 7 === 1;

    const regulatoryWarning =
        catalogReadString(raw, [
            "regulatory_warning",
            "regulatoryWarning",
            "compliance_message",
            "warning_message",
        ]) || undefined;

    return {
        id,
        name,
        brandName,
        image_uri: typeof raw.image_uri === "string" ? raw.image_uri : undefined,
        subline,
        tags: tagList,
        overallScore,
        nutrition: Math.round(Number(nutrition)),
        sustain: Math.round(Number(sustain)),
        cost: Math.round(Number(cost)),
        price: Number(priceNum),
        trendPct: Number(trendPct),
        trendPositive,
        trendStable: Boolean(trendStable),
        product_status,
        starred: Boolean(starred),
        regulatoryWarning,
    };
}

// ─── Slice initial-state factories ─────────────────────────────────────────

/** Empty `{ status, items }` dropdown state — used by every lazy Add Product field. */
export const emptyAddPanelListField = (): AddPanelListField => ({
    status: "idle",
    items: [],
});

/** Empty brand dropdown state — adds the `enrichment` flag + brand→company map. */
export const emptyAddPanelBrandsState = (): AddPanelBrandsState => ({
    status: "idle",
    items: [],
    enrichment: "idle",
    companyByBrandId: {},
});

/** Builds the full add-panel slice with every field in `idle`. */
export const createInitialAddPanelState = (): ProductAddPanelState => ({
    companyTypes: emptyAddPanelListField(),
    rootCategories: emptyAddPanelListField(),
    categoryBundles: {},
    subCategoryBundles: {},
    brands: emptyAddPanelBrandsState(),
    manufacturers: emptyAddPanelListField(),
    countries: emptyAddPanelListField(),
    currencies: emptyAddPanelListField(),
    ingredients: {
        status: "idle",
        term: "",
        page: 1,
        list: [],
        pagination: { page: 1, pages: 1, size: 20, total: 0 },
    },
});

/** Reset state for the product slice — catalog empty, no detail loaded, add-panel idle. */
export const createInitialProductState = (): ProductState => ({
    catalog: {
        list: [],
        total: 0,
        page: 1,
        totalPages: 1,
        nextHit: false,
        limit: 10,
        loadStatus: "idle",
        search: "",
        filterA: "all",
        filterB: "all",
        displayMode: "grid",
    },
    detail: {
        id: null,
        data: undefined,
        status: "idle",
    },
    addPanel: createInitialAddPanelState(),
});

// ─── Pure filter utility used by the catalog selector ──────────────────────

/** Client-side keyword match for the category pill — backend doesn't yet support these as filter params. */
export function matchesCatalogCategoryPill(name: string, filterB: CatalogFilterB): boolean {
    if (filterB === "all") return true;
    const n = (name || "").toLowerCase();
    switch (filterB) {
        case "bars":
            return /bar/i.test(n);
        case "beverages":
            return /drink|water|latte|beverage|smoothie|juice|electrolyte/i.test(n);
        case "powders":
            return /powder|collagen|adaptogenic|mushroom/i.test(n) && !/protein\s*crunch/i.test(n);
        case "snacks":
            return /bite|gumm|cereal|protein\s*crunch/i.test(n);
        case "supplements":
            return /collagen|prebiotic|fiber\s*gumm/i.test(n);
        default:
            return true;
    }
}
