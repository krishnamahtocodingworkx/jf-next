import { api } from "@/services/api";
import { ENDPOINTS } from "@/utils/endpoints";
import { handleApiError } from "@/utils/service";
import type { IProduct } from "@/interfaces/product";
import type {
    ProductsPageParams,
    ProductsPageResponse,
    SelectOption,
} from "@/utils/model";
import {
    normalizeCurrencySelectOptionsFromRows,
    normalizeEntitySelectOptions,
    toFiniteNumber,
    unwrapApiEnvelope,
    unwrapApiListData,
} from "@/utils/commonFunctions";
import {
    extractCategoryBundle,
    normalizeProductListItem,
    parseCategoryListRows,
    pickCategoryListRow,
} from "@/utils/product-helpers";

/** Final fallback option when the currency endpoint returns nothing parseable. */
const DEFAULT_CURRENCY: SelectOption = { value: "USD", label: "USD - US Dollar" };

/** Legacy catalog endpoint kept for tenants still on the pre-v1 API. */
async function fetchLegacyProductsList(
    page: number,
    limit: number,
): Promise<Record<string, unknown>[]> {
    try {
        const { data } = await api.get(ENDPOINTS.PRODUCTS.LIST, { params: { page, limit } });
        const inner = unwrapApiEnvelope(data) as Record<string, unknown> | undefined;
        return unwrapApiListData(inner);
    } catch {
        return [];
    }
}

