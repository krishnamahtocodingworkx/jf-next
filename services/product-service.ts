import { api } from "@/services/api";
import { ENDPOINTS } from "@/utils/endpoints";
import { handleApiError } from "@/utils/service";
import type { IProduct } from "@/interfaces/product";

const isMongoObjectId = (value: unknown): boolean => /^[a-f\d]{24}$/i.test(String(value || "").trim());

/** Map v1 `get-product-list` row + legacy shapes to a single item with `id` for UI. */
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

/** Build POST body for `/api/v1/product/create-product` from the Add Product form values. */
export function buildCreateProductPayload(
    values: Record<string, unknown>,
    profile: Record<string, unknown> | null | undefined,
): Record<string, unknown> {
    const rows = Array.isArray(values.ingredients)
        ? (values.ingredients as Array<Record<string, unknown>>)
        : [];
    const firstReal = rows.find(
        (i) => !String((i?.ingredient as { id?: string } | undefined)?.id || "").startsWith("custom:"),
    );
    const unit = String((firstReal?.unit as string | undefined) || "g");
    const userId = String(
        (profile?.id as string | undefined) ||
            (profile?._id as string | undefined) ||
            (profile?.user_id as string | undefined) ||
            "",
    );
    const ingredients = rows
        .filter(
            (i) => !String((i?.ingredient as { id?: string } | undefined)?.id || "").startsWith("custom:"),
        )
        .map((i) => ({
            ingredient: String((i.ingredient as { id?: string } | undefined)?.id || ""),
            weight: Number(i.weight) || 0,
            unit: String((i.unit as string | undefined) || "g"),
        }));
    const mfg =
        values.manufacturer != null && String(values.manufacturer).trim() !== ""
            ? String(values.manufacturer).trim()
            : "";
    const brandIdRaw = values.brand_id ? String(values.brand_id).trim() : "";
    const brandId = isMongoObjectId(brandIdRaw) ? brandIdRaw : "";
    const manufacturerId = isMongoObjectId(mfg) ? mfg : null;
    const companyIdRaw = values.company_id
        ? String(values.company_id)
        : String(
              (profile?.company as { id?: string; _id?: string } | undefined)?.id ||
                  (profile?.company as { id?: string; _id?: string } | undefined)?._id ||
                  "",
          );
    const companyId = isMongoObjectId(companyIdRaw) ? companyIdRaw : "";
    return {
        name: String(values.name || "").trim(),
        description: String(values.notes || "").trim(),
        ingredients,
        category: String(values.category || "").trim(),
        brand: brandId,
        manufacturer: manufacturerId,
        user: userId,
        unit,
        company: companyId,
        muteNotifications: false,
        muteAnalytics: false,
        newVersion: false,
    };
}

class ProductService {
    private unwrapAny(payload: unknown): unknown {
        if (payload == null) return payload;
        if (Array.isArray(payload)) return payload;
        if (typeof payload !== "object") return payload;
        const obj = payload as Record<string, unknown>;
        if (obj.data !== undefined) return this.unwrapAny(obj.data);
        if (obj.result !== undefined) return this.unwrapAny(obj.result);
        return payload;
    }

    private unwrapList(payload: unknown): Record<string, unknown>[] {
        const p = this.unwrapAny(payload);
        if (Array.isArray(p)) return p as Record<string, unknown>[];
        if (!p || typeof p !== "object") return [];
        const obj = p as Record<string, unknown>;
        const candidates = [obj.list, obj.items, obj.results, obj.rows, obj.data];
        for (const c of candidates) {
            if (Array.isArray(c)) return c as Record<string, unknown>[];
        }
        return [];
    }

    private toNum(v: unknown): number {
        const n = Number(v);
        return Number.isFinite(n) ? n : 0;
    }

    async getProductById(id: string): Promise<IProduct | undefined> {
        try {
            const { data } = await api.get(ENDPOINTS.PRODUCTS.BY_ID(id));
            const inner = (data?.data ?? data) as Record<string, unknown> | IProduct | undefined;
            const payload =
                inner && typeof inner === "object" && "data" in inner && (inner as Record<string, unknown>).data !== undefined
                    ? (inner as Record<string, unknown>).data
                    : inner;
            console.log("[productService] getProductById", id, Boolean(payload));
            return payload as IProduct | undefined;
        } catch (e) {
            console.log("[productService] getProductById failed", e);
            handleApiError(e, "Get Product");
            return undefined;
        }
    }

