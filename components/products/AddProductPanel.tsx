"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { Package, Save, X } from "lucide-react";
import {
  productService,
  buildCreateProductPayload,
} from "@/services/product-service";
import { notifyApiSuccessToast } from "@/utils/showToast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import {
  fetchAddProductBrandsByCompanyId,
  fetchAddProductCategoryBundle,
  fetchAddProductCompanyTypes,
  fetchAddProductCountriesLazy,
  fetchAddProductCurrenciesLazy,
  fetchAddProductManufacturersLazy,
  searchAddProductIngredients,
} from "@/redux/product/product-thunks";
import {
  clearAddProductBrandOptions,
  clearAddProductIngredientSearch,
  resetAddProductPanel,
} from "@/redux/product/product-slice";
import { getErrorMessage } from "@/utils/commonFunctions";
import { ADD_PRODUCT_INITIAL_VALUES } from "@/utils/initialValues";
import type {
  AddProductFormValues,
  AddProductPanelProps,
  AddProductPickedIngredient,
} from "@/utils/model";
import {
  getAddProductFormValidationError,
  getAddProductIngredientSelectionError,
} from "@/utils/schema";
import { ChevronSelect } from "@/components/common/ChevronSelect";
import { PRODUCT_CATEGORY_OPTIONS } from "@/utils/enum";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Matches `AddProductForm` objective fallbacks in JourneyFoodsDashboardUpgraded. */
const PRODUCT_OBJECTIVE_OPTIONS = [
  "Cost",
  "Sustainability",
  "Nutrition",
  "Taste",
  "Texture",
] as const;
const INGREDIENT_UNITS = ["oz", "lb", "mg", "g", "kg", "mL"] as const;

/** Tailwind aligned with `EditProductPanel` */
const lbl = "mb-1.5 block text-sm font-medium text-slate-700";
const lblSection = "mb-2 block text-sm font-medium text-slate-700";
const field =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const fieldBlue =
  "w-full rounded-lg border border-blue-200 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500";
const fieldReadonly = twMerge(clsx(field, "cursor-not-allowed bg-slate-50"));
const selectField = twMerge(
  clsx(
    "min-h-0 border-slate-200 bg-white text-slate-900 shadow-none",
    "rounded-lg py-2.5 pl-3 pr-9 text-sm",
    "focus:border-slate-200 focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
  ),
);
const selectMuted = twMerge(clsx(selectField, "bg-slate-50"));
const chk = "h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500";

