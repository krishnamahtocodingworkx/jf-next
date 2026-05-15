import { api } from "@/services/api";
import { ENDPOINTS } from "@/utils/endpoints";
import { handleApiError } from "@/utils/service";
import type {
    IIngredientPagination,
    IIngredientUsageChart,
    ISupplierIngredient,
} from "@/interfaces/ingredient";

const emptyUsage: IIngredientUsageChart = { labels: [], activeCounts: [], conceptCounts: [] };

function toNum(v: unknown): number | undefined {
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() !== "") {
        const n = Number(v);
        if (!Number.isNaN(n) && Number.isFinite(n)) return n;
    }
    return undefined;
}

function flattenIngredientRow(r: Record<string, unknown>): Record<string, unknown> {
    const out: Record<string, unknown> = { ...r };
    const assignIf = (key: string, val: unknown) => {
        if (out[key] == null && val != null) out[key] = val;
    };

    const usage = (r.usage ?? r.product_usage ?? r.portfolio_usage ?? r.portfolio) as
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

    const counts = r.product_counts as Record<string, unknown> | undefined;
    if (counts && typeof counts === "object") {
        assignIf("active_count", counts.active ?? counts.retail);
        assignIf("concept_count", counts.concept);
    }

    const stats = r.stats as Record<string, unknown> | undefined;
    if (stats && typeof stats === "object") {
        assignIf("active_count", stats.active_products ?? stats.activeProducts);
        assignIf("concept_count", stats.concept_products ?? stats.conceptProducts);
        assignIf("nutrition_score", stats.nutritionScore ?? stats.nutrition_score);
        assignIf("sustainability_score", stats.sustainabilityScore ?? stats.sustainability_score);
        assignIf("cost_score", stats.costScore ?? stats.cost_score);
        assignIf("overall_score", stats.overallScore ?? stats.score);
    }

    const meta = r.meta as Record<string, unknown> | undefined;
    if (meta && typeof meta === "object") {
        assignIf("active_count", meta.active_count);
        assignIf("concept_count", meta.concept_count);
    }

    return out;
}