    async getProductsPage(params: {
        page?: number;
        limit?: number;
        brandId?: string;
        productStatus?: boolean;
        category?: string;
        search?: string;
    }): Promise<{
        list: Record<string, unknown>[];
        total: number;
        page: number;
        totalPages: number;
        nextHit: boolean;
        limit: number;
    }> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 12;
        try {
            const query: Record<string, string | number | boolean> = { page, limit };
            if (params.brandId) query.brand = params.brandId;
            if (typeof params.productStatus === "boolean") {
                query.productStatus = params.productStatus;
                query.active = params.productStatus;
            }
            if (params.category) query.category = params.category;
            if (params.search) query.search = params.search;
            const { data } = await api.get(ENDPOINTS.PRODUCTS.GET_PRODUCT_LIST, { params: query });
            const inner = this.unwrapAny(data) as Record<string, unknown> | undefined;
            const rows = this.unwrapList(inner);
            const list = rows.map((r) => normalizeProductListItem(r));
            const pagination = (inner?.pagination ??
                inner?.meta ??
                inner?.pageInfo ??
                {}) as Record<string, unknown>;
            const total = this.toNum(
                inner?.total ??
                    pagination.total ??
                    pagination.count ??
                    pagination.totalCount ??
                    list.length,
            );
            const totalPages = this.toNum(
                inner?.totalPages ??
                    pagination.pages ??
                    pagination.totalPages ??
                    (total > 0 ? Math.max(1, Math.ceil(total / Math.max(1, limit))) : 1),
            );
            const nextHit = Boolean(
                inner?.nextHit ?? pagination.nextHit ?? pagination.hasNext ?? pagination.next,
            );
            const lim =
                this.toNum(inner?.limit ?? pagination.size ?? pagination.limit ?? limit) || limit;
            const pg = this.toNum(inner?.page ?? pagination.page ?? page) || page;
            console.log("[productService] getProductsPage", {
                page: pg,
                total,
                totalPages,
                nextHit,
                count: list.length,
            });
            return { list, total, page: pg, totalPages, nextHit, limit: lim };
        } catch (e) {
            console.log("[productService] getProductsPage failed", e);
            handleApiError(e, "Products");
            return { list: [], total: 0, page: 1, totalPages: 1, nextHit: false, limit };
        }
    }

    async addProduct(payload: Record<string, unknown>): Promise<unknown> {
        try {
            const { data } = await api.post(ENDPOINTS.PRODUCTS.CREATE_PRODUCT, payload);
            return data?.data ?? data;
        } catch (e) {
            console.log("[productService] addProduct failed", e);
            handleApiError(e, "Add Product");
            throw e;
        }
    }

    async generateProduct(payload: Record<string, unknown>): Promise<unknown> {
        try {
            const { data } = await api.post(ENDPOINTS.PRODUCTS.GENERATE, payload);
            return data?.data ?? data;
        } catch (e) {
            console.log("[productService] generateProduct failed", e);
            handleApiError(e, "Generate Product");
            throw e;
        }
    }

    async removeProduct(productId: string): Promise<unknown> {
        try {
            const { data } = await api.delete(ENDPOINTS.PRODUCTS.REMOVE(productId));
            return data?.data ?? data;
        } catch (e) {
            handleApiError(e, "Delete Product");
            throw e;
        }
    }

    async duplicateProduct(productId: string): Promise<unknown> {
        try {
            const { data } = await api.post(ENDPOINTS.PRODUCTS.DUPLICATE(productId));
            return data?.data ?? data;
        } catch (e) {
            handleApiError(e, "Duplicate Product");
            throw e;
        }
    }

    async createNewProductVersion(productId: string): Promise<unknown> {
        try {
            const { data } = await api.post(ENDPOINTS.PRODUCTS.NEW_VERSION(productId));
            return data?.data ?? data;
        } catch (e) {
            handleApiError(e, "New Version");
            throw e;
        }
    }
}

export const productService = new ProductService();
