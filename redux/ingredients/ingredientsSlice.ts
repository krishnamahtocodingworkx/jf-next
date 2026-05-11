import { createSlice } from "@reduxjs/toolkit";
import { getIngredients } from "./ingredientsThunk";

export type ingredientsStateType = {
    data: any[];
    pagination: PaginationType;
    loading: boolean;
    error: string | null;
};
const initialState: ingredientsStateType = {
    data: [],
    pagination: {
        total: 0,
        page: 1,
        totalPages: 0,
        nextHit: false,
        limit: 9,
        search: "",
        productStatus: "",
        country: "",
        cost: "",
        price: "",
    },
    loading: false,
    error: null,
};

interface PaginationType {
    total: number;
    page: number;
    totalPages: number;
    nextHit: boolean;
    limit: number;
    search: string;
    productStatus: string;
    country: string;
    cost: string;
    price: string;
}


const ingredientsSlice = createSlice({
    name: "ingredients",
    initialState: initialState,
    reducers: {
        setSearch(state, action) {
            state.pagination.search = action.payload;
        },
        setLimit(state, action) {
            state.pagination.limit = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(getIngredients.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(getIngredients.fulfilled, (state, action) => {
            console.log("value in payload :", action.payload);
            state.loading = false;
            state.data = (action.payload?.data as any[]) || [];
            state.pagination.page = action.payload?.page || 1;
            state.pagination.total = action.payload?.total || 0;
            state.pagination.totalPages = action.payload?.totalPages || 0;
            state.pagination.nextHit = action.payload?.nextHit || false;
            state.pagination.limit = action.payload?.limit || 10;
        });
        builder.addCase(getIngredients.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as any;
        });
    }
});

export const { setSearch, setLimit } = ingredientsSlice.actions;
export default ingredientsSlice.reducer;