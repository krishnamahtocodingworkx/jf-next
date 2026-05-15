import { api } from "@/services/api";
import { ENDPOINTS } from "@/utils/endpoints";
import { handleApiError } from "@/utils/service";
import {
    EMPTY_INGREDIENT_USAGE,
    emptyIngredientPagination,
    parseIngredientListBody,
} from "@/utils/ingredient-helpers";
import type { IIngredientUsageChart, ISupplierIngredient } from "@/interfaces/ingredient";
import type { PaginatedIngredients } from "@/utils/model";

/** API-call layer for the Ingredients module — mapping/normalization lives in `utils/ingredient-helpers`. */
export const ingredientService = {
    /** Catalog page fetch (no search term) — consumed by `fetchIngredientsPage` thunk. */
    async fetchPaginatedIngredients(page: number, size: number): Promise<PaginatedIngredients> {
        const safePage = Math.max(1, page);
        const safeSize = Math.max(1, size);
        try {
            const { data } = await api.get(ENDPOINTS.INGREDIENT.GET_INGREDIENT_LIST, {
                params: { page: safePage, limit: safeSize },
            });
            return parseIngredientListBody(
                (data ?? {}) as Record<string, unknown>,
                safePage,
                safeSize,
            );
        } catch (error) {
            handleApiError(error, "Ingredients");
            return { list: [], pagination: emptyIngredientPagination(safeSize) };
        }
    },

    /** Same endpoint with a `search` param; falls back to `fetchPaginatedIngredients` when the term is empty. */
    async searchIngredients(
        term: string,
        page: number,
        size: number,
    ): Promise<PaginatedIngredients> {
        const trimmed = term.trim();
        if (!trimmed) return ingredientService.fetchPaginatedIngredients(page, size);

        const safePage = Math.max(1, page);
        const safeSize = Math.max(1, size);
        try {
            const { data } = await api.get(ENDPOINTS.INGREDIENT.GET_INGREDIENT_LIST, {
                params: { page: safePage, limit: safeSize, search: trimmed },
            });
            return parseIngredientListBody(
                (data ?? {}) as Record<string, unknown>,
                safePage,
                safeSize,
            );
        } catch (error) {
            handleApiError(error, "Ingredient Search");
            return { list: [], pagination: emptyIngredientPagination(safeSize) };
        }
    },

    /** Detail lookup — backend has no dedicated detail endpoint, so we try `_id`, `id`, then `search` against the list endpoint. */
    async fetchIngredientById(id: string): Promise<ISupplierIngredient | undefined> {
        const cleanId = String(id || "").trim();
        if (!cleanId) return undefined;

        // Different backend versions accept different lookup params; first match wins.
        const paramSets: Record<string, string | number>[] = [
            { page: 1, limit: 1, _id: cleanId },
            { page: 1, limit: 1, id: cleanId },
            { page: 1, limit: 40, search: cleanId },
        ];

        for (const params of paramSets) {
            try {
                const { data } = await api.get(ENDPOINTS.INGREDIENT.GET_INGREDIENT_LIST, { params });
                const limit = typeof params.limit === "number" ? params.limit : 1;
                const { list } = parseIngredientListBody(
                    (data ?? {}) as Record<string, unknown>,
                    1,
                    limit,
                );
                const hit = list.find((row) => String(row.id) === cleanId);
                if (hit) return hit;
                // If we only got one row, assume it's the right one even when the id field differs.
                if (list.length === 1) return list[0];
            } catch {
                // try the next param set
            }
        }
        return undefined;
    },

    /** Time-series for the Ingredient analytics chart (Overview module). */
    async getIngredientUsage(): Promise<IIngredientUsageChart> {
        try {
            const { data } = await api.get(ENDPOINTS.ANALYTICS.INGREDIENT_USAGE);
            if (!data || typeof data !== "object") return { ...EMPTY_INGREDIENT_USAGE };
            const { labels, activeCounts, conceptCounts } = data as Record<string, unknown>;
            if (Array.isArray(labels) && Array.isArray(activeCounts) && Array.isArray(conceptCounts)) {
                return {
                    labels: labels as string[],
                    activeCounts: activeCounts as number[],
                    conceptCounts: conceptCounts as number[],
                };
            }
            return { ...EMPTY_INGREDIENT_USAGE };
        } catch {
            return { ...EMPTY_INGREDIENT_USAGE };
        }
    },
};
