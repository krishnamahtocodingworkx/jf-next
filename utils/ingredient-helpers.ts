// Module helpers for Ingredients: row mapping, pagination normalization, catalog-card derivation,
// plus the initial-state values consumed by the ingredient slice.
import type {
    IIngredientCatalogRow,
    IIngredientPagination,
    IIngredientUsageChart,
    IngredientCatalogUi,
    IngredientState,
    ISupplierIngredient,
} from "@/interfaces/ingredient";
import { toFiniteNumber, unwrapApiListData } from "@/utils/commonFunctions";

/** Default chart state used by `ingredientService.getIngredientUsage` on miss/error. */
export const EMPTY_INGREDIENT_USAGE: IIngredientUsageChart = {
    labels: [],
    activeCounts: [],
    conceptCounts: [],
};

/** Empty pagination meta returned by the service on error so callers can render an empty list safely. */
export const emptyIngredientPagination = (size: number): IIngredientPagination => ({
    page: 1,
    pages: 1,
    size,
    total: 0,
});

/** Returns the first non-empty string value across the given keys (handles inconsistent backend field names). */
function pickString(row: Record<string, unknown>, keys: string[]): string | undefined {
    for (const key of keys) {
        const value = row[key];
        if (typeof value === "string" && value.trim()) return value.trim();
    }
    return undefined;
}

/** Returns the first finite-number value across the given keys. */
function pickNumber(row: Record<string, unknown>, keys: string[]): number | undefined {
    for (const key of keys) {
        const value = toFiniteNumber(row[key]);
        if (value !== undefined) return value;
    }
    return undefined;
}

/** Copies score/count fields out of nested `usage`/`stats`/`meta` objects up to the row root for uniform reads. */
function flattenIngredientRow(row: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = { ...row };
    const assignIf = (key: string, value: unknown) => {
        if (out[key] == null && value != null) out[key] = value;
    };

    const usage = (row.usage ?? row.product_usage ?? row.portfolio_usage ?? row.portfolio) as
        | Record<string, unknown>
        | undefined;
    if (usage && typeof usage === "object") {
        assignIf(
            "active_count",
            usage.active ?? usage.active_count ?? usage.activeCount ?? usage.retail ?? usage.retail_count,
        );
        assignIf(
            "concept_count",
            usage.concept ?? usage.concept_count ?? usage.conceptCount ?? usage.concept_products,
        );
    }

    const counts = row.product_counts as Record<string, unknown> | undefined;
    if (counts && typeof counts === "object") {
        assignIf("active_count", counts.active ?? counts.retail);
        assignIf("concept_count", counts.concept);
    }

    const stats = row.stats as Record<string, unknown> | undefined;
    if (stats && typeof stats === "object") {
        assignIf("active_count", stats.active_products ?? stats.activeProducts);
        assignIf("concept_count", stats.concept_products ?? stats.conceptProducts);
        assignIf("nutrition_score", stats.nutritionScore ?? stats.nutrition_score);
        assignIf("sustainability_score", stats.sustainabilityScore ?? stats.sustainability_score);
        assignIf("cost_score", stats.costScore ?? stats.cost_score);
        assignIf("overall_score", stats.overallScore ?? stats.score);
    }

    const meta = row.meta as Record<string, unknown> | undefined;
    if (meta && typeof meta === "object") {
        assignIf("active_count", meta.active_count);
        assignIf("concept_count", meta.concept_count);
    }

    return out;
}

