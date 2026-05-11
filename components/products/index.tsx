"use client";

import ProductActionsCard from "@/components/products/ProductActionsCard";
import ProductActiveStat from "@/components/products/ProductActiveStat";
import ProductCategoryPanel from "@/components/products/ProductCategoryPanel";
import ProductGridCard from "@/components/products/ProductGridCard";
import ProductListRow from "@/components/products/ProductListRow";
import { Product } from "@/components/products/types";
import { setLimit, setProductClass, setProductStatus, setSearch } from "@/redux/products/productsSlice";
import { getProducts } from "@/redux/products/productsThunk";
import { AppDispatch, RootState } from "@/redux/store";
import { normalizeProduct } from "@/utils/commonFunctions";
import { ChevronDown, ChevronRight, Filter, LayoutGrid, List, Package, Search, Zap } from "lucide-react";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

export default function ProductsClient() {
    const dispatch: AppDispatch = useDispatch();
    const productState = useSelector((state: RootState) => state.products);
    const { search, total, limit, productStatus, productClass } = productState.pagination;
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
    const [showFilters, setShowFilters] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [showAll, setShowAll] = useState(false);

    useEffect(() => {
        dispatch(getProducts());
    }, [dispatch, search, limit, productStatus, productClass]);

    const searchHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearch(event.target.value));
    };

    const limitHandler = () => {
        if (showAll) {
            dispatch(setLimit(9));
        } else {
            dispatch(setLimit(total || 9));
        }
        setShowAll((prev) => !prev);
    };

    const products = useMemo(
        () => (Array.isArray(productState.data) ? productState.data.map(normalizeProduct) : []),
        [productState.data]
    );

    const filteredProducts = useMemo(() => {
        const query = search.trim().toLowerCase();
        return products.filter((product) => {
            const matchesSearch =
                !query ||
                product.name.toLowerCase().includes(query) ||
                product.productClass.toLowerCase().includes(query) ||
                product.primaryClass.toLowerCase().includes(query);
            const matchesStatus =
                productStatus === "All" || product.status === productStatus.toLowerCase();
            const matchesClass =
                productClass === "All" || product.primaryClass === productClass;
            return matchesSearch && matchesStatus && matchesClass;
        });
    }, [products, productClass, productStatus, search]);

    const categoryOptions = useMemo(() => {
        const counts = new Map<string, number>();
        for (const product of products) {
            counts.set(product.primaryClass, (counts.get(product.primaryClass) || 0) + 1);
        }
        return ["All", ...Array.from(counts.keys())];
    }, [products]);

    const topCategories = useMemo(() => {
        const counts = new Map<string, number>();
        for (const product of products) {
            counts.set(product.primaryClass, (counts.get(product.primaryClass) || 0) + 1);
        }
        return Array.from(counts.entries())
            .map(([label, count]) => ({ label, count }))
            .sort((left, right) => right.count - left.count);
    }, [products]);

    const activeCount = products.filter((product) => product.status === "active").length;
    const inactiveCount = products.filter((product) => product.status === "inactive").length;
    const averageNutritionScore =
        products.length > 0
            ? products.reduce((sum, product) => sum + product.nutritionScore, 0) / products.length
            : 0;
    const averageMargin =
        products.length > 0
            ? products.reduce((sum, product) => sum + product.costMargin, 0) / products.length
            : 0;

    if (productState?.error) {
        return <div className="text-sm text-red-600">{productState.error}</div>;
    }

    return (
        <div className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProductActionsCard
                    activeCount={activeCount}
                    inactiveCount={inactiveCount}
                    total={products.length}
                    averageMargin={averageMargin}
                />
                <ProductActiveStat
                    activeCount={activeCount}
                    total={products.length}
                    averageNutritionScore={averageNutritionScore}
                />
                <ProductCategoryPanel categories={topCategories} />
            </div>

            {selectedProduct && (
                <div className="rounded-xl border border-blue-100 bg-blue-50 p-4 flex items-start justify-between gap-4">
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">Selected Product</p>
                        <h3 className="mt-1 text-lg font-semibold text-slate-900">{selectedProduct.name}</h3>
                        <p className="text-sm text-slate-600">
                            {selectedProduct.primaryClass} • {selectedProduct.status}
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={() => setSelectedProduct(null)}
                        className="text-sm font-medium text-blue-700 hover:text-blue-800"
                    >
                        Close
                    </button>
                </div>
            )}

            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
                <div className="flex items-center justify-between gap-3 p-4 border-b border-slate-100 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                        <Package className="h-4 w-4 text-slate-400" />
                        <h2 className="text-base font-semibold text-slate-800">All Products</h2>
                        <span className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">{filteredProducts.length} items</span>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative">
                            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                            <input
                                type="text"
                                value={search}
                                onChange={searchHandler}
                                placeholder="Search products..."
                                className="pl-8 pr-3 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
                            />
                        </div>

                        <div className="relative">
                            <select
                                value={productStatus}
                                onChange={(event) => dispatch(setProductStatus(event.target.value))}
                                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white"
                            >
                                <option value="All">All</option>
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        </div>

                        <div className="relative">
                            <select
                                value={productClass}
                                onChange={(event) => dispatch(setProductClass(event.target.value))}
                                className="pl-3 pr-7 py-1.5 text-sm border border-slate-200 rounded-lg focus:outline-none appearance-none bg-white"
                            >
                                {categoryOptions.map((category, index) => (
                                    <option key={`${category}-${index}`} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>
                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400 pointer-events-none" />
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowFilters((prev) => !prev)}
                            className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            <Filter className="h-3.5 w-3.5" />
                            Filters
                        </button>

                        <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
                            <button
                                type="button"
                                onClick={() => setViewMode("grid")}
                                className={`p-1.5 transition-colors ${viewMode === "grid" ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"}`}
                            >
                                <LayoutGrid className="h-4 w-4" />
                            </button>
                            <button
                                type="button"
                                onClick={() => setViewMode("list")}
                                className={`p-1.5 transition-colors ${viewMode === "list" ? "bg-slate-900 text-white" : "hover:bg-slate-50 text-slate-500"}`}
                            >
                                <List className="h-4 w-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {showFilters && (
                    <div className="px-4 py-3 border-b border-slate-100 flex gap-2 flex-wrap">
                        {categoryOptions.map((category, index) => (
                            <button
                                key={`${category}-${index}`}
                                type="button"
                                onClick={() => dispatch(setProductClass(category))}
                                className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${productClass === category ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600 hover:bg-slate-200"}`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                )}

                {viewMode === "list" && (
                    <div className="hidden md:grid grid-cols-[1fr_auto] gap-4 px-4 py-2 bg-slate-50 border-b border-slate-100 text-xs font-semibold text-slate-500 uppercase tracking-wide">
                        <span>Product</span>
                        <div className="flex items-center gap-6 pr-16">
                            <span className="w-14 text-center">Nutrition</span>
                            <span className="w-14 text-center">Markup</span>
                            <span className="w-14 text-center">Margin</span>
                            <span className="w-20 text-right">Cost</span>
                            <span className="w-16 text-center">Status</span>
                        </div>
                    </div>
                )}

                {viewMode === "grid" ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                        {filteredProducts.map((product) => (
                            <ProductGridCard key={product.id} product={product} onView={() => setSelectedProduct(product)} />
                        ))}
                    </div>
                ) : (
                    <div>
                        {filteredProducts.map((product) => (
                            <ProductListRow key={product.id} product={product} onView={() => setSelectedProduct(product)} />
                        ))}
                    </div>
                )}

                <div className="p-4 border-t border-slate-100 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Showing {filteredProducts.length} of {total}
                    </p>
                    <button
                        type="button"
                        onClick={limitHandler}
                        className="text-sm font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1"
                    >
                        {showAll ? "Show less" : `Show all ${total}`}
                        <ChevronRight className={`h-4 w-4 transition-transform ${showAll ? "rotate-90" : ""}`} />
                    </button>
                </div>
            </div>

            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-100 p-5 flex items-start gap-4">
                <div className="p-3 bg-blue-100 rounded-lg shrink-0">
                    <Zap className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                    <h3 className="font-semibold text-slate-800 mb-1">Quick Tip</h3>
                    <p className="text-sm text-slate-600">
                        Use the class and status filters to narrow a large product catalog before loading more rows.
                    </p>
                </div>
            </div>
        </div>
    );
}