export default function AddProductPanel({
  open,
  onClose,
  onCreated,
}: AddProductPanelProps) {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((s) => s.user.details);
  const addPanel = useAppSelector((s) => s.product.addPanel);
  const [formData, setFormData] = useState<AddProductFormValues>(() => ({
    ...ADD_PRODUCT_INITIAL_VALUES,
  }));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string>("");
  const [ingredientInput, setIngredientInput] = useState("");
  const [debouncedIngredient, setDebouncedIngredient] = useState("");
  const [pickedIngredients, setPickedIngredients] = useState<
    AddProductPickedIngredient[]
  >([]);
  const [ingredientError, setIngredientError] = useState("");

  const costMarginDisplay = useMemo(() => {
    const c = Number(formData.cost) || 0;
    const m = Number(formData.retailCost) || 0;
    if (m <= 0) return "0";
    const pct = ((m - c) / m) * 100;
    if (!Number.isFinite(pct)) return "0";
    return String(Math.max(0, Math.min(100, Math.round(pct * 100) / 100)));
  }, [formData.cost, formData.retailCost]);

  useEffect(() => {
    if (!open) {
      dispatch(resetAddProductPanel());
      setIngredientInput("");
      setDebouncedIngredient("");
      setPickedIngredients([]);
      setIngredientError("");
    }
  }, [open, dispatch]);

  useEffect(() => {
    if (!open) return;
    const ids = new Set(addPanel.brands.items.map((o) => o.value));
    if (formData.brand && !ids.has(formData.brand)) {
      setFormData((prev) => ({ ...prev, brand: "" }));
    }
  }, [open, addPanel.brands.items, formData.brand]);

  useEffect(() => {
    if (!open) return;
    const cid = formData.company.trim();
    if (!cid) {
      dispatch(clearAddProductBrandOptions());
      return;
    }
    void dispatch(fetchAddProductBrandsByCompanyId(cid));
  }, [open, formData.company, dispatch]);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedIngredient(ingredientInput), 400);
    return () => clearTimeout(t);
  }, [ingredientInput]);

  useEffect(() => {
    if (!open) return;
    const q = debouncedIngredient.trim();
    if (!q) {
      dispatch(clearAddProductIngredientSearch());
      return;
    }
    void dispatch(searchAddProductIngredients({ term: q, page: 1, size: 20 }));
  }, [debouncedIngredient, open, dispatch]);

  useEffect(() => {
    if (!open) return;
    const cat = formData.category.trim();
    if (!cat) return;
    void dispatch(fetchAddProductCategoryBundle(cat));
  }, [open, formData.category, dispatch]);

  const updateField = useCallback(
    <K extends keyof AddProductFormValues>(
      key: K,
      value: AddProductFormValues[K],
    ) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
    },
    [],
  );

  const resetAndClose = () => {
    console.log("[AddProductPanel] reset and close");
    setIngredientError("");
    setFormData({ ...ADD_PRODUCT_INITIAL_VALUES });
    setError("");
    setIngredientInput("");
    setDebouncedIngredient("");
    setPickedIngredients([]);
    dispatch(resetAddProductPanel());
    onClose();
  };

  const bundle = formData.category
    ? addPanel.categoryBundles[formData.category]
    : undefined;
  const productTypeOptions = bundle?.productTypes ?? [];
  const subCategoryOptions = bundle?.subCategories ?? [];

  const handleSubmit = async () => {
    const formErr = getAddProductFormValidationError(formData);
    if (formErr) {
      console.log("[AddProductPanel] form validation failed", formErr);
      setError(formErr);
      return;
    }
    const ingErr = getAddProductIngredientSelectionError(pickedIngredients);
    if (ingErr) {
      console.log("[AddProductPanel] ingredient validation failed", ingErr);
      setIngredientError(ingErr);
      setError("");
      return;
    }
    setIngredientError("");
    setError("");
    setSubmitting(true);
    try {
      const ingredientsPayload = pickedIngredients.map((i) => ({
        ingredient: { id: i.id, jf_display_name: i.jf_display_name },
        weight: Number(i.weight) || 0,
        unit: i.unit,
      }));
      const payload = buildCreateProductPayload(
        {
          name: formData.name,
          notes: formData.notes,
          category: formData.category,
          manufacturer: formData.manufacturer,
          brand_id: formData.brand,
          company_id: formData.company,
          ingredients: ingredientsPayload,
        },
        profile as Record<string, unknown> | null,
      );
      console.log("[AddProductPanel] submit", { name: payload.name });
      const result = await productService.addProduct(payload);
      notifyApiSuccessToast({ message: "Product created" });
      onCreated?.();
      resetAndClose();
      return result;
    } catch (e) {
      console.log("[AddProductPanel] submit failed", e);
      setError(getErrorMessage(e, "Failed to create product. Try again."));
    } finally {
      setSubmitting(false);
    }
  };

  const addPickedIngredient = (row: {
    id: string;
    jf_display_name?: string;
  }) => {
    const id = String(row.id || "").trim();
    if (!id) return;
    if (pickedIngredients.some((x) => x.id === id)) return;
    console.log("[AddProductPanel] add ingredient", id);
    setPickedIngredients((prev) => [
      ...prev,
      { id, jf_display_name: row.jf_display_name, weight: "0", unit: "oz" },
    ]);
    setIngredientInput("");
    setIngredientError("");
    dispatch(clearAddProductIngredientSearch());
  };

  const addCustomIngredient = (term: string) => {
    const value = term.trim();
    if (!value) return;
    const id = `custom:${value.toLowerCase()}`;
    if (pickedIngredients.some((x) => x.id === id)) return;
    setPickedIngredients((prev) => [
      ...prev,
      { id, jf_display_name: value, weight: "0", unit: "oz" },
    ]);
    setIngredientInput("");
    setIngredientError("");
    dispatch(clearAddProductIngredientSearch());
  };

  const updateIngredientWeight = (id: string, weight: string) => {
    setPickedIngredients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, weight } : r)),
    );
  };

  const updateIngredientUnit = (id: string, unit: string) => {
    setPickedIngredients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, unit } : r)),
    );
  };

  const removePickedIngredient = (id: string) => {
    setPickedIngredients((prev) => prev.filter((x) => x.id !== id));
  };

  const loadMoreIngredients = () => {
    const term = debouncedIngredient.trim();
    if (!term) return;
    const { page, pages } = addPanel.ingredients.pagination;
    if (addPanel.ingredients.status === "loading") return;
    if (pages && page >= pages) return;
    void dispatch(
      searchAddProductIngredients({ term, page: page + 1, size: 20 }),
    );
  };

  return (
    <>
      {open ? (
        <div className="fixed inset-0 z-50 flex">
          <div className="flex-1 bg-black/40" onClick={resetAndClose} />
          <div className="w-full max-w-2xl bg-white shadow-2xl flex flex-col overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Package className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-lg font-semibold text-slate-800">
                  Add Product
                </h2>
              </div>
              <button
                type="button"
                onClick={resetAndClose}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <X className="h-5 w-5 text-slate-500" />
              </button>
            </div>

            <div className="flex-1 space-y-6 overflow-y-auto p-6">
              {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label className={lbl}>Select Company</label>
                <ChevronSelect
                  value={formData.company}
                  onChange={(e) => {
                    const v = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      company: v,
                      brand: prev.company === v ? prev.brand : "",
                    }));
                  }}
                  onOpenIntent={() => {
                    void dispatch(fetchAddProductCompanyTypes());
                  }}
                  disabled={addPanel.companyTypes.status === "loading"}
                  className={selectField}
                  iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                >
                  <option value="">
                    {addPanel.companyTypes.status === "loading"
                      ? "Loading companies…"
                      : "Select company"}
                  </option>
                  {addPanel.companyTypes.items.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </ChevronSelect>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Category</label>
                  <ChevronSelect
                    value={formData.category}
                    onChange={(e) => {
                      const v = e.target.value;
                      setFormData((prev) => ({
                        ...prev,
                        category: v,
                        productType: "",
                        subcategory: "",
                      }));
                    }}
                    className={selectField}
                    iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <option value="">Select Category</option>
                    {PRODUCT_CATEGORY_OPTIONS.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </ChevronSelect>
                </div>
                <div>
                  <label className={lbl}>Product Type</label>
                  <ChevronSelect
                    value={formData.productType}
                    onChange={(e) => updateField("productType", e.target.value)}
                    onOpenIntent={() => {
                      if (formData.category) {
                        void dispatch(
                          fetchAddProductCategoryBundle(formData.category),
                        );
                      }
                    }}
                    disabled={
                      !formData.category || bundle?.status === "loading"
                    }
                    className={selectField}
                    iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <option value="">
                      {!formData.category
                        ? "Select category first"
                        : bundle?.status === "loading"
                          ? "Loading…"
                          : "Select Product Type"}
                    </option>
                    {productTypeOptions.map((pt) => (
                      <option key={pt} value={pt}>
                        {pt}
                      </option>
                    ))}
                  </ChevronSelect>
                </div>
                <div>
                  <label className={lbl}>Subcategory</label>
                  <ChevronSelect
                    value={formData.subcategory}
                    onChange={(e) => updateField("subcategory", e.target.value)}
                    onOpenIntent={() => {
                      if (formData.category) {
                        void dispatch(
                          fetchAddProductCategoryBundle(formData.category),
                        );
                      }
                    }}
                    disabled={
                      !formData.category ||
                      bundle?.status === "loading" ||
                      subCategoryOptions.length === 0
                    }
                    className={selectField}
                    iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <option value="">
                      {!formData.category
                        ? "Select prod. type first"
                        : subCategoryOptions.length === 0
                          ? "No subcategories"
                          : "Select Subcategory"}
                    </option>
                    {subCategoryOptions.map((sc) => (
                      <option key={sc} value={sc}>
                        {sc}
                      </option>
                    ))}
                  </ChevronSelect>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>SKU / Code</label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => updateField("sku", e.target.value)}
                    placeholder="0003003406461"
                    className={field}
                  />
                </div>
                <div>
                  <label className={lbl}>Product Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Enter product name"
                    className={field}
                  />
                </div>
                <div className="min-w-0">
                  <label className={lbl}>Brand</label>
                  <ChevronSelect
                    value={formData.brand}
                    onChange={(e) => updateField("brand", e.target.value)}
                    onOpenIntent={() => {
                      const cid = formData.company.trim();
                      if (cid) {
                        void dispatch(fetchAddProductBrandsByCompanyId(cid));
                      }
                    }}
                    disabled={
                      !formData.company.trim() ||
                      addPanel.brands.enrichment === "loading"
                    }
                    className={selectField}
                    iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <option value="">
                      {!formData.company.trim()
                        ? "Select company first"
                        : addPanel.brands.enrichment === "loading"
                          ? "Loading brand…"
                          : "Select Brand"}
                    </option>
                    {addPanel.brands.items.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </ChevronSelect>
                  {addPanel.brands.enrichment === "loading" &&
                  formData.company.trim() ? (
                    <p className="mt-1 text-xs text-slate-500">
                      Loading brand for company…
                    </p>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Flavor</label>
                  <input
                    type="text"
                    value={formData.flavor}
                    onChange={(e) => updateField("flavor", e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className={lbl}>Manufacturer</label>
                  <ChevronSelect
                    value={formData.manufacturer}
                    onChange={(e) =>
                      updateField("manufacturer", e.target.value)
                    }
                    onOpenIntent={() => {
                      void dispatch(fetchAddProductManufacturersLazy());
                    }}
                    disabled={addPanel.manufacturers.status === "loading"}
                    className={selectField}
                    iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <option value="">
                      {addPanel.manufacturers.status === "loading"
                        ? "Loading manufacturers…"
                        : "Select manufacturer"}
                    </option>
                    {addPanel.manufacturers.items.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </ChevronSelect>
                </div>
                <div>
                  <label className={lbl}>Date Created</label>
                  <input
                    type="date"
                    value={formData.dateCreated}
                    onChange={(e) => updateField("dateCreated", e.target.value)}
                    className={field}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="min-w-0">
                  <label className={lbl}>Fulfilment Date</label>
                  <input
                    type="date"
                    value={formData.fulfilmentDate}
                    onChange={(e) =>
                      updateField("fulfilmentDate", e.target.value)
                    }
                    className={twMerge(clsx(field, "min-w-0"))}
                  />
                </div>
                <div className="min-w-0">
                  <label className={lbl}>Serving Size</label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={formData.servingSize}
                      onChange={(e) =>
                        updateField("servingSize", e.target.value)
                      }
                      className={twMerge(clsx(field, "min-w-0 flex-1"))}
                    />
                    <ChevronSelect
                      wrapperClassName="w-16 shrink-0 min-w-0"
                      value={formData.servingUnit}
                      onChange={(e) =>
                        updateField("servingUnit", e.target.value)
                      }
                      className={twMerge(clsx(selectField, "pl-2 pr-8"))}
                      iconClassName="right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                    >
                      {INGREDIENT_UNITS.map((u) => (
                        <option key={u} value={u}>
                          {u}
                        </option>
                      ))}
                    </ChevronSelect>
                  </div>
                </div>
                <div className="min-w-0">
                  <label className={lbl}>Product Status</label>
                  <ChevronSelect
                    value={formData.status}
                    onChange={(e) =>
                      updateField(
                        "status",
                        e.target.value as AddProductFormValues["status"],
                      )
                    }
                    className={selectMuted}
                    iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <option value="active">Active</option>
                    <option value="concept">Concept</option>
                    <option value="discontinued">Discontinued</option>
                  </ChevronSelect>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className={lblSection}>Guava Product</label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.guavaEnabled}
                      onChange={(e) =>
                        updateField("guavaEnabled", e.target.checked)
                      }
                      className={chk}
                    />
                    <span className="text-sm text-slate-600">
                      Enable Guava features for this product
                    </span>
                  </label>
                </div>
                <div>
                  <label className={lblSection}>Additives</label>
                  <label className="flex cursor-pointer items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.hasAdditives}
                      onChange={(e) =>
                        updateField("hasAdditives", e.target.checked)
                      }
                      className={chk}
                    />
                    <span className="text-sm text-slate-600">
                      Product contains additives
                    </span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Guava Score</label>
                  <input
                    type="text"
                    value={formData.guavaScore}
                    onChange={(e) => updateField("guavaScore", e.target.value)}
                    placeholder="Enter Guava Score"
                    className={fieldBlue}
                  />
                </div>
                <div>
                  <label className={lbl}>UPC Code</label>
                  <input
                    type="text"
                    value={formData.upcCode}
                    onChange={(e) => updateField("upcCode", e.target.value)}
                    placeholder="Enter UPC Code"
                    className={fieldBlue}
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className={lbl}>Cost</label>
                  <input
                    type="number"
                    value={formData.cost}
                    onChange={(e) => updateField("cost", e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className={lbl}>Retail Cost</label>
                  <input
                    type="number"
                    value={formData.retailCost}
                    onChange={(e) => updateField("retailCost", e.target.value)}
                    className={field}
                  />
                </div>
                <div>
                  <label className={lbl}>Profit Margin (%)</label>
                  <input
                    type="text"
                    readOnly
                    value={costMarginDisplay}
                    aria-readonly
                    className={fieldReadonly}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={lbl}>Country</label>
                  <ChevronSelect
                    value={formData.country}
                    onChange={(e) => updateField("country", e.target.value)}
                    onOpenIntent={() => {
                      void dispatch(fetchAddProductCountriesLazy());
                    }}
                    disabled={addPanel.countries.status === "loading"}
                    className={selectField}
                    iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <option value="">
                      {addPanel.countries.status === "loading"
                        ? "Loading countries…"
                        : "Select country"}
                    </option>
                    {addPanel.countries.items.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </ChevronSelect>
                </div>
                <div>
                  <label className={lbl}>Currency</label>
                  <ChevronSelect
                    value={formData.currency}
                    onChange={(e) => updateField("currency", e.target.value)}
                    onOpenIntent={() => {
                      void dispatch(fetchAddProductCurrenciesLazy());
                    }}
                    disabled={addPanel.currencies.status === "loading"}
                    className={selectField}
                    iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                  >
                    <option value="">
                      {addPanel.currencies.status === "loading"
                        ? "Loading currencies…"
                        : "Select currency"}
                    </option>
                    {addPanel.currencies.items.map((o) => (
                      <option key={o.value} value={o.value}>
                        {o.label}
                      </option>
                    ))}
                  </ChevronSelect>
                </div>
              </div>

              <div>
                <label className={lbl}>Ingredients</label>
                {pickedIngredients.length > 0 && (
                  <div className="mb-2 rounded-lg border border-slate-200 bg-slate-50 p-2">
                    {pickedIngredients.map((row) => {
                      const label =
                        row.jf_display_name ||
                        (row.id.startsWith("custom:")
                          ? row.id.slice("custom:".length)
                          : row.id);
                      return (
                        <div
                          key={row.id}
                          className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 py-2 last:border-b-0"
                        >
                          <div className="min-w-0 flex-1 text-sm font-semibold text-slate-800">
                            {label}
                          </div>
                          <div className="flex shrink-0 items-center gap-2">
                            <input
                              type="number"
                              min={0}
                              step="0.01"
                              placeholder="Weight"
                              value={row.weight}
                              onChange={(e) =>
                                updateIngredientWeight(row.id, e.target.value)
                              }
                              className={twMerge(clsx(field, "w-24 min-w-0"))}
                            />
                            <ChevronSelect
                              wrapperClassName="w-[5.5rem] shrink-0"
                              value={row.unit}
                              onChange={(e) =>
                                updateIngredientUnit(row.id, e.target.value)
                              }
                              className={twMerge(clsx(selectField, "pl-2 pr-8"))}
                              iconClassName="right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                            >
                              {INGREDIENT_UNITS.map((u) => (
                                <option key={u} value={u}>
                                  {u}
                                </option>
                              ))}
                            </ChevronSelect>
                            <button
                              type="button"
                              className="p-1 text-slate-500 hover:text-slate-800"
                              aria-label="Remove ingredient"
                              onClick={() => removePickedIngredient(row.id)}
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="relative mt-2 min-w-0">
                  <div
                    className={twMerge(
                      clsx(
                        "flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5",
                        "focus-within:ring-2 focus-within:ring-blue-500",
                      ),
                    )}
                  >
                    <input
                      type="text"
                      className="min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-900 outline-none focus:ring-0"
                      placeholder="Search Ingredient to add..."
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      autoComplete="off"
                    />
                    {ingredientInput.trim().length > 0 ? (
                      <button
                        type="button"
                        className="shrink-0 p-0.5"
                        aria-label="Clear search"
                        onClick={() => {
                          setIngredientInput("");
                          dispatch(clearAddProductIngredientSearch());
                        }}
                      >
                        <X className="h-4 w-4 cursor-pointer text-slate-400 hover:text-slate-600" />
                      </button>
                    ) : null}
                  </div>
                  {ingredientError ? (
                    <div className="mt-1 text-sm text-red-600">
                      {ingredientError}
                    </div>
                  ) : null}
                  {addPanel.ingredients.status === "loading" && (
                    <p className="mt-1 text-xs text-slate-500">Searching…</p>
                  )}
                  {addPanel.ingredients.list.length > 0 && (
                    <ul
                      className="absolute z-20 mt-1 max-h-48 w-full overflow-auto rounded-lg border border-slate-200 bg-white shadow-lg"
                      role="listbox"
                    >
                      {addPanel.ingredients.list.map((row) => {
                        const id = String(row.id);
                        const taken = pickedIngredients.some(
                          (x) => x.id === id,
                        );
                        return (
                          <li key={id}>
                            <button
                              type="button"
                              disabled={taken}
                              className="w-full px-3 py-2 text-left text-sm hover:bg-slate-50 disabled:opacity-40"
                              onClick={() => addPickedIngredient(row)}
                            >
                              <div className="font-semibold text-slate-800">
                                {row.jf_display_name || id}
                              </div>
                              {(() => {
                                const m = (
                                  row as unknown as Record<string, unknown>
                                ).manufacturer as { name?: string } | undefined;
                                return m?.name ? (
                                  <div className="text-xs text-slate-500">
                                    {m.name}
                                  </div>
                                ) : null;
                              })()}
                            </button>
                          </li>
                        );
                      })}
                      {addPanel.ingredients.pagination.pages >
                        addPanel.ingredients.pagination.page && (
                        <li className="border-t border-slate-200">
                          <button
                            type="button"
                            className="w-full px-3 py-2 text-sm text-blue-600 hover:bg-slate-50"
                            onClick={loadMoreIngredients}
                          >
                            Load more
                          </button>
                        </li>
                      )}
                    </ul>
                  )}
                  {addPanel.ingredients.status !== "loading" &&
                    debouncedIngredient.trim().length > 0 &&
                    addPanel.ingredients.list.length === 0 && (
                      <div className="mt-2 text-sm text-slate-600">
                        Ingredient <strong>{debouncedIngredient.trim()}</strong>{" "}
                        does not exist.{" "}
                        <button
                          type="button"
                          className="text-blue-600 underline hover:text-blue-800"
                          onClick={() =>
                            addCustomIngredient(debouncedIngredient)
                          }
                        >
                          Create it?
                        </button>
                      </div>
                    )}
                </div>
              </div>

              <div className="min-w-0">
                <label className={lbl}>Product Objectives</label>
                <ChevronSelect
                  value={formData.objectives[0] ?? ""}
                  onChange={(e) =>
                    updateField(
                      "objectives",
                      e.target.value ? [e.target.value] : [],
                    )
                  }
                  className={selectField}
                  iconClassName="right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
                >
                  <option value="">Select Product Objectives</option>
                  {PRODUCT_OBJECTIVE_OPTIONS.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </ChevronSelect>
              </div>

              <div>
                <label className={lbl}>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => updateField("notes", e.target.value)}
                  placeholder="Optional notes..."
                  className={twMerge(clsx(field, "resize-none"))}
                  rows={4}
                />
              </div>

              <p className="text-sm text-slate-500">
                These preferences will help tailor our product suggestions and
                filter your live searching whilst using the app.
              </p>
            </div>

            <div className="flex justify-end border-t border-slate-200 p-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-lg bg-emerald-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {submitting ? "Saving..." : "Save Detail"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
