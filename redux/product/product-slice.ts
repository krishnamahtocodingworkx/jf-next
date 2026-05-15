// Product slice — owns catalog state, detail cache, and the lazy-loaded Add Product dropdown options.
import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type { IProductCatalogRow } from "@/interfaces/product";
import type { CatalogFilterA, CatalogFilterB, ProductState } from "@/utils/model";
import {
    apiProductToCatalogRow,
    createInitialAddPanelState,
    createInitialProductState,
    matchesCatalogCategoryPill,
} from "@/utils/product-helpers";
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

const initialState: ProductState = createInitialProductState();

const productSlice = createSlice({
    name: "product",
    initialState,
    reducers: {
        /** Applies the debounced catalog search; resets to page 1 so the new query starts fresh. */
        setCatalogSearchApplied: (state, action: PayloadAction<string>) => {
            state.catalog.search = action.payload;
            state.catalog.page = 1;
        },
        /** Sets the status pill (active / concept / discontinued / all) — server-side filter. */
        setCatalogFilterA: (state, action: PayloadAction<CatalogFilterA>) => {
            state.catalog.filterA = action.payload;
            state.catalog.page = 1;
        },
        /** Sets the category pill (bars / beverages / …) — applied client-side by the catalog selector. */
        setCatalogFilterB: (state, action: PayloadAction<CatalogFilterB>) => {
            state.catalog.filterB = action.payload;
            state.catalog.page = 1;
        },
        /** Jumps to a specific page (1-indexed, clamped to ≥1); the `useEffect` watcher refetches. */
        setCatalogPage: (state, action: PayloadAction<number>) => {
            state.catalog.page = Math.max(1, action.payload);
        },
        /** Sets the per-page count and resets to page 1; only allows approved sizes to guard against bad query params. */
        setCatalogLimit: (state, action: PayloadAction<number>) => {
            const allowed = [10, 20, 50, 100] as const;
            const next = allowed.includes(action.payload as (typeof allowed)[number])
                ? action.payload
                : state.catalog.limit;
            state.catalog.limit = next;
            state.catalog.page = 1;
        },
        /** Toggles the catalog between grid and list views. */
        setCatalogDisplayMode: (state, action: PayloadAction<"grid" | "list">) => {
            state.catalog.displayMode = action.payload;
        },
        /** Wipes the detail cache when leaving the `[id]` page so reopening fetches fresh data. */
        clearProductDetail: (state) => {
            state.detail = { id: null, data: undefined, status: "idle" };
        },
        /** Resets every Add Product dropdown back to idle — invoked on panel unmount. */
        resetAddProductPanel: (state) => {
            state.addPanel = createInitialAddPanelState();
        },
        /** Clears the ingredient typeahead when the user clears the search input. */
        clearAddProductIngredientSearch: (state) => {
            state.addPanel.ingredients = {
                status: "idle",
                term: "",
                page: 1,
                list: [],
                pagination: { page: 1, pages: 1, size: 20, total: 0 },
            };
        },
        /** Drops the cached brand list (forces a refetch the next time the brand select opens). */
        clearAddProductBrandOptions: (state) => {
            state.addPanel.brands.items = [];
            state.addPanel.brands.status = "idle";
            state.addPanel.brands.enrichment = "idle";
            state.addPanel.brands.companyByBrandId = {};
        },
    },
    extraReducers: (builder) => {
        builder
            // ── fetchProductCatalog: drives the catalog list — pending shimmers, fulfilled replaces list + pagination.
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
            // ── fetchProductDetail: powers the `[id]` page — thunk rejects "NOT_FOUND" so the page can show a 404 card.
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
            // ── fetchAddProductCompanyTypes: lazy-loaded on first focus of the Add Product company select.
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
            // ── fetchAddProductRootCategories: lazy-loaded on first focus of the category select.
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
            // ── fetchAddProductCategoryBundle: keyed by category name — keeps prior options visible while reloading.
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
            // ── fetchAddProductSubCategoryBundle: keyed by subcategory — used when the user picks a subcategory first.
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
            // ── fetchAddProductBrands: also hydrates the brand→company map so picking a brand auto-fills the company.
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
            // ── fetchAddProductManufacturersLazy: lazy-loaded on first focus of the manufacturer select.
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
            // ── fetchAddProductCountriesLazy: lazy-loaded on first focus of the country select.
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
            // ── fetchAddProductCurrenciesLazy: lazy-loaded on first focus of the currency select.
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
            // ── searchAddProductIngredients: typeahead for the ingredient picker — page 1 replaces, page >1 appends.
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

/** Maps the wire catalog list into card rows + applies the local filter pills (status + category keywords). */
export const selectCatalogDisplayRows = createSelector([selectProductState], (p): IProductCatalogRow[] => {
    const c = p.catalog;
    let rows = c.list.map((row, i) => apiProductToCatalogRow(row, i));
    if (c.filterA === "active") {
        rows = rows.filter((r) => r.product_status);
    } else if (c.filterA === "concept") {
        rows = rows.filter((r) => !r.product_status);
    } else if (c.filterA === "discontinued") {
        // No discontinued products in the current data model — keep the option for future use.
        rows = rows.filter(() => false);
    }
    rows = rows.filter((r) => matchesCatalogCategoryPill(r.name || "", c.filterB));
    return rows;
});

/** Server-reported total (used for the header counter + pagination math). */
export const selectCatalogFilteredTotal = createSelector([selectProductState], (p) => p.catalog.total);
