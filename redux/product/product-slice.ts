import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type { IProduct, IProductCatalogRow } from "@/interfaces/product";
import type { SelectOption } from "@/utils/model";
import type { ISupplierIngredient, IIngredientPagination } from "@/interfaces/ingredient";
import { apiProductToCatalogRow } from "@/utils/commonFunctions";
import {
    fetchProductCatalog,
    fetchProductDetail,
    fetchAddProductCompanyTypes,
    fetchAddProductRootCategories,
    fetchAddProductCategoryBundle,
    fetchAddProductSubCategoryBundle,
    fetchAddProductBrands,
    fetchAddProductManufacturersLazy,
    fetchAddProductCountriesLazy,
    fetchAddProductCurrenciesLazy,
    searchAddProductIngredients,
} from "@/redux/product/product-thunks";

export type CatalogFilterA = "all" | "active" | "concept" | "discontinued";
export type CatalogFilterB = "all" | "bars" | "beverages" | "powders" | "snacks" | "supplements";

export type AddPanelListField = {
    status: "idle" | "loading" | "succeeded" | "failed";
    items: SelectOption[];
};

export type AddPanelCategoryBundle = {
    status: "idle" | "loading" | "succeeded" | "failed";
    productTypes: string[];
    subCategories: string[];
};

export type AddPanelIngredientSearch = {
    status: "idle" | "loading" | "succeeded" | "failed";
    term: string;
    page: number;
    list: ISupplierIngredient[];
    pagination: IIngredientPagination;
};

export type AddPanelBrandsState = {
    status: "idle" | "loading" | "succeeded" | "failed";
    items: SelectOption[];
    enrichment: "idle" | "loading" | "done";
    /** Brand id → company id from list API (for `company_id` on submit). */
    companyByBrandId: Record<string, string>;
};

export type ProductAddPanelState = {
    companyTypes: AddPanelListField;
    rootCategories: AddPanelListField;
    categoryBundles: Record<string, AddPanelCategoryBundle>;
    subCategoryBundles: Record<string, AddPanelCategoryBundle>;
    brands: AddPanelBrandsState;
    manufacturers: AddPanelListField;
    countries: AddPanelListField;
    currencies: AddPanelListField;
    ingredients: AddPanelIngredientSearch;
};

const emptyListField = (): AddPanelListField => ({
    status: "idle",
    items: [],
});

const emptyBrandsState = (): AddPanelBrandsState => ({
    status: "idle",
    items: [],
    enrichment: "idle",
    companyByBrandId: {},
});

const initialAddPanel = (): ProductAddPanelState => ({
    companyTypes: emptyListField(),
    rootCategories: emptyListField(),
    categoryBundles: {},
    subCategoryBundles: {},
    brands: emptyBrandsState(),
    manufacturers: emptyListField(),
    countries: emptyListField(),
    currencies: emptyListField(),
    ingredients: {
        status: "idle",
        term: "",
        page: 1,
        list: [],
        pagination: { page: 1, pages: 1, size: 20, total: 0 },
    },
});

export type ProductState = {
    catalog: {
        list: Record<string, unknown>[];
        total: number;
        page: number;
        totalPages: number;
        nextHit: boolean;
        limit: number;
        loadStatus: "idle" | "loading" | "succeeded" | "failed";
        search: string;
        filterA: CatalogFilterA;
        filterB: CatalogFilterB;
        displayMode: "grid" | "list";
    };
    detail: {
        id: string | null;
        data: IProduct | undefined;
        status: "idle" | "loading" | "succeeded" | "failed";
    };
    addPanel: ProductAddPanelState;
};

const initialState: ProductState = {
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
    addPanel: initialAddPanel(),
};

