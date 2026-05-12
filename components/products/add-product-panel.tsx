"use client";

import { useState } from "react";
import { ChevronDown, Package, Save, X } from "lucide-react";
import SidePanel from "@/components/common/side-panel";
import { productService, buildCreateProductPayload } from "@/services/product-service";
import { notifyApiSuccessToast } from "@/utils/showToast";

type AddProductPanelProps = {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
};

type AddProductFormData = {
    company: string;
    category: string;
    productType: string;
    subcategory: string;
    sku: string;
    name: string;
    brand: string;
    flavor: string;
    manufacturer: string;
    dateCreated: string;
    fulfilmentDate: string;
    servingSize: string;
    servingUnit: string;
    status: "active" | "concept" | "discontinued";
    guavaEnabled: boolean;
    hasAdditives: boolean;
    guavaScore: string;
    upcCode: string;
    cost: string;
    retailCost: string;
    profitMargin: string;
    country: string;
    currency: string;
    objectives: string;
    notes: string;
};

const initialFormData: AddProductFormData = {
    company: "",
    category: "",
    productType: "",
    subcategory: "",
    sku: "",
    name: "",
    brand: "",
    flavor: "",
    manufacturer: "",
    dateCreated: "",
    fulfilmentDate: "",
    servingSize: "0",
    servingUnit: "g",
    status: "active",
    guavaEnabled: true,
    hasAdditives: false,
    guavaScore: "",
    upcCode: "",
    cost: "0",
    retailCost: "0",
    profitMargin: "0",
    country: "United States",
    currency: "United States Dollar",
    objectives: "",
    notes: "",
};

