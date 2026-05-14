import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SelectOption } from "@/utils/model";
import { productService } from "@/services/product-service";
import { userService } from "@/services/user-service";
import { ingredientService } from "@/services/ingredient-service";
import { normalizeBrandManufacturerRowToOption } from "@/utils/commonFunctions";

type ProductCatalogSlice = {
    catalog: {
        page: number;
        limit: number;
        search: string;
        filterA: "all" | "active" | "concept" | "discontinued";
    };
};

export const fetchProductCatalog = createAsyncThunk(
    "product/fetchCatalog",
    async (_, { getState, rejectWithValue }) => {
        const state = getState() as { product: ProductCatalogSlice };
        const { catalog } = state.product;
        try {
            const productStatus =
                catalog.filterA === "active"
                    ? true
                    : catalog.filterA === "concept"
                      ? false
                      : undefined;
            const res = await productService.getProductsPage({
                page: catalog.page,
                limit: catalog.limit,
                search: catalog.search.trim() || undefined,
                productStatus,
            });
            console.log("[product] catalog fetched", res.page, "items", res.list.length, "total", res.total);
            return res;
        } catch (e) {
            console.log("[product] catalog fetch failed", e);
            return rejectWithValue(e);
        }
    },
);

export const fetchProductDetail = createAsyncThunk(
    "product/fetchDetail",
    async (id: string, { rejectWithValue }) => {
        const product = await productService.getProductById(id);
        if (!product) {
            console.log("[product] detail not found", id);
            return rejectWithValue("NOT_FOUND");
        }
        console.log("[product] detail fetched", id, true);
        return { id, product };
    },
);

/** Narrow slice without importing `store` (avoids circular slice → thunks → store). */
type AddPanelRefRoot = {
    product: {
        addPanel: {
            companyTypes: { status: string };
            categoryBundles: Record<string, { status?: string } | undefined>;
            brands: {
                status: string;
                items: SelectOption[];
                enrichment: string;
                pendingCompanyId: string | null;
            };
            manufacturers: { status: string };
            countries: { status: string };
            currencies: { status: string };
        };
    };
};

const selectAddPanel = (s: unknown) => (s as AddPanelRefRoot).product.addPanel;

/** Company types — opened from Select Company (`onFocus`). */
export const fetchAddProductCompanyTypes = createAsyncThunk(
    "product/fetchAddProductCompanyTypes",
    async () => {
        const items = await userService.getCompanyTypeList();
        console.log("[product] addPanel company types loaded", items.length);
        return items;
    },
    {
        condition: (_, { getState }) => {
            const s = selectAddPanel(getState()).companyTypes;
            if (s.status === "loading") return false;
            if (s.status === "succeeded") return false;
            return true;
        },
    },
);

/** Category / product type / subcategory bundle — opened from those selects (`onFocus`). */
export const fetchAddProductCategoryBundle = createAsyncThunk(
    "product/fetchAddProductCategoryBundle",
    async (category: string) => {
        const bundle = await productService.getCategoryListBundle(category);
        console.log("[product] addPanel category bundle", category, bundle);
        return { category, ...bundle };
    },
    {
        condition: (category, { getState }) => {
            const key = String(category || "").trim();
            if (!key) return false;
            const row = selectAddPanel(getState()).categoryBundles[key];
            if (row?.status === "loading") return false;
            if (row?.status === "succeeded") return false;
            return true;
        },
    },
);

/** Brand for Add Product — `GET .../productBrand/get-product-brand/:companyId` (company from company-type list). */
export const fetchAddProductBrandsByCompanyId = createAsyncThunk(
    "product/fetchAddProductBrandsByCompanyId",
    async (companyId: string) => {
        const clean = String(companyId || "").trim();
        if (!clean) return [] as SelectOption[];
        const row = await userService.getProductBrandByCompanyId(clean);
        const opt = row ? normalizeBrandManufacturerRowToOption(row) : null;
        console.log("[product] addPanel brands by company", clean, Boolean(opt));
        return opt ? [opt] : ([] as SelectOption[]);
    },
    {
        condition: (companyId) => Boolean(String(companyId || "").trim()),
    },
);

export const fetchAddProductManufacturersLazy = createAsyncThunk(
    "product/fetchAddProductManufacturersLazy",
    async () => {
        const items = await userService.getManufacturers();
        console.log("[product] addPanel manufacturers", items.length);
        return items;
    },
    {
        condition: (_, { getState }) => {
            const s = selectAddPanel(getState()).manufacturers;
            if (s.status === "loading") return false;
            if (s.status === "succeeded") return false;
            return true;
        },
    },
);

export const fetchAddProductCountriesLazy = createAsyncThunk(
    "product/fetchAddProductCountriesLazy",
    async () => {
        const countryRows = await userService.getCountries();
        const items = countryRows.map((r) => ({ value: r.id, label: r.name }));
        console.log("[product] addPanel countries", items.length);
        return items;
    },
    {
        condition: (_, { getState }) => {
            const s = selectAddPanel(getState()).countries;
            if (s.status === "loading") return false;
            if (s.status === "succeeded") return false;
            return true;
        },
    },
);

export const fetchAddProductCurrenciesLazy = createAsyncThunk(
    "product/fetchAddProductCurrenciesLazy",
    async () => {
        const items = await productService.getCurrencyOptions();
        console.log("[product] addPanel currencies", items.length);
        return items;
    },
    {
        condition: (_, { getState }) => {
            const s = selectAddPanel(getState()).currencies;
            if (s.status === "loading") return false;
            if (s.status === "succeeded") return false;
            return true;
        },
    },
);

export const searchAddProductIngredients = createAsyncThunk(
    "product/searchAddProductIngredients",
    async (arg: { term: string; page: number; size?: number }) => {
        const term = arg.term.trim();
        const page = Math.max(1, arg.page);
        const size = Math.max(1, arg.size ?? 20);
        if (!term) {
            return {
                term: "",
                page: 1,
                list: [] as Awaited<ReturnType<typeof ingredientService.searchIngredients>>["list"],
                pagination: { page: 1, pages: 1, size, total: 0 },
            };
        }
        const res = await ingredientService.searchIngredients(term, page, size);
        console.log("[product] addPanel ingredient search", { term, page, count: res.list.length });
        return { term, page, list: res.list, pagination: res.pagination };
    },
);