function filterBMatches(name: string, filterB: CatalogFilterB): boolean {
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

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        setCatalogSearchApplied: (state, action: PayloadAction<string>) => {
            state.catalog.search = action.payload;
            state.catalog.page = 1;
        },
        setCatalogFilterA: (state, action: PayloadAction<CatalogFilterA>) => {
            state.catalog.filterA = action.payload;
            state.catalog.page = 1;
        },
        setCatalogFilterB: (state, action: PayloadAction<CatalogFilterB>) => {
            state.catalog.filterB = action.payload;
            state.catalog.page = 1;
        },
        setCatalogPage: (state, action: PayloadAction<number>) => {
            state.catalog.page = Math.max(1, action.payload);
        },
        setCatalogLimit: (state, action: PayloadAction<number>) => {
            const allowed = [10, 20, 50, 100] as const;
            const next = allowed.includes(action.payload as (typeof allowed)[number])
                ? action.payload
                : state.catalog.limit;
            state.catalog.limit = next;
            state.catalog.page = 1;
        },
        setCatalogDisplayMode: (state, action: PayloadAction<"grid" | "list">) => {
            state.catalog.displayMode = action.payload;
        },
        clearProductDetail: (state) => {
            state.detail = { id: null, data: undefined, status: "idle" };
        },
        resetAddProductPanel: (state) => {
            state.addPanel = initialAddPanel();
            console.log("[product] addPanel reset");
        },
        clearAddProductIngredientSearch: (state) => {
            state.addPanel.ingredients = {
                status: "idle",
                term: "",
                page: 1,
                list: [],
                pagination: { page: 1, pages: 1, size: 20, total: 0 },
            };
        },
        clearAddProductBrandOptions: (state) => {
            state.addPanel.brands.items = [];
            state.addPanel.brands.status = "idle";
            state.addPanel.brands.enrichment = "idle";
            state.addPanel.brands.companyByBrandId = {};
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProductCatalog.pending, (state) => {
                state.catalog.loadStatus = "loading";
            })
            .addCase(fetchProductCatalog.fulfilled, (state, action) => {
                state.catalog.loadStatus = "succeeded";
                state.catalog.list = action.payload.list;
                state.catalog.total = action.payload.total;
                state.catalog.page = action.payload.page;
                state.catalog.totalPages = action.payload.totalPages;
                state.catalog.nextHit = action.payload.nextHit;
                state.catalog.limit = action.payload.limit;
            })
            .addCase(fetchProductCatalog.rejected, (state) => {
                state.catalog.loadStatus = "failed";
            })
            .addCase(fetchProductDetail.pending, (state, action) => {
                state.detail.status = "loading";
                state.detail.id = action.meta.arg;
            })
            .addCase(fetchProductDetail.fulfilled, (state, action) => {
                state.detail.status = "succeeded";
                state.detail.data = action.payload.product;
                state.detail.id = action.payload.id;
            })
            .addCase(fetchProductDetail.rejected, (state) => {
                state.detail.status = "failed";
                state.detail.data = undefined;
            })
            .addCase(fetchAddProductCompanyTypes.pending, (state) => {
                state.addPanel.companyTypes.status = "loading";
            })
            .addCase(fetchAddProductCompanyTypes.fulfilled, (state, action) => {
                state.addPanel.companyTypes.status = "succeeded";
                state.addPanel.companyTypes.items = action.payload;
            })
            .addCase(fetchAddProductCompanyTypes.rejected, (state) => {
                state.addPanel.companyTypes.status = "failed";
            })
            .addCase(fetchAddProductRootCategories.pending, (state) => {
                state.addPanel.rootCategories.status = "loading";
            })
            .addCase(fetchAddProductRootCategories.fulfilled, (state, action) => {
                state.addPanel.rootCategories.status = "succeeded";
                state.addPanel.rootCategories.items = action.payload;
            })
            .addCase(fetchAddProductRootCategories.rejected, (state) => {
                state.addPanel.rootCategories.status = "failed";
            })
            .addCase(fetchAddProductCategoryBundle.pending, (state, action) => {
                const cat = action.meta.arg;
                const prev = state.addPanel.categoryBundles[cat] ?? {
                    status: "idle" as const,
                    productTypes: [],
                    subCategories: [],
                };
                state.addPanel.categoryBundles[cat] = {
                    ...prev,
                    status: "loading",
                };
            })
            .addCase(fetchAddProductCategoryBundle.fulfilled, (state, action) => {
                const { category, productTypes, subCategories } = action.payload;
                state.addPanel.categoryBundles[category] = {
                    status: "succeeded",
                    productTypes,
                    subCategories,
                };
            })
            .addCase(fetchAddProductCategoryBundle.rejected, (state, action) => {
                const cat = action.meta.arg;
                state.addPanel.categoryBundles[cat] = {
                    status: "failed",
                    productTypes: [],
                    subCategories: [],
                };
            })
            .addCase(fetchAddProductSubCategoryBundle.pending, (state, action) => {
                const sub = String(action.meta.arg || "").trim();
                const prev = state.addPanel.subCategoryBundles[sub] ?? {
                    status: "idle" as const,
                    productTypes: [],
                    subCategories: [],
                };
                state.addPanel.subCategoryBundles[sub] = {
                    ...prev,
                    status: "loading",
                };
            })
            .addCase(fetchAddProductSubCategoryBundle.fulfilled, (state, action) => {
                const { subCategory, productTypes, subCategories } = action.payload;
                state.addPanel.subCategoryBundles[subCategory] = {
                    status: "succeeded",
                    productTypes,
                    subCategories,
                };
            })
            .addCase(fetchAddProductSubCategoryBundle.rejected, (state, action) => {
                const sub = String(action.meta.arg || "").trim();
                state.addPanel.subCategoryBundles[sub] = {
                    status: "failed",
                    productTypes: [],
                    subCategories: [],
                };
            })
            .addCase(fetchAddProductBrands.pending, (state) => {
                state.addPanel.brands.status = "loading";
                state.addPanel.brands.enrichment = "loading";
                state.addPanel.brands.items = [];
                state.addPanel.brands.companyByBrandId = {};
            })
            .addCase(fetchAddProductBrands.fulfilled, (state, action) => {
                state.addPanel.brands.items = action.payload.items;
                state.addPanel.brands.companyByBrandId = action.payload.companyByBrandId;
                state.addPanel.brands.status = "succeeded";
                state.addPanel.brands.enrichment = "done";
            })
            .addCase(fetchAddProductBrands.rejected, (state) => {
                state.addPanel.brands.items = [];
                state.addPanel.brands.companyByBrandId = {};
                state.addPanel.brands.status = "failed";
                state.addPanel.brands.enrichment = "done";
            })
            .addCase(fetchAddProductManufacturersLazy.pending, (state) => {
                state.addPanel.manufacturers.status = "loading";
            })
            .addCase(fetchAddProductManufacturersLazy.fulfilled, (state, action) => {
                state.addPanel.manufacturers.status = "succeeded";
                state.addPanel.manufacturers.items = action.payload;
            })
            .addCase(fetchAddProductManufacturersLazy.rejected, (state) => {
                state.addPanel.manufacturers.status = "failed";
            })
            .addCase(fetchAddProductCountriesLazy.pending, (state) => {
                state.addPanel.countries.status = "loading";
            })
            .addCase(fetchAddProductCountriesLazy.fulfilled, (state, action) => {
                state.addPanel.countries.status = "succeeded";
                state.addPanel.countries.items = action.payload;
            })
            .addCase(fetchAddProductCountriesLazy.rejected, (state) => {
                state.addPanel.countries.status = "failed";
            })
            .addCase(fetchAddProductCurrenciesLazy.pending, (state) => {
                state.addPanel.currencies.status = "loading";
            })
            .addCase(fetchAddProductCurrenciesLazy.fulfilled, (state, action) => {
                state.addPanel.currencies.status = "succeeded";
                state.addPanel.currencies.items = action.payload;
            })
            .addCase(fetchAddProductCurrenciesLazy.rejected, (state) => {
                state.addPanel.currencies.status = "failed";
            })
            .addCase(searchAddProductIngredients.pending, (state) => {
                state.addPanel.ingredients.status = "loading";
            })
            .addCase(searchAddProductIngredients.fulfilled, (state, action) => {
                const { term, page, list, pagination } = action.payload;
                state.addPanel.ingredients.status = "succeeded";
                state.addPanel.ingredients.term = term;
                state.addPanel.ingredients.page = page;
                state.addPanel.ingredients.pagination = pagination;
                if (page <= 1) {
                    state.addPanel.ingredients.list = list;
                } else {
                    state.addPanel.ingredients.list = state.addPanel.ingredients.list.concat(list);
                }
            })
            .addCase(searchAddProductIngredients.rejected, (state) => {
                state.addPanel.ingredients.status = "failed";
            });
    },
});

export const {
    setCatalogSearchApplied,
    setCatalogFilterA,
    setCatalogFilterB,
    setCatalogPage,
    setCatalogLimit,
    setCatalogDisplayMode,
    clearProductDetail,
    resetAddProductPanel,
    clearAddProductIngredientSearch,
    clearAddProductBrandOptions,
} = productSlice.actions;

export default productSlice.reducer;

type ProductRoot = { product: ProductState };

const selectProductState = (s: ProductRoot) => s.product;

export const selectCatalogDisplayRows = createSelector([selectProductState], (p): IProductCatalogRow[] => {
    const c = p.catalog;
    let rows = c.list.map((row, i) => apiProductToCatalogRow(row, i));
    if (c.filterA === "active") {
        rows = rows.filter((r) => r.product_status);
    } else if (c.filterA === "concept") {
        rows = rows.filter((r) => !r.product_status);
    } else if (c.filterA === "discontinued") {
        rows = rows.filter(() => false);
    }
    rows = rows.filter((r) => filterBMatches(r.name || "", c.filterB));
    return rows;
});

export const selectCatalogFilteredTotal = createSelector([selectProductState], (p) => p.catalog.total);