function mapIngredientListRow(raw: Record<string, unknown>): ISupplierIngredient {
    const r = flattenIngredientRow(raw);
    const id = String(r._id ?? r.id ?? "").trim();
    const name =
        r.name != null
            ? String(r.name)
            : r.jf_display_name != null
              ? String(r.jf_display_name)
              : r.jfDisplayName != null
                ? String(r.jfDisplayName)
                : r.title != null
                  ? String(r.title)
                  : undefined;

    const claimRaw =
        r.claim ??
        r.category ??
        r.ingredient_category ??
        r.food_group ??
        r.subcategory ??
        r.sub_category ??
        r.type ??
        r.ingredient_type;

    const origin =
        r.origin_country ??
        r.originCountry ??
        r.country_of_origin ??
        r.country ??
        r.source_country ??
        r.origin;

    const active =
        toNum(
            r.active_count ??
                r.activeCount ??
                r.products_active ??
                r.active_products ??
                r.retail_product_count ??
                r.retailProductCount ??
                r.num_active_products,
        ) ?? 0;
    const concept =
        toNum(
            r.concept_count ??
                r.conceptCount ??
                r.products_concept ??
                r.concept_products ??
                r.concept_product_count ??
                r.conceptProductCount,
        ) ?? 0;

    const supplierAudit =
        r.supplier_audit_scheduled === true ||
        r.supplierAuditScheduled === true ||
        String(r.audit_status || "")
            .toLowerCase()
            .includes("scheduled");

    const starred =
        r.is_starred === true ||
        r.starred === true ||
        r.featured === true ||
        r.isStarred === true;

    return {
        id,
        jf_display_name: name,
        nutrition_score: toNum(r.nutritionScore ?? r.nutrition_score ?? r.nutrition ?? r.nutritionRating),
        sustainability_score: toNum(
            r.sustainabilityScore ?? r.sustainability_score ?? r.sustain ?? r.sustainabilityRating,
        ),
        cost_score: toNum(r.costScore ?? r.cost_score ?? r.cost ?? r.commercial_score),
        overall_score: toNum(
            r.overallScore ?? r.overall_score ?? r.score ?? r.portfolio_score ?? r.guava_score,
        ),
        active_count: active,
        concept_count: concept,
        estimated_price: toNum(
            r.estimated_price ??
                r.price_per_kg ??
                r.estimatedPrice ??
                r.pricePerKg ??
                r.price ??
                r.current_price ??
                r.unit_price,
        ),
        image_url:
            typeof r.image_url === "string"
                ? (r.image_url as string)
                : typeof r.image_uri === "string"
                  ? (r.image_uri as string)
                  : typeof r.thumbnail_url === "string"
                    ? (r.thumbnail_url as string)
                    : undefined,
        datasheet_url:
            typeof r.datasheet_url === "string"
                ? (r.datasheet_url as string)
                : typeof r.datasheetUrl === "string"
                  ? (r.datasheetUrl as string)
                  : typeof r.co_url === "string"
                    ? (r.co_url as string)
                    : undefined,
        certifications: Array.isArray(r.certifications)
            ? (r.certifications as unknown[])
            : Array.isArray(r.labels)
              ? (r.labels as unknown[])
              : undefined,
        claim: claimRaw != null ? String(claimRaw).trim() : undefined,
        origin_country: origin != null ? String(origin).trim() : undefined,
        trend_pct: toNum(r.trend_pct ?? r.change_percent ?? r.delta_pct ?? r.price_change_pct),
        trend_positive:
            typeof r.trend_positive === "boolean"
                ? (r.trend_positive as boolean)
                : typeof r.trendPositive === "boolean"
                  ? (r.trendPositive as boolean)
                  : undefined,
        supplier_audit_scheduled: Boolean(supplierAudit),
        is_starred: Boolean(starred),
    };
}

function normalizePaginationMeta(
    rawMeta: Record<string, unknown>,
    sentPage: number,
    sentSize: number,
    fallbackPage: number,
): IIngredientPagination {
    const rm = rawMeta || {};
    const size =
        (typeof rm.size === "number" ? (rm.size as number) : undefined) ??
        (typeof rm.limit === "number" ? (rm.limit as number) : undefined) ??
        (typeof rm.page_size === "number" ? (rm.page_size as number) : undefined) ??
        sentSize;
    const total =
        (typeof rm.total === "number" ? (rm.total as number) : undefined) ??
        (typeof rm.count === "number" ? (rm.count as number) : undefined) ??
        0;

    let page = fallbackPage;
    if (typeof rm.page === "number" && rm.page > 0) page = Math.max(1, rm.page as number);
    else if (typeof rm.offset === "number" && (rm.offset as number) > 0) {
        const off = rm.offset as number;
        if (off === sentPage || Math.abs(off - sentPage) <= 10) page = Math.max(1, off);
    }

    const pages =
        (typeof rm.totalPages === "number" ? (rm.totalPages as number) : undefined) ??
        (typeof rm.pages === "number" ? (rm.pages as number) : undefined) ??
        (typeof rm.total_pages === "number" ? (rm.total_pages as number) : undefined) ??
        (total && size ? Math.max(1, Math.ceil(total / size)) : 1);

    return { page, size, pages, total };
}

function extractListRows(body: Record<string, unknown>): Record<string, unknown>[] {
    const inner = (body?.data ?? body) as Record<string, unknown>;
    const candidates: unknown[] = [
        inner?.data,
        inner?.results,
        inner?.items,
        inner?.rows,
        inner?.ingredients,
        body?.data,
        (body?.data as Record<string, unknown> | undefined)?.data,
        Array.isArray(body) ? body : null,
    ];
    for (const c of candidates) {
        if (Array.isArray(c)) return c as Record<string, unknown>[];
    }
    return [];
}

