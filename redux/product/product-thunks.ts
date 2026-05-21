// Product thunks — drive catalog fetching, detail loads, and the lazy Add Product dropdown loads.
import { createAsyncThunk } from "@reduxjs/toolkit";
import type { IProduct } from "@/interfaces/product";
import type {
    AddPanelIngredientSearchPayload,
    CategoryBundleThunkPayload,
    ProductAddPanelState,
    ProductApiThunkConfig,
    ProductBrandListPayload,
    ProductsPageResponse,
    SelectOption,
    SubCategoryBundleThunkPayload,
} from "@/utils/model";
import { productService } from "@/services/product-service";
import { userService } from "@/services/user-service";
import { ingredientService } from "@/services/ingredient-service";
import { extractApiErrorMessage } from "@/utils/commonFunctions";
import { notifyApiSuccessToast } from "@/utils/showToast";
import { notifyProductApiError } from "@/utils/showErrorToast";
import { interceptorHandledNetworkOrTimeout } from "@/utils/service";

/** Surfaces backend error toasts from thunks; skips network/timeout (interceptor already toasted). */
function rejectWithApiToast<Rejected>(
    error: unknown,
    rejectWithValue: (value: string) => Rejected,
): Rejected {
    if (!interceptorHandledNetworkOrTimeout(error)) {
        notifyProductApiError(error);
    }
    return rejectWithValue(extractApiErrorMessage(error) ?? "");
}

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
export const fetchProductCatalog = createAsyncThunk<
    ProductsPageResponse,
    void,
    { rejectValue: unknown }
>(
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
export const fetchProductDetail = createAsyncThunk<
    { id: string; product: IProduct },
    string,
    { rejectValue: string }
>(
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
        addPanel: Pick<
            ProductAddPanelState,
            | "companyTypes"
            | "rootCategories"
            | "categoryBundles"
            | "subCategoryBundles"
            | "brands"
            | "manufacturers"
            | "countries"
            | "currencies"
        >;
    };
};

const selectAddPanel = (state: unknown) => (state as AddPanelRefRoot).product.addPanel;

/** Shared guard: skip the thunk if a previous fetch is in flight or already succeeded. */
const isLoadOrLoaded = (status?: string) =>
    status === "loading" || status === "succeeded";

/** Creates a product from the Add Product panel; success/error toasts use backend messages. */
export const createAddProduct = createAsyncThunk<
    unknown,
    Record<string, unknown>,
    ProductApiThunkConfig
>(
    "product/createAddProduct",
    async (payload: Record<string, unknown>, { rejectWithValue }) => {
        try {
            const response = await productService.addProduct(payload);
            notifyApiSuccessToast(response);
            return response;
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
    },
);

/** Loads company-type options the first time the Add Product company select is opened. */
export const fetchAddProductCompanyTypes = createAsyncThunk<
    SelectOption[],
    void,
    ProductApiThunkConfig
>(
    "product/fetchAddProductCompanyTypes",
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getCompanyTypeList();
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
    },
    {
        condition: (_, { getState }) =>
            !isLoadOrLoaded(selectAddPanel(getState()).companyTypes.status),
    },
);

/** Loads top-level product categories on first focus of the category select. */
export const fetchAddProductRootCategories = createAsyncThunk<
    SelectOption[],
    void,
    ProductApiThunkConfig
>(
    "product/fetchAddProductRootCategories",
    async (_, { rejectWithValue }) => {
        try {
            const names = await productService.getCategoryListRoot();
            return names.map<SelectOption>((name) => ({ value: name, label: name }));
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
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
export const fetchAddProductCategoryBundle = createAsyncThunk<
    CategoryBundleThunkPayload,
    string,
    ProductApiThunkConfig
>(
    "product/fetchAddProductCategoryBundle",
    async (category: string, { rejectWithValue }) => {
        try {
            const bundle = await productService.getCategoryListBundle(category);
            return { category, ...bundle };
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
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
export const fetchAddProductSubCategoryBundle = createAsyncThunk<
    SubCategoryBundleThunkPayload,
    string,
    ProductApiThunkConfig
>(
    "product/fetchAddProductSubCategoryBundle",
    async (subCategory: string, { rejectWithValue }) => {
        try {
            const key = String(subCategory || "").trim();
            const bundle = await productService.getCategoryListBundleBySubCategory(key);
            return { subCategory: key, ...bundle };
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
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
export const fetchAddProductBrands = createAsyncThunk<
    ProductBrandListPayload,
    void,
    ProductApiThunkConfig
>(
    "product/fetchAddProductBrands",
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getProductBrandList();
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
    },
    {
        condition: (_, { getState }) => {
            const state = selectAddPanel(getState()).brands;
            if (state.status === "loading") return false;
            if (state.status === "succeeded" && state.items.length > 0) return false;
            return true;
        },
    },
);

export const fetchAddProductManufacturersLazy = createAsyncThunk<
    SelectOption[],
    void,
    ProductApiThunkConfig
>(
    "product/fetchAddProductManufacturersLazy",
    async (_, { rejectWithValue }) => {
        try {
            return await userService.getManufacturers();
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
    },
    {
        condition: (_, { getState }) =>
            !isLoadOrLoaded(selectAddPanel(getState()).manufacturers.status),
    },
);

export const fetchAddProductCountriesLazy = createAsyncThunk<
    SelectOption[],
    void,
    ProductApiThunkConfig
>(
    "product/fetchAddProductCountriesLazy",
    async (_, { rejectWithValue }) => {
        try {
            const countryRows = await userService.getCountries();
            return countryRows.map<SelectOption>((row) => ({ value: row.id, label: row.name }));
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
    },
    {
        condition: (_, { getState }) =>
            !isLoadOrLoaded(selectAddPanel(getState()).countries.status),
    },
);

export const fetchAddProductCurrenciesLazy = createAsyncThunk<
    SelectOption[],
    void,
    ProductApiThunkConfig
>(
    "product/fetchAddProductCurrenciesLazy",
    async (_, { rejectWithValue }) => {
        try {
            return await productService.getCurrencyOptions();
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
    },
    {
        condition: (_, { getState }) =>
            !isLoadOrLoaded(selectAddPanel(getState()).currencies.status),
    },
);

/** Typeahead search for the ingredient picker; page 1 replaces the list, page >1 appends. */
export const searchAddProductIngredients = createAsyncThunk<
    AddPanelIngredientSearchPayload,
    { term: string; page: number; size?: number },
    ProductApiThunkConfig
>(
    "product/searchAddProductIngredients",
    async (arg: { term: string; page: number; size?: number }, { rejectWithValue }) => {
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
        try {
            const { list, pagination } = await ingredientService.searchIngredients(term, page, size);
            return { term, page, list, pagination };
        } catch (error) {
            return rejectWithApiToast(error, rejectWithValue);
        }
    },
);
