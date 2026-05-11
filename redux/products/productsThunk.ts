import { createAsyncThunk } from "@reduxjs/toolkit";
import { ApiResponse } from "@/utils/model";
import { RootState } from "../store";
import { productsService } from "@/services/products.service";

export const getProducts = createAsyncThunk(
    "products/getProducts",
    async (_, thunkApi) => {
        try {
            const store = thunkApi.getState() as RootState;
            const { page, limit, search, productStatus, productClass } = store.products.pagination;

            const query = new URLSearchParams();
            query.set("page", String(page));
            query.set("limit", String(limit));
            if (search) query.set("search", search);
            if (productStatus && productStatus !== "All") query.set("productStatus", productStatus);
            if (productClass && productClass !== "All") query.set("productClass", productClass);

            const result: ApiResponse = await productsService.getAllProducts(`?${query.toString()}`);

            return thunkApi.fulfillWithValue(result.data);
        } catch (error) {
            return thunkApi.rejectWithValue(error);
        }
    }
);