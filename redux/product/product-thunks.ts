import { createAsyncThunk } from "@reduxjs/toolkit";
import { productService } from "@/services/product-service";
import { userService } from "@/services/user-service";
import type { UserState } from "@/redux/user/user-types";
import {
    brandsFromProductListRows,
    dedupeSelectOptionsByValue,
    mergeCompanySources,
    normalizeBrandManufacturerRowToOption,
} from "@/utils/commonFunctions";

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

/**
 * Add Product dropdowns — aligned with  `AddProductForm`:
 * brands from product list (then `/user/brands/`, then per-product `getProductBrandById`),
 * manufacturers from `/products/manufacturers/`, countries + currencies + companies APIs.
 */
export const fetchProductAddFormOptions = createAsyncThunk(
    "product/fetchAddFormOptions",
    async (_, { getState }) => {
        const root = getState() as { user: UserState };
        const profile = root.user.details as Record<string, unknown> | null;

        const [productsRes, userBrandOpts, manufacturers, countryRows, currencies, companiesRaw] =
            await Promise.all([
                productService.getProductsPage({ page: 1, limit: 50 }),
                userService.getBrands(),
                userService.getManufacturers(),
                userService.getCountries(),
                productService.getCurrencyOptions(),
                userService.getCompanies(),
            ]);

        let brands = dedupeSelectOptionsByValue(brandsFromProductListRows(productsRes.list));
        if (brands.length === 0) {
            brands = dedupeSelectOptionsByValue(userBrandOpts);
        }
        if (brands.length === 0) {
            const productIds = [
                ...new Set(
                    productsRes.list
                        .map((row) => String(row._id ?? row.id ?? "").trim())
                        .filter(Boolean),
                ),
            ].slice(0, 20);
            const fetched: { value: string; label: string }[] = [];
            for (const pid of productIds) {
                const b = await userService.getProductBrandById(pid);
                const n = b ? normalizeBrandManufacturerRowToOption(b) : null;
                if (n) fetched.push(n);
            }
            brands = dedupeSelectOptionsByValue(fetched);
            console.log("[product] add form brands from productBrand API", brands.length);
        }

        const companies = mergeCompanySources(companiesRaw, profile);
        const countries = countryRows.map((r) => ({ value: r.id, label: r.name }));

        console.log("[product] add form options", {
            brands: brands.length,
            companies: companies.length,
            manufacturers: manufacturers.length,
            countries: countries.length,
            currencies: currencies.length,
        });

        return { brands, companies, manufacturers, countries, currencies };
    },
);
