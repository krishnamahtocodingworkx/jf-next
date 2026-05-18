// Ingredient thunks — bridge the catalog page filters/pagination to `ingredientService` calls.
import { createAsyncThunk } from "@reduxjs/toolkit";
import { ingredientService } from "@/services/ingredient-service";
import { userService } from "@/services/user-service";
import { mergeCompanySources } from "@/utils/commonFunctions";
import type { UserState } from "@/interfaces/auth";

/** Slice shape this thunk reads from getState — kept narrow to avoid circular imports. */
type IngredientSliceSubset = {
    ingredient: {
        pagination: { page: number; size: number };
        ui: { searchApplied: string };
    };
};

/** Fetches the current catalog page; routes to `search` vs paginated list based on the applied search term. */
export const fetchIngredientsPage = createAsyncThunk(
    "ingredient/fetchPage",
    async (_, { getState }) => {
        const { pagination, ui } = (getState() as IngredientSliceSubset).ingredient;
        const page = Math.max(1, pagination.page || 1);
        const size = Math.max(1, pagination.size || 10);
        const search = ui.searchApplied.trim();
        return search
            ? ingredientService.searchIngredients(search, page, size)
            : ingredientService.fetchPaginatedIngredients(page, size);
    },
);

/** Loads a single ingredient for the `[id]` detail page. */
export const fetchIngredientDetail = createAsyncThunk(
    "ingredient/fetchDetail",
    async (id: string) => {
        const ingredient = await ingredientService.fetchIngredientById(id);
        return { id, ingredient };
    },
);

/** Loads the country + company dropdowns used by the (currently-disabled) Add Ingredient form. */
export const fetchIngredientAddFormOptions = createAsyncThunk(
    "ingredient/fetchAddFormOptions",
    async (_, { getState }) => {
        const profile = (getState() as { user: UserState }).user.details as
            | Record<string, unknown>
            | null;
        const [countryRows, companiesRaw] = await Promise.all([
            userService.getCountries(),
            userService.getCompanies(),
        ]);
        const countries = countryRows.map((row) => ({ value: row.id, label: row.name }));
        // Also surface companies attached to the user profile so the user always sees their own org.
        const companies = mergeCompanySources(companiesRaw, profile);
        return { countries, companies };
    },
);