/** Normalises a raw API row (snake_case, camelCase, alias soup) into the internal `ISupplierIngredient` shape. */
export function mapIngredientListRow(raw: Record<string, unknown>): ISupplierIngredient {
    const row = flattenIngredientRow(raw);
    const id = String(row._id ?? row.id ?? "").trim();
    const name = pickString(row, ["name", "jf_display_name", "jfDisplayName", "title"]);
    const claim = pickString(row, [
        "claim",
        "category",
        "ingredient_category",
        "food_group",
        "subcategory",
        "sub_category",
        "type",
        "ingredient_type",
    ]);
    const origin = pickString(row, [
        "origin_country",
        "originCountry",
        "country_of_origin",
        "country",
        "source_country",
        "origin",
    ]);

    const active =
        pickNumber(row, [
            "active_count",
            "activeCount",
            "products_active",
            "active_products",
            "retail_product_count",
            "retailProductCount",
            "num_active_products",
        ]) ?? 0;
    const concept =
        pickNumber(row, [
            "concept_count",
            "conceptCount",
            "products_concept",
            "concept_products",
            "concept_product_count",
            "conceptProductCount",
        ]) ?? 0;

    const supplierAudit =
        row.supplier_audit_scheduled === true ||
        row.supplierAuditScheduled === true ||
        String(row.audit_status || "")
            .toLowerCase()
            .includes("scheduled");
    const starred =
        row.is_starred === true ||
        row.starred === true ||
        row.featured === true ||
        row.isStarred === true;

    return {
        id,
        jf_display_name: name,
        nutrition_score: pickNumber(row, [
            "nutritionScore",
            "nutrition_score",
            "nutrition",
            "nutritionRating",
        ]),
        sustainability_score: pickNumber(row, [
            "sustainabilityScore",
            "sustainability_score",
            "sustain",
            "sustainabilityRating",
        ]),
        cost_score: pickNumber(row, ["costScore", "cost_score", "cost", "commercial_score"]),
        overall_score: pickNumber(row, [
            "overallScore",
            "overall_score",
            "score",
            "portfolio_score",
            "guava_score",
        ]),
        active_count: active,
        concept_count: concept,
        estimated_price: pickNumber(row, [
            "estimated_price",
            "price_per_kg",
            "estimatedPrice",
            "pricePerKg",
            "price",
            "current_price",
            "unit_price",
        ]),
        image_url: pickString(row, ["image_url", "image_uri", "thumbnail_url"]),
        datasheet_url: pickString(row, ["datasheet_url", "datasheetUrl", "co_url"]),
        certifications: Array.isArray(row.certifications)
            ? (row.certifications as unknown[])
            : Array.isArray(row.labels)
              ? (row.labels as unknown[])
              : undefined,
        claim,
        origin_country: origin,
        trend_pct: pickNumber(row, ["trend_pct", "change_percent", "delta_pct", "price_change_pct"]),
        trend_positive:
            typeof row.trend_positive === "boolean"
                ? row.trend_positive
                : typeof row.trendPositive === "boolean"
                  ? row.trendPositive
                  : undefined,
        supplier_audit_scheduled: Boolean(supplierAudit),
        is_starred: Boolean(starred),
    };
}

/** Reads page/size/total from whatever pagination keys the backend used and reconciles them against what was sent. */
export function normalizeIngredientPaginationMeta(
    rawMeta: Record<string, unknown>,
    sentPage: number,
    sentSize: number,
): IIngredientPagination {
    const meta = rawMeta || {};
    const size =
        toFiniteNumber(meta.size) ??
        toFiniteNumber(meta.limit) ??
        toFiniteNumber(meta.page_size) ??
        sentSize;
    const total = toFiniteNumber(meta.total) ?? toFiniteNumber(meta.count) ?? 0;

    let page = sentPage;
    const pageNum = toFiniteNumber(meta.page);
    const offset = toFiniteNumber(meta.offset);
    if (pageNum !== undefined && pageNum > 0) {
        page = Math.max(1, pageNum);
    } else if (offset !== undefined && offset > 0) {
        if (offset === sentPage || Math.abs(offset - sentPage) <= 10) page = Math.max(1, offset);
    }

    const pages =
        toFiniteNumber(meta.totalPages) ??
        toFiniteNumber(meta.pages) ??
        toFiniteNumber(meta.total_pages) ??
        (total && size ? Math.max(1, Math.ceil(total / size)) : 1);

    return { page, size, pages, total };
}

/** Single entry point used by the service: unwrap, map each row, then attach normalized pagination. */
export function parseIngredientListBody(
    body: Record<string, unknown>,
    sentPage: number,
    sentSize: number,
): { list: ISupplierIngredient[]; pagination: IIngredientPagination } {
    const rows = unwrapApiListData(body);
    const list = rows.map(mapIngredientListRow);
    const inner = (body?.data ?? body) as Record<string, unknown>;
    const pagination = normalizeIngredientPaginationMeta(inner, sentPage, sentSize);
    return { list, pagination };
}

