import { api } from "@/services/api";
import { ENDPOINTS } from "@/utils/endpoints";
import { handleApiError } from "@/utils/service";
import type { IProduct } from "@/interfaces/product";
import type { SelectOption } from "@/utils/model";
import { isValidMongoObjectId, unwrapApiListData, normalizeEntitySelectOptions, normalizeCurrencySelectOptionsFromRows } from "@/utils/commonFunctions";

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
    /** Same fallback as JourneyFoodsDashboardUpgraded `buildCreateProductPayload`. */
    const SAMPLE_BRAND_ID = "69afd4d0651a43cf6774a537";
    const brandId = isValidMongoObjectId(brandIdRaw) ? brandIdRaw : SAMPLE_BRAND_ID;
    const manufacturerId = isValidMongoObjectId(mfg) ? mfg : null;
    const companyIdRaw = values.company_id
        ? String(values.company_id)
        : String(
              (profile?.company as { id?: string; _id?: string } | undefined)?.id ||
                  (profile?.company as { id?: string; _id?: string } | undefined)?._id ||
                  "",
          );
    const companyId = isValidMongoObjectId(companyIdRaw) ? companyIdRaw : "";
    console.log("[productService] create payload id validation", {
        brandProvided: Boolean(brandIdRaw),
        brandAccepted: Boolean(brandId),
        brandFallbackUsed: !isValidMongoObjectId(brandIdRaw),
        manufacturerProvided: Boolean(mfg),
        manufacturerAccepted: Boolean(manufacturerId),
        companyProvided: Boolean(companyIdRaw),
        companyAccepted: Boolean(companyId),
    });
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
        const candidates = [
            obj.list,
            obj.items,
            obj.results,
            obj.rows,
            obj.data,
            obj.products,
            obj.productList,
            obj.content,
            obj.records,
        ];
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
            const { data } = await api.get(ENDPOINTS.PRODUCTS.PRODUCT_DETAIL(id));
            const inner = (data?.data ?? data) as Record<string, unknown> | undefined;
            if (!inner || typeof inner !== "object" || Array.isArray(inner)) {
                console.log("[productService] getProductById empty envelope", id);
                return undefined;
            }
            const serving = inner["Serving Size"];
            const merged = {
                ...inner,
                id,
                _id: id,
                name: String(inner.name ?? inner.productName ?? "").trim() || "Product",
                nutritionScore: this.toNum(inner.Nutrition ?? inner.nutritionScore),
                sustainabilityScore: this.toNum(inner.Sustainability ?? inner.sustainabilityScore),
                costScore: this.toNum(inner.Cost ?? inner.costScore ?? inner.cost),
                retailCost: this.toNum(inner.retailCost),
                version: inner.version as IProduct["version"],
                ingredients: Array.isArray(inner.ingredients)
                    ? (inner.ingredients as IProduct["ingredients"])
                    : undefined,
                serving_size: typeof serving === "number" || typeof serving === "string" ? serving : undefined,
                date_created: inner.dateCreated ?? inner.date_created,
                fulfilmentDate: inner.fulfilmentDate ?? inner.fulfilment_date,
            } as IProduct;
            console.log("[productService] getProductById", id, true);
            return merged;
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
            let rows = this.unwrapList(inner);
            if (rows.length === 0) {
                const loose = unwrapApiListData((data as Record<string, unknown> | undefined)?.data ?? data ?? inner);
                if (loose.length) rows = loose;
            }
            let list = rows.map((r) => normalizeProductListItem(r as Record<string, unknown>));

            if (list.length === 0) {
                try {
                    const { data: legacy } = await api.get(ENDPOINTS.PRODUCTS.LIST, { params: { page, limit } });
                    const innerL = this.unwrapAny(legacy) as Record<string, unknown> | undefined;
                    let rowsL = this.unwrapList(innerL);
                    if (rowsL.length === 0) {
                        const looseL = unwrapApiListData(
                            (legacy as Record<string, unknown> | undefined)?.data ?? legacy ?? innerL,
                        );
                        if (looseL.length) rowsL = looseL;
                    }
                    if (rowsL.length > 0) {
                        list = rowsL.map((r) => normalizeProductListItem(r as Record<string, unknown>));
                        console.log("[productService] getProductsPage using /user/products/ fallback", list.length);
                    }
                } catch (fallbackErr) {
                    console.log("[productService] getProductsPage user products fallback skipped", fallbackErr);
                }
            }

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

    /** `GET /api/v1/productType/category-list?category=Beverages` */
    async getCategoryListBundle(category: string): Promise<{
        productTypes: string[];
        subCategories: string[];
    }> {
        const cat = String(category || "").trim();
        if (!cat) return { productTypes: [], subCategories: [] };
        try {
            const { data } = await api.get(ENDPOINTS.PRODUCT_TYPE.CATEGORY_LIST, {
                params: { category: cat },
            });
            const body = (data ?? {}) as Record<string, unknown>;
            let list: Record<string, unknown>[] = [];
            if (Array.isArray(body.data)) {
                list = body.data as Record<string, unknown>[];
            } else {
                list = unwrapApiListData(body.data ?? body) as Record<string, unknown>[];
            }
            const first =
                (list.find((row) => String(row.category ?? "") === cat) as Record<string, unknown> | undefined) ??
                (list[0] as Record<string, unknown> | undefined);
            const productTypes = Array.isArray(first?.productTypes)
                ? (first.productTypes as unknown[]).map((x) => String(x))
                : [];
            const subCategories = Array.isArray(first?.subCategories)
                ? (first.subCategories as unknown[]).map((x) => String(x))
                : [];
            console.log("[productService] getCategoryListBundle", cat, {
                productTypes: productTypes.length,
                subCategories: subCategories.length,
            });
            return { productTypes, subCategories };
        } catch (e) {
            console.log("[productService] getCategoryListBundle failed", cat, e);
            handleApiError(e, "Product category list");
            return { productTypes: [], subCategories: [] };
        }
    }

    async getCurrencyOptions(): Promise<SelectOption[]> {
        try {
            const { data } = await api.get(ENDPOINTS.CURRENCY.LIST);
            const rows = unwrapApiListData(data?.data ?? data);
            const fromCurrencyShape = normalizeCurrencySelectOptionsFromRows(rows);
            const opts =
                fromCurrencyShape.length > 0 ? fromCurrencyShape : normalizeEntitySelectOptions(rows);
            console.log("[productService] getCurrencyOptions", opts.length);
            return opts.length ? opts : [{ value: "USD", label: "USD - US Dollar" }];
        } catch (e) {
            console.log("[productService] getCurrencyOptions failed", e);
            return [{ value: "USD", label: "USD - US Dollar" }];
        }
    }
}

export const productService = new ProductService();