function parseV1IngredientListBody(
    body: Record<string, unknown>,
    sentPage: number,
    sentSize: number,
): { list: ISupplierIngredient[]; pagination: IIngredientPagination } {
    const rows = extractListRows(body);
    const list = rows.map(mapIngredientListRow);
    const inner = (body?.data ?? body) as Record<string, unknown>;
    const pagination = normalizePaginationMeta(
        inner as Record<string, unknown>,
        sentPage,
        sentSize,
        sentPage,
    );
    console.log("[ingredientService] v1 list", { count: list.length, pagination });
    return { list, pagination };
}

class IngredientService {
    async fetchPaginatedIngredients(
        page: number,
        size: number,
    ): Promise<{ list: ISupplierIngredient[]; pagination: IIngredientPagination }> {
        const p = Math.max(1, page);
        const s = Math.max(1, size);
        try {
            const { data } = await api.get(ENDPOINTS.INGREDIENT.GET_INGREDIENT_LIST, {
                params: { page: p, limit: s },
            });
            const body = (data ?? {}) as Record<string, unknown>;
            return parseV1IngredientListBody(body, p, s);
        } catch (e) {
            console.log("[ingredientService] fetchPaginatedIngredients", e);
            handleApiError(e, "Ingredients");
            return { list: [], pagination: { page: 1, pages: 1, size: s, total: 0 } };
        }
    }

    async searchIngredients(
        term: string,
        page: number,
        size: number,
    ): Promise<{ list: ISupplierIngredient[]; pagination: IIngredientPagination }> {
        const t = term.trim();
        if (!t) return this.fetchPaginatedIngredients(page, size);

        const p = Math.max(1, page);
        const s = Math.max(1, size);
        try {
            const { data } = await api.get(ENDPOINTS.INGREDIENT.GET_INGREDIENT_LIST, {
                params: { page: p, limit: s, search: t },
            });
            const body = (data ?? {}) as Record<string, unknown>;
            return parseV1IngredientListBody(body, p, s);
        } catch (e) {
            console.log("[ingredientService] searchIngredients", e);
            handleApiError(e, "Ingredient Search");
            return { list: [], pagination: { page: 1, pages: 1, size: s, total: 0 } };
        }
    }

    async fetchIngredientById(id: string): Promise<ISupplierIngredient | undefined> {
        const clean = String(id || "").trim();
        if (!clean) return undefined;
        const paramSets: Record<string, string | number>[] = [
            { page: 1, limit: 1, _id: clean },
            { page: 1, limit: 1, id: clean },
            { page: 1, limit: 40, search: clean },
        ];
        for (const params of paramSets) {
            try {
                const { data } = await api.get(ENDPOINTS.INGREDIENT.GET_INGREDIENT_LIST, { params });
                const body = (data ?? {}) as Record<string, unknown>;
                const lim = typeof params.limit === "number" ? params.limit : 1;
                const parsed = parseV1IngredientListBody(body, 1, lim);
                const hit = parsed.list.find((x) => String(x.id) === clean);
                if (hit) return hit;
                if (parsed.list.length === 1) return parsed.list[0];
            } catch {
                /* try next param set */
            }
        }
        return undefined;
    }

    async getIngredientUsage(): Promise<IIngredientUsageChart> {
        try {
            const { data } = await api.get(ENDPOINTS.ANALYTICS.INGREDIENT_USAGE);
            if (!data || typeof data !== "object") return { ...emptyUsage };
            const o = data as Record<string, unknown>;
            const labels = o.labels;
            const activeCounts = o.activeCounts;
            const conceptCounts = o.conceptCounts;
            if (Array.isArray(labels) && Array.isArray(activeCounts) && Array.isArray(conceptCounts)) {
                return {
                    labels: labels as string[],
                    activeCounts: activeCounts as number[],
                    conceptCounts: conceptCounts as number[],
                };
            }
            return { ...emptyUsage };
        } catch (e) {
            console.log("[ingredientService] getIngredientUsage", e);
            return { ...emptyUsage };
        }
    }
}

export const ingredientService = new IngredientService();
