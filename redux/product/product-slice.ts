import { createSlice, createSelector, PayloadAction } from "@reduxjs/toolkit";
import type { IProduct, IProductCatalogRow } from "@/interfaces/product";
import type { SelectOption } from "@/utils/model";
import { apiProductToCatalogRow } from "@/utils/commonFunctions";
import {
    fetchProductCatalog,
    fetchProductDetail,
    fetchProductAddFormOptions,
} from "@/redux/product/product-thunks";

export type CatalogFilterA = "all" | "active" | "concept" | "discontinued";
export type CatalogFilterB = "all" | "bars" | "beverages" | "powders" | "snacks" | "supplements";

export type ProductAddFormOptionsState = {
    brands: SelectOption[];
    companies: SelectOption[];
    manufacturers: SelectOption[];
    countries: SelectOption[];
    currencies: SelectOption[];
    status: "idle" | "loading" | "succeeded" | "failed";
};

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
    addFormOptions: ProductAddFormOptionsState;
};

const initialState: ProductState = {
    catalog: {
        list: [],
        total: 0,
        page: 1,
        totalPages: 1,
        nextHit: false,
        limit: 12,
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
    addFormOptions: {
        brands: [],
        companies: [],
        manufacturers: [],
        countries: [],
        currencies: [],
        status: "idle",
    },
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
        setCatalogDisplayMode: (state, action: PayloadAction<"grid" | "list">) => {
            state.catalog.displayMode = action.payload;
        },
        clearProductDetail: (state) => {
            state.detail = { id: null, data: undefined, status: "idle" };
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
            .addCase(fetchProductAddFormOptions.pending, (state) => {
                state.addFormOptions.status = "loading";
            })
            .addCase(fetchProductAddFormOptions.fulfilled, (state, action) => {
                state.addFormOptions.status = "succeeded";
                state.addFormOptions.brands = action.payload.brands;
                state.addFormOptions.companies = action.payload.companies;
                state.addFormOptions.manufacturers = action.payload.manufacturers;
                state.addFormOptions.countries = action.payload.countries;
                state.addFormOptions.currencies = action.payload.currencies;
            })
            .addCase(fetchProductAddFormOptions.rejected, (state) => {
                state.addFormOptions.status = "failed";
            });
    },
});

export const {
    setCatalogSearchApplied,
    setCatalogFilterA,
    setCatalogFilterB,
    setCatalogPage,
    setCatalogDisplayMode,
    clearProductDetail,
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