export default function AddProductPanel({ open, onClose, onCreated }: AddProductPanelProps) {
    const [formData, setFormData] = useState<AddProductFormData>(initialFormData);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string>("");

    const updateField = <K extends keyof AddProductFormData>(key: K, value: AddProductFormData[K]) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const resetAndClose = () => {
        console.log("[AddProductPanel] reset and close");
        setFormData(initialFormData);
        setError("");
        onClose();
    };

    const handleSubmit = async () => {
        if (!formData.name.trim()) {
            setError("Product name is required");
            return;
        }
        setError("");
        setSubmitting(true);
        try {
            const payload = buildCreateProductPayload(
                {
                    name: formData.name,
                    notes: formData.notes,
                    category: formData.category,
                    manufacturer: formData.manufacturer,
                    brand_id: formData.brand,
                    company_id: formData.company,
                    ingredients: [],
                },
                null,
            );
            console.log("[AddProductPanel] submit", { name: payload.name });
            const result = await productService.addProduct(payload);
            notifyApiSuccessToast({ message: "Product created" });
            onCreated?.();
            resetAndClose();
            return result;
        } catch (e) {
            console.log("[AddProductPanel] submit failed", e);
            const message =
                (e as { message?: string })?.message || "Failed to create product. Try again.";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SidePanel
            open={open}
            onClose={resetAndClose}
            title="Add Product"
            icon={<Package className="h-5 w-5 text-blue-600" />}
            width="max-w-2xl"
            footer={
                <>
                    <button
                        type="button"
                        onClick={resetAndClose}
                        className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-600 hover:text-slate-900 rounded-lg"
                    >
                        <X className="h-4 w-4" />
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        <Save className="h-4 w-4" />
                        {submitting ? "Saving..." : "Save Detail"}
                    </button>
                </>
            }
        >
            <div className="space-y-6">
                {error && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {error}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Select Company
                    </label>
                    <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => updateField("company", e.target.value)}
                        placeholder="Company id or name"
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Category
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => updateField("category", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select Category</option>
                            <option value="Food">Food</option>
                            <option value="Beverages">Beverages</option>
                            <option value="Supplements">Supplements</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Product Type
                        </label>
                        <select
                            value={formData.productType}
                            onChange={(e) => updateField("productType", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select Product Type</option>
                            <option value="Retail">Retail</option>
                            <option value="Concept">Concept</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Subcategory
                        </label>
                        <select
                            value={formData.subcategory}
                            onChange={(e) => updateField("subcategory", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select Subcategory</option>
                            <option value="Condiments">Condiments</option>
                            <option value="Snacks">Snacks</option>
                            <option value="Frozen">Frozen</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            SKU / Code
                        </label>
                        <input
                            type="text"
                            value={formData.sku}
                            onChange={(e) => updateField("sku", e.target.value)}
                            placeholder="0003003406461"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Product Name
                        </label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => updateField("name", e.target.value)}
                            placeholder="Sauce, whole berry cranberry"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Brand
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                value={formData.brand}
                                onChange={(e) => updateField("brand", e.target.value)}
                                placeholder="Brand id"
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                            />
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Flavor
                        </label>
                        <input
                            type="text"
                            value={formData.flavor}
                            onChange={(e) => updateField("flavor", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Manufacturer
                        </label>
                        <input
                            type="text"
                            value={formData.manufacturer}
                            onChange={(e) => updateField("manufacturer", e.target.value)}
                            placeholder="Manufacturer id"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Date Created
                        </label>
                        <input
                            type="date"
                            value={formData.dateCreated}
                            onChange={(e) => updateField("dateCreated", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Fulfilment Date
                        </label>
                        <input
                            type="date"
                            value={formData.fulfilmentDate}
                            onChange={(e) => updateField("fulfilmentDate", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Serving Size
                        </label>
                        <div className="flex gap-2">
                            <input
                                type="number"
                                value={formData.servingSize}
                                onChange={(e) => updateField("servingSize", e.target.value)}
                                className="flex-1 px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <select
                                value={formData.servingUnit}
                                onChange={(e) => updateField("servingUnit", e.target.value)}
                                className="w-16 px-2 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            >
                                <option>g</option>
                                <option>ml</option>
                                <option>oz</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Product Status
                        </label>
                        <select
                            value={formData.status}
                            onChange={(e) =>
                                updateField(
                                    "status",
                                    e.target.value as AddProductFormData["status"],
                                )
                            }
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50"
                        >
                            <option value="active">Active</option>
                            <option value="concept">Concept</option>
                            <option value="discontinued">Discontinued</option>
                        </select>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Guava Product
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.guavaEnabled}
                                onChange={(e) => updateField("guavaEnabled", e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-600">
                                Enable Guava features for this product
                            </span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Additives
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.hasAdditives}
                                onChange={(e) => updateField("hasAdditives", e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-600">
                                Product contains additives
                            </span>
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Guava Score
                        </label>
                        <input
                            type="text"
                            value={formData.guavaScore}
                            onChange={(e) => updateField("guavaScore", e.target.value)}
                            placeholder="Enter Guava Score"
                            className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            UPC Code
                        </label>
                        <input
                            type="text"
                            value={formData.upcCode}
                            onChange={(e) => updateField("upcCode", e.target.value)}
                            placeholder="Enter UPC Code"
                            className="w-full px-3 py-2.5 border border-blue-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Cost
                        </label>
                        <input
                            type="number"
                            value={formData.cost}
                            onChange={(e) => updateField("cost", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Retail Cost
                        </label>
                        <input
                            type="number"
                            value={formData.retailCost}
                            onChange={(e) => updateField("retailCost", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Profit Margin (%)
                        </label>
                        <input
                            type="number"
                            value={formData.profitMargin}
                            readOnly
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm bg-slate-50"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Country
                        </label>
                        <div className="relative">
                            <select
                                value={formData.country}
                                onChange={(e) => updateField("country", e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                            >
                                <option>United States</option>
                                <option>Canada</option>
                                <option>United Kingdom</option>
                                <option>India</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Currency
                        </label>
                        <div className="relative">
                            <select
                                value={formData.currency}
                                onChange={(e) => updateField("currency", e.target.value)}
                                className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                            >
                                <option>United States Dollar</option>
                                <option>Canadian Dollar</option>
                                <option>British Pound</option>
                                <option>Indian Rupee</option>
                            </select>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Ingredients
                    </label>
                    <div className="flex items-center gap-2 px-3 py-2.5 border border-slate-200 rounded-lg">
                        <input
                            type="text"
                            className="flex-1 focus:outline-none text-sm bg-transparent"
                            placeholder="Search Ingredient to add..."
                        />
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                        Linked ingredients can be edited after the product is created.
                    </p>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Product Objectives
                    </label>
                    <select
                        value={formData.objectives}
                        onChange={(e) => updateField("objectives", e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    >
                        <option value="">Select Product Objectives</option>
                        <option value="low-sugar">Low Sugar</option>
                        <option value="high-protein">High Protein</option>
                        <option value="organic">Organic</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Notes
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => updateField("notes", e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                        rows={4}
                    />
                </div>

                <p className="text-sm text-slate-500">
                    These preferences will help tailor our product suggestions and filter your
                    live searching whilst using the app.
                </p>
            </div>
        </SidePanel>
    );
}
