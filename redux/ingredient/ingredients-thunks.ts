import { createAsyncThunk } from "@reduxjs/toolkit";
import { ingredientService } from "@/services/ingredient-service";
import { userService } from "@/services/user-service";
import type { UserState } from "@/redux/user/user-types";
import { mergeCompanySources } from "@/utils/commonFunctions";

type IngredientSliceSubset = {
    ingredient: {
        pagination: { page: number; size: number };
        ui: { searchApplied: string };
    };
};

export const fetchIngredientsPage = createAsyncThunk(
    "ingredient/fetchPage",
    async (_, { getState }) => {
        const root = getState() as IngredientSliceSubset;
        const { pagination, ui } = root.ingredient;
        const page = Math.max(1, pagination.page || 1);
        const size = Math.max(1, pagination.size || 12);
        const search = ui.searchApplied.trim();
        if (search) {
            return ingredientService.searchIngredients(search, page, size);
        }
        return ingredientService.fetchPaginatedIngredients(page, size);
    },
);

export const fetchIngredientDetail = createAsyncThunk(
    "ingredient/fetchDetail",
    async (id: string) => {
        const ingredient = await ingredientService.fetchIngredientById(id);
        return { id, ingredient };
    },
);

export const fetchIngredientAddFormOptions = createAsyncThunk(
    "ingredient/fetchAddFormOptions",
    async (_, { getState }) => {
        const root = getState() as { user: UserState };
        const profile = root.user.details as Record<string, unknown> | null;
        const [countryRows, companiesRaw] = await Promise.all([
            userService.getCountries(),
            userService.getCompanies(),
        ]);
        const countries = countryRows.map((r) => ({ value: r.id, label: r.name }));
        const companies = mergeCompanySources(companiesRaw, profile);
        console.log("[ingredient] add form options", {
            countries: countries.length,
            companies: companies.length,
        });
        return { countries, companies };
    },
);
