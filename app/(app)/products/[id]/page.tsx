"use client";

import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductDetail } from "@/redux/product/product-thunks";
import { clearProductDetail } from "@/redux/product/product-slice";
import { apiProductToCatalogRow } from "@/utils/commonFunctions";
import ProductDetailDrawer from "@/components/products/ProductDetailDrawer";
import CatalogShimmer from "@/components/common/CatalogShimmer";

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = String(params?.id ?? "").trim();
    const detail = useAppSelector((s) => s.product.detail);

    useEffect(() => {
        if (!id) return;
        console.log("[ProductDetailPage] load", id);
        dispatch(clearProductDetail());
        void dispatch(fetchProductDetail(id));
        return () => {
            dispatch(clearProductDetail());
        };
    }, [dispatch, id]);

    const catalogRow = useMemo(() => {
        if (!detail.data) return null;
        return apiProductToCatalogRow(detail.data as Record<string, unknown>, 0);
    }, [detail.data]);

    if (!id) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
                Invalid product.
            </div>
        );
    }

    if (detail.status === "idle" || detail.status === "loading") {
        return <CatalogShimmer viewMode="grid" count={3} />;
    }

    if (detail.status === "failed" || (detail.status === "succeeded" && !catalogRow)) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center space-y-3">
                <p className="text-sm text-slate-600">Product not found.</p>
                <button
                    type="button"
                    onClick={() => router.push("/products")}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700"
                >
                    Back to products
                </button>
            </div>
        );
    }

    return (
        <ProductDetailDrawer
            asPage
            product={catalogRow}
            onClose={() => router.push("/products")}
        />
    );
}