/** Deterministic hash used to seed presentational defaults (scores, trends) when API values are missing. */
function ingredientHash(id: string): number {
    let hash = 0;
    for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(hash);
}

/** Best-effort physical-form classifier based on name/claim text — drives the "form" filter on the catalog. */
function inferIngredientForm(name: string, claim: string | undefined): string {
    const text = `${name} ${claim ?? ""}`.toLowerCase();
    if (/powder/.test(text)) return "Powder";
    if (/liquid|extract|concentrate/.test(text)) return "Liquid";
    if (/puree|paste/.test(text)) return "Puree";
    if (/granule|granulate/.test(text)) return "Granule";
    if (/crystal/.test(text)) return "Crystal";
    return "Powder";
}

/** Best-effort use-case classifier from claim text — drives the "category" filter on the catalog. */
function inferIngredientCategory(claim: string | undefined): string {
    const text = (claim ?? "").toLowerCase();
    if (/beverage|drink|water|juice|tea/.test(text)) return "Beverages";
    if (/cosmetic|skin|beauty/.test(text)) return "Cosmetic";
    if (/household|cleaning|detergent/.test(text)) return "Household";
    if (/supplement|vitamin|mineral/.test(text)) return "Supplement";
    return "Food";
}

/** Converts the wire model into the row shape the catalog cards/list render, filling missing fields with seeded defaults. */
export function ingredientToCatalogRow(row: ISupplierIngredient): IIngredientCatalogRow {
    const hash = ingredientHash(row.id || "x");
    const name = row.jf_display_name || "Unnamed Ingredient";
    const nutrition = Math.round(Number(row.nutrition_score ?? 70 + (hash % 25)));
    const sustain = Math.round(Number(row.sustainability_score ?? 65 + (hash % 30)));
    const cost = Math.round(Number(row.cost_score ?? 60 + (hash % 35)));
    const overall = Math.round(
        Number(row.overall_score ?? Math.round((nutrition + sustain + cost) / 3)),
    );
    const certifications = Array.isArray(row.certifications)
        ? row.certifications
              .map((entry) => {
                  if (typeof entry === "string") return entry.trim();
                  if (entry && typeof entry === "object") {
                      const obj = entry as Record<string, unknown>;
                      return String(obj.name || obj.title || obj.label || "").trim();
                  }
                  return "";
              })
              .filter(Boolean)
              .slice(0, 4)
        : [];

    const flagged = Boolean(row.supplier_audit_scheduled) || overall < 50;

    return {
        id: row.id,
        name,
        category: inferIngredientCategory(row.claim),
        form: inferIngredientForm(name, row.claim),
        nutritionScore: nutrition,
        sustainabilityScore: sustain,
        costScore: cost,
        overallScore: overall,
        price: Number(row.estimated_price ?? 0),
        unit: "kg",
        activeProducts: Number(row.active_count ?? 0),
        conceptProducts: Number(row.concept_count ?? 0),
        origin: row.origin_country || "Unknown",
        starred: Boolean(row.is_starred),
        flagged,
        trendPct: Number(row.trend_pct ?? 0),
        trendPositive:
            typeof row.trend_positive === "boolean" ? row.trend_positive : hash % 3 !== 0,
        certifications,
    };
}

// ─── Slice initial-state factories ─────────────────────────────────────────

/** First-page pagination meta — used before any list response is parsed. */
export const INITIAL_INGREDIENT_PAGINATION: IIngredientPagination = {
    page: 1,
    pages: 1,
    size: 10,
    total: 0,
};

/** Default catalog UI state — all filters off, grid view, no search applied. */
export const INITIAL_INGREDIENT_CATALOG_UI: IngredientCatalogUi = {
    statusFilter: "all",
    formFilter: "all",
    categoryFilter: "all",
    displayMode: "grid",
    searchApplied: "",
};

/** Reset state for the ingredient slice — empty catalog, no detail loaded, dropdowns idle. */
export const createInitialIngredientState = (): IngredientState => ({
    list: [],
    pagination: { ...INITIAL_INGREDIENT_PAGINATION },
    loadStatus: "idle",
    ui: { ...INITIAL_INGREDIENT_CATALOG_UI },
    detail: { id: null, data: undefined, status: "idle" },
    addFormOptions: {
        countries: [],
        companies: [],
        status: "idle",
    },
});
