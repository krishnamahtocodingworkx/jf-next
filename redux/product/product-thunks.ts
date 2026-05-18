// Product thunks — drive catalog fetching, detail loads, and the lazy Add Product dropdown loads.
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { SelectOption } from "@/utils/model";
import { productService } from "@/services/product-service";
import { userService } from "@/services/user-service";
import { ingredientService } from "@/services/ingredient-service";

/** Narrow shape of `state` this thunk reads from `getState` — keeps the slice/thunks loosely coupled. */
type ProductCatalogSlice = {
    catalog: {
        page: number;
        limit: number;
        search: string;
        filterA: "all" | "active" | "concept" | "discontinued";
    };
};

/** Re-fetches the catalog page; reads current filters/pagination directly from Redux state. */
export const fetchProductCatalog = createAsyncThunk(
    "product/fetchCatalog",
    async (_, { getState, rejectWithValue }) => {
        const { catalog } = (getState() as { product: ProductCatalogSlice }).product;
        // Map the UI status pill to the boolean param the backend expects.
        const productStatus =
            catalog.filterA === "active"
                ? true
                : catalog.filterA === "concept"
                  ? false
                  : undefined;
        try {
            return await productService.getProductsPage({
                page: catalog.page,
                limit: catalog.limit,
                search: catalog.search.trim() || undefined,
                productStatus,
            });
        } catch (error) {
            return rejectWithValue(error);
        }
    },
);

/** Loads a single product for the `[id]` detail page; rejects `NOT_FOUND` so the page can show a friendly 404. */
export const fetchProductDetail = createAsyncThunk(
    "product/fetchDetail",
    async (id: string, { rejectWithValue }) => {
        const product = await productService.getProductById(id);
        if (!product) return rejectWithValue("NOT_FOUND");
        return { id, product };
    },
);

/** Subset of the root state read by the lazy add-panel thunks (kept local to avoid circular imports). */
type AddPanelRefRoot = {
    product: {
        addPanel: {
            companyTypes: { status: string };
            rootCategories: { status: string; items: unknown[] };
            categoryBundles: Record<string, { status?: string } | undefined>;
            subCategoryBundles: Record<string, { status?: string } | undefined>;
            brands: {
                status: string;
                items: SelectOption[];
                enrichment: string;
                companyByBrandId: Record<string, string>;
            };
            manufacturers: { status: string };
            countries: { status: string };
            currencies: { status: string };
        };
    };
};

const selectAddPanel = (state: unknown) => (state as AddPanelRefRoot).product.addPanel;

/** Shared guard: skip the thunk if a previous fetch is in flight or already succeeded. */
const isLoadOrLoaded = (status?: string) =>
    status === "loading" || status === "succeeded";

/** Loads company-type options the first time the Add Product company select is opened. */
export const fetchAddProductCompanyTypes = createAsyncThunk(
    "product/fetchAddProductCompanyTypes",
    () => userService.getCompanyTypeList(),
    {
        condition: (_, { getState }) =>
            !isLoadOrLoaded(selectAddPanel(getState()).companyTypes.status),
    },
);

/** Loads top-level product categories on first focus of the category select. */
export const fetchAddProductRootCategories = createAsyncThunk(
    "product/fetchAddProductRootCategories",
    async () => {
        const names = await productService.getCategoryListRoot();
        return names.map<SelectOption>((name) => ({ value: name, label: name }));
    },
    {
        condition: (_, { getState }) => {
            const state = selectAddPanel(getState()).rootCategories;
            if (state.status === "loading") return false;
            if (state.status === "succeeded" && state.items.length > 0) return false;
            return true;
        },
    },
);

/** Drills into the chosen category to populate the product-type + subcategory selects. */
export const fetchAddProductCategoryBundle = createAsyncThunk(
    "product/fetchAddProductCategoryBundle",
    async (category: string) => {
        const bundle = await productService.getCategoryListBundle(category);
        return { category, ...bundle };
    },
    {
        condition: (category, { getState }) => {
            const key = String(category || "").trim();
            if (!key) return false;
            return !isLoadOrLoaded(selectAddPanel(getState()).categoryBundles[key]?.status);
        },
    },
);

/** Same as above but keyed by subcategory (used when the user picks a subcategory first). */
export const fetchAddProductSubCategoryBundle = createAsyncThunk(
    "product/fetchAddProductSubCategoryBundle",
    async (subCategory: string) => {
        const key = String(subCategory || "").trim();
        const bundle = await productService.getCategoryListBundleBySubCategory(key);
        return { subCategory: key, ...bundle };
    },
    {
        condition: (subCategory, { getState }) => {
            const key = String(subCategory || "").trim();
            if (!key) return false;
            return !isLoadOrLoaded(selectAddPanel(getState()).subCategoryBundles[key]?.status);
        },
    },
);

/** Loads brands + the brand→company lookup table on first focus of the brand select. */
export const fetchAddProductBrands = createAsyncThunk(
    "product/fetchAddProductBrands",
    () => userService.getProductBrandList(),
    {
        condition: (_, { getState }) => {
            const state = selectAddPanel(getState()).brands;
            if (state.status === "loading") return false;
            if (state.status === "succeeded" && state.items.length > 0) return false;
            return true;
        },
    },
);

export const fetchAddProductManufacturersLazy = createAsyncThunk(
    "product/fetchAddProductManufacturersLazy",
    () => userService.getManufacturers(),
    {
        condition: (_, { getState }) =>
            !isLoadOrLoaded(selectAddPanel(getState()).manufacturers.status),
    },
);

export const fetchAddProductCountriesLazy = createAsyncThunk(
    "product/fetchAddProductCountriesLazy",
    async () => {
        const countryRows = await userService.getCountries();
        return countryRows.map<SelectOption>((row) => ({ value: row.id, label: row.name }));
    },
    {
        condition: (_, { getState }) =>
            !isLoadOrLoaded(selectAddPanel(getState()).countries.status),
    },
);

export const fetchAddProductCurrenciesLazy = createAsyncThunk(
    "product/fetchAddProductCurrenciesLazy",
    () => productService.getCurrencyOptions(),
    {
        condition: (_, { getState }) =>
            !isLoadOrLoaded(selectAddPanel(getState()).currencies.status),
    },
);

/** Typeahead search for the ingredient picker; page 1 replaces the list, page >1 appends. */
export const searchAddProductIngredients = createAsyncThunk(
    "product/searchAddProductIngredients",
    async (arg: { term: string; page: number; size?: number }) => {
        const term = arg.term.trim();
        const page = Math.max(1, arg.page);
        const size = Math.max(1, arg.size ?? 20);
        // Empty-term short-circuit lets the reducer reset to its initial state cleanly.
        if (!term) {
            return {
                term: "",
                page: 1,
                list: [] as Awaited<ReturnType<typeof ingredientService.searchIngredients>>["list"],
                pagination: { page: 1, pages: 1, size, total: 0 },
            };
        }
        const { list, pagination } = await ingredientService.searchIngredients(term, page, size);
        return { term, page, list, pagination };
    },
);
