"use client";

import { useEffect, useState } from "react";
import { Leaf, Save } from "lucide-react";
import SidePanel from "@/components/common/SidePanel";
import {
    ingredientService,
    buildAddIngredientPayload,
    type AddIngredientFormValues,
} from "@/services/ingredient-service";
import { notifyApiSuccessToast } from "@/utils/showToast";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { fetchIngredientAddFormOptions } from "@/redux/ingredient/ingredients-thunks";
import { getErrorMessage, isValidMongoObjectId } from "@/utils/commonFunctions";
import { ChevronSelect } from "@/components/common/ChevronSelect";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

type AddIngredientPanelProps = {
    open: boolean;
    onClose: () => void;
    onCreated?: () => void;
};

function todayYmd(): string {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
}

function getInitialValues(): AddIngredientFormValues {
    return {
        company_id: "",
        jfDisplayName: "",
        name: "",
        scientificName: "",
        variety: "",
        manufacturer: "",
        country: "",
        servingSize: "",
        price: "",
        priceUnit: "kg",
        storageCondition: "",
        seasonality: "",
        created_date: todayYmd(),
        isAdditive: false,
        isUpcycled: "",
        nutritionalSummary: "",
        claim: "",
        notes: "",
    };
}

export default function AddIngredientPanel({
    open,
    onClose,
    onCreated,
}: AddIngredientPanelProps) {
    const dispatch = useAppDispatch();
    const profile = useAppSelector((s) => s.user.details);
    const addForm = useAppSelector((s) => s.ingredient.addFormOptions);
    const [values, setValues] = useState<AddIngredientFormValues>(getInitialValues());
    const [submitting, setSubmitting] = useState(false);
    const [errors, setErrors] = useState<Partial<Record<keyof AddIngredientFormValues, string>>>({});
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        if (!open) return;
        console.log("[AddIngredientPanel] open — fetch add form options");
        void dispatch(fetchIngredientAddFormOptions());
    }, [open, dispatch]);

    const countrySelectValue =
        addForm.countries.find((c) => c.label === values.country.trim())?.value ?? "";

    const setField = <K extends keyof AddIngredientFormValues>(
        key: K,
        v: AddIngredientFormValues[K],
    ) => {
        setValues((prev) => ({ ...prev, [key]: v }));
    };

    const validate = (): boolean => {
        const next: typeof errors = {};
        if (!values.jfDisplayName.trim()) next.jfDisplayName = "JF display name is required";
        if (!values.name.trim()) next.name = "Name is required";
        if (values.company_id.trim() && !isValidMongoObjectId(values.company_id)) {
            next.company_id = "Select a company from the list, or leave blank to use your profile company.";
        }
        setErrors(next);
        return Object.keys(next).length === 0;
    };

    const resetAndClose = () => {
        console.log("[AddIngredientPanel] reset and close");
        setValues(getInitialValues());
        setErrors({});
        setServerError("");
        onClose();
    };

    const handleSubmit = async () => {
        if (!validate()) return;
        setServerError("");
        setSubmitting(true);
        try {
            const payload = buildAddIngredientPayload(values, profile as Record<string, unknown> | null);
            console.log("[AddIngredientPanel] submit", {
                jfDisplayName: payload.jfDisplayName,
                name: payload.name,
            });
            await ingredientService.addIngredient(payload);
            notifyApiSuccessToast({ message: "Ingredient added" });
            onCreated?.();
            resetAndClose();
        } catch (e) {
            console.log("[AddIngredientPanel] submit failed", e);
            setServerError(getErrorMessage(e, "Failed to add ingredient. Try again."));
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <SidePanel
            open={open}
            onClose={resetAndClose}
            title="Add Ingredient"
            icon={<Leaf className="h-5 w-5 text-green-600" />}
            iconWrapperClassName="p-2 bg-green-100 rounded-lg"
            width="max-w-2xl"
            footer={
                <button
                    type="button"
                    onClick={handleSubmit}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 bg-emerald-500 text-white text-sm font-medium rounded-lg hover:bg-emerald-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                    <Save className="h-4 w-4" />
                    {submitting ? "Saving..." : "Save Ingredient"}
                </button>
            }
        >
            <div className="space-y-6">
                {serverError && (
                    <div className="rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {serverError}
                    </div>
                )}

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Select company
                    </label>
                    <ChevronSelect
                        value={values.company_id}
                        onChange={(e) => setField("company_id", e.target.value)}
                        disabled={addForm.status === "loading"}
                        className={twMerge(
                            clsx(
                                "py-2.5",
                                errors.company_id ? "border-red-300 focus:ring-red-200" : "",
                            ),
                        )}
                    >
                        <option value="">
                            {addForm.status === "loading"
                                ? "Loading companies…"
                                : "Use profile company"}
                        </option>
                        {addForm.companies.map((o) => (
                            <option key={o.value} value={o.value}>
                                {o.label}
                            </option>
                        ))}
                    </ChevronSelect>
                    {errors.company_id && (
                        <p className="text-xs text-red-600 mt-1">{errors.company_id}</p>
                    )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-1">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            JF display name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={values.jfDisplayName}
                            onChange={(e) => setField("jfDisplayName", e.target.value)}
                            placeholder="e.g. Organic Tomato"
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                errors.jfDisplayName ? "border-red-300" : "border-slate-200"
                            }`}
                        />
                        {errors.jfDisplayName && (
                            <p className="text-xs text-red-600 mt-1">{errors.jfDisplayName}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Name<span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            value={values.name}
                            onChange={(e) => setField("name", e.target.value)}
                            placeholder="Common name"
                            className={`w-full px-3 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm ${
                                errors.name ? "border-red-300" : "border-slate-200"
                            }`}
                        />
                        {errors.name && (
                            <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                        )}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Scientific name
                        </label>
                        <input
                            type="text"
                            value={values.scientificName}
                            onChange={(e) => setField("scientificName", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Variety
                        </label>
                        <input
                            type="text"
                            value={values.variety}
                            onChange={(e) => setField("variety", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Manufacturer
                        </label>
                        <input
                            type="text"
                            value={values.manufacturer}
                            onChange={(e) => setField("manufacturer", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Country
                        </label>
                        <ChevronSelect
                            value={countrySelectValue}
                            onChange={(e) => {
                                const v = e.target.value;
                                const opt = addForm.countries.find((c) => c.value === v);
                                setField("country", opt?.label ?? v);
                            }}
                            disabled={addForm.status === "loading"}
                            className="py-2.5"
                        >
                            <option value="">
                                {addForm.status === "loading" ? "Loading countries…" : "Select country"}
                            </option>
                            {addForm.countries.map((o) => (
                                <option key={o.value} value={o.value}>
                                    {o.label}
                                </option>
                            ))}
                        </ChevronSelect>
                    </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="min-w-0">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Serving size
                        </label>
                        <input
                            type="text"
                            value={values.servingSize}
                            onChange={(e) => setField("servingSize", e.target.value)}
                            placeholder="e.g. 100g"
                            className="w-full min-w-0 px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div className="min-w-0">
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Price
                        </label>
                        <div className="flex gap-2 min-w-0">
                            <input
                                type="number"
                                value={values.price}
                                onChange={(e) => setField("price", e.target.value)}
                                className="min-w-0 flex-1 px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <ChevronSelect
                                wrapperClassName="w-24 shrink-0"
                                value={values.priceUnit}
                                onChange={(e) => setField("priceUnit", e.target.value)}
                                className="py-2.5 pl-2 pr-8 text-sm"
                                iconClassName="right-1.5 h-3 w-3"
                            >
                                <option>kg</option>
                                <option>g</option>
                                <option>lb</option>
                                <option>l</option>
                            </ChevronSelect>
                        </div>
                    </div>
                </div>
                <div className="min-w-0">
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Storage condition
                    </label>
                    <input
                        type="text"
                        value={values.storageCondition}
                        onChange={(e) => setField("storageCondition", e.target.value)}
                        placeholder="Cool, dry place"
                        className="w-full min-w-0 px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    />
                </div>

                <div className="grid grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Seasonality
                        </label>
                        <input
                            type="text"
                            value={values.seasonality}
                            onChange={(e) => setField("seasonality", e.target.value)}
                            placeholder="e.g. Year round"
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Created date
                        </label>
                        <input
                            type="date"
                            value={values.created_date}
                            onChange={(e) => setField("created_date", e.target.value)}
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Upcycled
                        </label>
                        <ChevronSelect
                            value={values.isUpcycled}
                            onChange={(e) => setField("isUpcycled", e.target.value)}
                            className="py-2.5"
                        >
                            <option value="">Not specified</option>
                            <option value="true">Yes</option>
                            <option value="false">No</option>
                        </ChevronSelect>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">
                            Additive
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={values.isAdditive}
                                onChange={(e) => setField("isAdditive", e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-slate-600">
                                This ingredient is an additive
                            </span>
                        </label>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1.5">
                            Claim
                        </label>
                        <input
                            type="text"
                            value={values.claim}
                            onChange={(e) => setField("claim", e.target.value)}
                            placeholder="Organic, Non-GMO..."
                            className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Nutritional summary
                    </label>
                    <textarea
                        value={values.nutritionalSummary}
                        onChange={(e) => setField("nutritionalSummary", e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                        rows={3}
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1.5">
                        Notes
                    </label>
                    <textarea
                        value={values.notes}
                        onChange={(e) => setField("notes", e.target.value)}
                        className="w-full px-3 py-2.5 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm resize-none"
                        rows={3}
                    />
                </div>
            </div>
        </SidePanel>
    );
}
