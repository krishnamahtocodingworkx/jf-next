"use client";

// `/products/[id]` detail page — loads the product into Redux, then merges with any catalog list match before rendering the drawer.
import { useEffect, useMemo } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchProductDetail } from "@/redux/product/product-thunks";
import { clearProductDetail } from "@/redux/product/product-slice";
import { apiProductToCatalogRow } from "@/utils/product-helpers";
import ProductDetailDrawer from "@/components/products/ProductDetailDrawer";
import DetailPageShimmer from "@/components/common/DetailPageShimmer";

export default function ProductDetailPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const dispatch = useAppDispatch();
    const id = String(params?.id ?? "").trim();
    const detail = useAppSelector((s) => s.product.detail);
    const catalogListMatch = useAppSelector((s) =>
        s.product.catalog.list.find((row) => {
            const r = row as Record<string, unknown>;
            return String(r._id ?? r.id ?? "").trim() === id;
        }),
    );

    // Clear stale detail data on mount/unmount + when the id changes; then kick off the fetch.
    useEffect(() => {
        if (!id) return;
        dispatch(clearProductDetail());
        void dispatch(fetchProductDetail(id));
        return () => {
            dispatch(clearProductDetail());
        };
    }, [dispatch, id]);

    // Merge the detail payload over the catalog list entry (detail wins) so the drawer has the richest data set.
    const catalogRow = useMemo(() => {
        if (detail.status !== "succeeded" || !detail.data) return null;
        const fromDetail = detail.data as Record<string, unknown>;
        const fromList = catalogListMatch as Record<string, unknown> | undefined;
        const merged: Record<string, unknown> = {
            ...fromList,
            ...fromDetail,
            _id: id,
            id,
            name: String(fromDetail.name ?? fromList?.name ?? "Product").trim() || "Product",
            brand: fromDetail.brand ?? fromList?.brand,
            product_status: fromDetail.product_status ?? fromList?.product_status ?? fromList?.productStatus,
        };
        return apiProductToCatalogRow(merged, 0);
    }, [detail.status, detail.data, catalogListMatch, id]);

    if (!id) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-600">
                Invalid product.
            </div>
        );
    }

    if (detail.status === "idle" || detail.status === "loading") {
        return <DetailPageShimmer variant="product" />;
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
