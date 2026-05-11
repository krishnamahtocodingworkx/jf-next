import { ingredientsService } from "@/services/ingredients.service";
import { createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "../store";
import { ApiResponse } from "@/utils/model";

export const getIngredients = createAsyncThunk(
    "ingredients/getIngredients",
    async (_, thunkApi) => {
        try {
            const store = thunkApi.getState() as RootState;
            const { page, limit, search, productStatus, country, cost, price } = store.ingredients.pagination;

            const query = new URLSearchParams();
            query.set("page", String(page));
            query.set("limit", String(limit));
            if (search) query.set("search", search);
            if (productStatus) query.set("productStatus", productStatus);
            if (country) query.set("country", country);
            if (cost) query.set("cost", cost);
            if (price) query.set("price", price);

            const result: ApiResponse = await ingredientsService.getAllIngredients(`?${query.toString()}`);

            console.log("response in article list :", result.data);

            return thunkApi.fulfillWithValue(result.data);
        } catch (error) {
            console.log("error in articles list :", error);
            return thunkApi.rejectWithValue(error);
        }
    }
);