"use client";

// `/ingredients/[id]` detail page — loads a single ingredient into Redux, then hands it to `IngredientDetailDrawer`.
import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchIngredientDetail } from "@/redux/ingredient/ingredients-thunks";
import { clearIngredientDetail } from "@/redux/ingredient/ingredient-slice";
import { ingredientToCatalogRow } from "@/utils/ingredient-helpers";
import IngredientDetailDrawer from "@/components/ingredients/IngredientDetailDrawer";
import DetailPageShimmer from "@/components/common/DetailPageShimmer";

export default function IngredientDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = String(params?.id ?? "").trim();
    const detail = useAppSelector((s) => s.ingredient.detail);

    // Clear stale detail data on mount/unmount + when the id changes; then kick off the fetch.
    useEffect(() => {
        if (!id) return;
        dispatch(clearIngredientDetail());
        void dispatch(fetchIngredientDetail(id));
        return () => {
            dispatch(clearIngredientDetail());
        };
    }, [dispatch, id]);

    const catalogRow = useMemo(() => {
        if (!detail.data) return null;
        return ingredientToCatalogRow(detail.data);
    }, [detail.data]);

    if (!id) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
                Invalid ingredient.
            </div>
        );
    }

    if (detail.status === "idle" || detail.status === "loading") {
        return <DetailPageShimmer variant="ingredient" />;
    }

    if (detail.status === "failed" || (detail.status === "succeeded" && !catalogRow)) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-3">
                <p className="text-sm text-slate-600">Ingredient not found.</p>
                <button
                    type="button"
                    onClick={() => router.push("/ingredients")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    Back to ingredients
                </button>
            </div>
        );
    }

    return (
        <IngredientDetailDrawer
            asPage
            ingredient={catalogRow}
            onClose={() => router.push("/ingredients")}
        />
    );
}
