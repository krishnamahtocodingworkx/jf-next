import { createSlice } from "@reduxjs/toolkit";
import { getProducts } from "./productsThunk";

export type productsStateType = {
    data: any[];
    pagination: PaginationType;
    loading: boolean;
    error: string | null;
};

interface PaginationType {
    total: number;
    page: number;
    totalPages: number;
    nextHit: boolean;
    limit: number;
    search: string;
    productStatus: string;
    productClass: string;
}

const initialState: productsStateType = {
    data: [],
    pagination: {
        total: 0,
        page: 1,
        totalPages: 0,
        nextHit: false,
        limit: 9,
        search: "",
        productStatus: "All",
        productClass: "All",
    },
    loading: false,
    error: null,
};

const productsSlice = createSlice({
    name: "products",
    initialState,
    reducers: {
        setSearch(state, action) {
            state.pagination.search = action.payload;
        },
        setLimit(state, action) {
            state.pagination.limit = action.payload;
        },
        setProductStatus(state, action) {
            state.pagination.productStatus = action.payload;
        },
        setProductClass(state, action) {
            state.pagination.productClass = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(getProducts.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getProducts.fulfilled, (state, action) => {
            state.loading = false;
            state.data = (action.payload?.data as any[]) || [];
            state.pagination.page = action.payload?.page || 1;
            state.pagination.total = action.payload?.total || 0;
            state.pagination.totalPages = action.payload?.totalPages || 0;
            state.pagination.nextHit = action.payload?.nextHit || false;
            state.pagination.limit = action.payload?.limit || 10;
        });
        builder.addCase(getProducts.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { setSearch, setLimit, setProductStatus, setProductClass } = productsSlice.actions;
export default productsSlice.reducer;