/** API-call layer for the Products module — payload + row mapping lives in `utils/product-helpers`. */
export const productService = {
    /** Single product detail used by the product `[id]` page; merges API casing variants into `IProduct`. */
    async getProductById(id: string): Promise<IProduct | undefined> {
        try {
            const { data } = await api.get(ENDPOINTS.PRODUCTS.PRODUCT_DETAIL(id));
            const inner = (data?.data ?? data) as Record<string, unknown> | undefined;
            if (!inner || typeof inner !== "object" || Array.isArray(inner)) return undefined;

            const serving = inner["Serving Size"];
            return {
                ...inner,
                id,
                _id: id,
                name: String(inner.name ?? inner.productName ?? "").trim() || "Product",
                nutritionScore: toFiniteNumber(inner.Nutrition ?? inner.nutritionScore) ?? 0,
                sustainabilityScore:
                    toFiniteNumber(inner.Sustainability ?? inner.sustainabilityScore) ?? 0,
                costScore: toFiniteNumber(inner.Cost ?? inner.costScore ?? inner.cost) ?? 0,
                retailCost: toFiniteNumber(inner.retailCost) ?? 0,
                version: inner.version as IProduct["version"],
                ingredients: Array.isArray(inner.ingredients)
                    ? (inner.ingredients as IProduct["ingredients"])
                    : undefined,
                serving_size:
                    typeof serving === "number" || typeof serving === "string" ? serving : undefined,
                date_created: inner.dateCreated ?? inner.date_created,
                fulfilmentDate: inner.fulfilmentDate ?? inner.fulfilment_date,
            } as IProduct;
        } catch (error) {
            handleApiError(error, "Get Product");
            return undefined;
        }
    },

    /** Paginated catalog list with search + filters; falls back to the legacy endpoint when v1 returns empty. */
    async getProductsPage(params: ProductsPageParams): Promise<ProductsPageResponse> {
        const page = params.page ?? 1;
        const limit = params.limit ?? 12;

        // Build the query string only with provided filters so the API can apply defaults.
        const query: Record<string, string | number | boolean> = { page, limit };
        if (params.brandId) query.brand = params.brandId;
        if (typeof params.productStatus === "boolean") {
            query.productStatus = params.productStatus;
            query.active = params.productStatus;
        }
        if (params.category) query.category = params.category;
        if (params.search) query.search = params.search;

        try {
            const { data } = await api.get(ENDPOINTS.PRODUCTS.GET_PRODUCT_LIST, { params: query });
            const inner = unwrapApiEnvelope(data) as Record<string, unknown> | undefined;
            let rows = unwrapApiListData(inner);

            // Fallback: some tenants still serve the legacy `/user/products/` endpoint.
            if (rows.length === 0) {
                rows = await fetchLegacyProductsList(page, limit);
            }

            const list = rows.map((row) => normalizeProductListItem(row));
            const meta = (inner?.pagination ?? inner?.meta ?? inner?.pageInfo ?? {}) as Record<
                string,
                unknown
            >;

            // Defensive coalescing — backends report pagination under several aliases.
            const total =
                toFiniteNumber(
                    inner?.total ?? meta.total ?? meta.count ?? meta.totalCount ?? list.length,
                ) ?? 0;
            const totalPages =
                toFiniteNumber(
                    inner?.totalPages ??
                        meta.pages ??
                        meta.totalPages ??
                        (total > 0 ? Math.max(1, Math.ceil(total / Math.max(1, limit))) : 1),
                ) ?? 1;
            const nextHit = Boolean(
                inner?.nextHit ?? meta.nextHit ?? meta.hasNext ?? meta.next,
            );
            const resolvedLimit =
                toFiniteNumber(inner?.limit ?? meta.size ?? meta.limit ?? limit) || limit;
            const resolvedPage = toFiniteNumber(inner?.page ?? meta.page ?? page) || page;

            return { list, total, page: resolvedPage, totalPages, nextHit, limit: resolvedLimit };
        } catch (error) {
            handleApiError(error, "Products");
            return { list: [], total: 0, page: 1, totalPages: 1, nextHit: false, limit };
        }
    },

    /** Create — used by the Add Product panel. */
    async addProduct(payload: Record<string, unknown>): Promise<unknown> {
        try {
            const { data } = await api.post(ENDPOINTS.PRODUCTS.CREATE_PRODUCT, payload);
            return data?.data ?? data;
        } catch (error) {
            handleApiError(error, "Add Product");
            throw error;
        }
    },

    /** AI-generated product recommendation (Generate module). */
    async generateProduct(payload: Record<string, unknown>): Promise<unknown> {
        try {
            const { data } = await api.post(ENDPOINTS.PRODUCTS.GENERATE, payload);
            return data?.data ?? data;
        } catch (error) {
            handleApiError(error, "Generate Product");
            throw error;
        }
    },

    /** Delete a product from the catalog. */
    async removeProduct(productId: string): Promise<unknown> {
        try {
            const { data } = await api.delete(ENDPOINTS.PRODUCTS.REMOVE(productId));
            return data?.data ?? data;
        } catch (error) {
            handleApiError(error, "Delete Product");
            throw error;
        }
    },

    /** Clone an existing product as the starting point for a new entry. */
    async duplicateProduct(productId: string): Promise<unknown> {
        try {
            const { data } = await api.post(ENDPOINTS.PRODUCTS.DUPLICATE(productId));
            return data?.data ?? data;
        } catch (error) {
            handleApiError(error, "Duplicate Product");
            throw error;
        }
    },

    /** Increment the product's version (used when iterating on formulation). */
    async createNewProductVersion(productId: string): Promise<unknown> {
        try {
            const { data } = await api.post(ENDPOINTS.PRODUCTS.NEW_VERSION(productId));
            return data?.data ?? data;
        } catch (error) {
            handleApiError(error, "New Version");
            throw error;
        }
    },

    /** Top-level category names (e.g. "Beverages", "Food", "Supplements") for the Add Product category select. */
    async getCategoryListRoot(): Promise<string[]> {
        try {
            const { data } = await api.get(ENDPOINTS.PRODUCT_TYPE.CATEGORY_LIST);
            const rows = parseCategoryListRows(data);
            const names = rows.map((row) => String(row.category ?? "").trim()).filter(Boolean);
            return [...new Set(names)];
        } catch (error) {
            handleApiError(error, "Product category list");
            return [];
        }
    },

    /** Drills into a specific category to load its product types + subcategories. */
    async getCategoryListBundle(category: string): Promise<{
        productTypes: string[];
        subCategories: string[];
    }> {
        const value = String(category || "").trim();
        if (!value) return { productTypes: [], subCategories: [] };
        try {
            const { data } = await api.get(ENDPOINTS.PRODUCT_TYPE.CATEGORY_LIST, {
                params: { category: value },
            });
            const rows = parseCategoryListRows(data);
            const row = pickCategoryListRow(rows, { category: value });
            return extractCategoryBundle(row);
        } catch (error) {
            handleApiError(error, "Product category list");
            return { productTypes: [], subCategories: [] };
        }
    },

    /** Same endpoint but filtered by subcategory — used when the user picks a subcategory first. */
    async getCategoryListBundleBySubCategory(subCategory: string): Promise<{
        productTypes: string[];
        subCategories: string[];
    }> {
        const value = String(subCategory || "").trim();
        if (!value) return { productTypes: [], subCategories: [] };
        try {
            const { data } = await api.get(ENDPOINTS.PRODUCT_TYPE.CATEGORY_LIST, {
                params: { subCategory: value },
            });
            const rows = parseCategoryListRows(data);
            const row = pickCategoryListRow(rows, { subCategory: value });
            return extractCategoryBundle(row);
        } catch (error) {
            handleApiError(error, "Product category list");
            return { productTypes: [], subCategories: [] };
        }
    },

    /** Currency options for the Add Product price section; always returns at least USD. */
    async getCurrencyOptions(): Promise<SelectOption[]> {
        try {
            const { data } = await api.get(ENDPOINTS.CURRENCY.LIST);
            const rows = unwrapApiListData(data?.data ?? data);
            const fromCurrencyShape = normalizeCurrencySelectOptionsFromRows(rows);
            const options =
                fromCurrencyShape.length > 0 ? fromCurrencyShape : normalizeEntitySelectOptions(rows);
            return options.length ? options : [DEFAULT_CURRENCY];
        } catch {
            return [DEFAULT_CURRENCY];
        }
    },
};
