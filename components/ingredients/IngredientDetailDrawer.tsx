"use client";

// Full ingredient detail view — rendered either as a side drawer (catalog row click) or as a standalone page (`/ingredients/[id]`).
import { useMemo, useState } from "react";
import {
    Apple,
    ArrowLeft,
    Award,
    BarChart3,
    ChevronDown,
    ChevronUp,
    DollarSign,
    Download,
    Droplets,
    ExternalLink,
    FileCheck,
    FileText,
    Globe,
    Leaf,
    Package,
    Scale,
    Shield,
    ShieldAlert,
    Star,
    Timer,
    TrendingDown,
    TrendingUp,
    Zap,
} from "lucide-react";
import type { IIngredientCatalogRow } from "@/interfaces/ingredient";

type IngredientDetailDrawerProps = {
    ingredient: IIngredientCatalogRow | null;
    onClose: () => void;
    /** When true, render as a normal scrollable page (not a fixed overlay). */
    asPage?: boolean;
};

function seedFromId(id: string): number {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(h);
}

const countries = [
    { code: "US", name: "United States", flag: "🇺🇸" },
    { code: "EU", name: "European Union", flag: "🇪🇺" },
    { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
    { code: "CA", name: "Canada", flag: "🇨🇦" },
    { code: "AU", name: "Australia", flag: "🇦🇺" },
];

export default function IngredientDetailDrawer({
    ingredient,
    onClose,
    asPage = false,
}: IngredientDetailDrawerProps) {
    const [selectedCountry, setSelectedCountry] = useState("US");
    const [nutritionExpanded, setNutritionExpanded] = useState(true);
    const [sustainabilityExpanded, setSustainabilityExpanded] = useState(false);
    const [costExpanded, setCostExpanded] = useState(false);
    const [regulatoryExpanded, setRegulatoryExpanded] = useState(false);

    const nutritionData = useMemo(() => {
        if (!ingredient) return { kCals: 0, totalFat: 0, protein: 0, sodium: 0, totalCarbohydrate: 0 };
        const s = seedFromId(ingredient.id);
        return {
            kCals: 200 + (s % 180),
            totalFat: 1 + (s % 12),
            protein: 1 + (s % 20),
            sodium: s % 500,
            totalCarbohydrate: 10 + (s % 70),
        };
    }, [ingredient]);

    if (!ingredient) return null;

    const status: "active" | "concept" | "flagged" = ingredient.flagged
        ? "flagged"
        : ingredient.activeProducts > 0
          ? "active"
          : "concept";
    const statusLabel = status.charAt(0).toUpperCase() + status.slice(1);
    /* Mock: supplier audit copy — hidden per product request
    const alertText = ingredient.flagged ? "Supplier audit scheduled" : null;
    */
    const trendUp = ingredient.trendPct > 0 && ingredient.trendPositive;
    const trendDown = ingredient.trendPct > 0 && !ingredient.trendPositive;
    const selectedCountryData = countries.find((c) => c.code === selectedCountry);

    return (
        <div
            className={
                asPage
                    ? "min-h-0 w-full bg-white"
                    : "fixed inset-0 z-50 overflow-y-auto bg-white"
            }
        >
            <div
                className={`border-b border-slate-200 bg-white ${
                    asPage ? "" : "sticky top-0 z-10"
                }`}
            >
                <div className="px-6 py-4 max-w-7xl mx-auto">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition-colors mb-4"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Ingredients
                    </button>
                    <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="flex items-center gap-4 min-w-0">
                            <div className="w-16 h-16 rounded-xl bg-linear-to-br from-green-100 to-emerald-50 border border-green-200 flex items-center justify-center shrink-0">
                                <Leaf className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="min-w-0">
                                <div className="flex items-center gap-3 flex-wrap">
                                    <h1 className="text-2xl font-bold text-slate-800 truncate">
                                        {ingredient.name}
                                    </h1>
                                    {ingredient.starred && (
                                        <Star className="h-5 w-5 text-yellow-400 fill-yellow-400 shrink-0" />
                                    )}
                                    <span
                                        className={`text-xs px-2.5 py-1 rounded-full font-medium shrink-0 ${
                                            status === "active"
                                                ? "bg-green-100 text-green-700"
                                                : status === "flagged"
                                                  ? "bg-red-100 text-red-700"
                                                  : "bg-amber-100 text-amber-700"
                                        }`}
                                    >
                                        {statusLabel}
                                    </span>
                                </div>
                                <p className="text-sm text-slate-500 mt-1">
                                    {ingredient.category} · {ingredient.form} · {ingredient.origin}
                                </p>
                                <p className="text-xs text-slate-400 mt-0.5">Catalog entry</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                            <button
                                type="button"
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <Download className="h-4 w-4 text-slate-500" />
                            </button>
                            <button
                                type="button"
                                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                            >
                                <ExternalLink className="h-4 w-4 text-slate-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* {alertText && (
                <div className="max-w-7xl mx-auto px-6">
                    <div className="mt-4 flex items-start gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
                        <div>
                            <p className="font-medium text-red-800">Supply Alert</p>
                            <p className="text-sm text-red-700 mt-0.5">{alertText}</p>
                        </div>
                    </div>
                </div>
            )} */}

            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
                <div className="space-y-6">
                    <div className="aspect-square max-h-80 rounded-2xl bg-linear-to-br from-green-50 via-emerald-50 to-teal-50 border border-green-100 flex items-center justify-center overflow-hidden">
                        <div className="text-center px-4">
                            <div className="w-32 h-32 mx-auto rounded-2xl bg-white/60 border border-green-200/50 flex items-center justify-center shadow-sm">
                                <Leaf className="h-16 w-16 text-green-500" />
                            </div>
                            <p className="text-sm text-green-600 mt-4 font-medium">{ingredient.name}</p>
                            <p className="text-xs text-green-500 mt-1">{ingredient.form} form</p>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-2">
                            Region
                        </label>
                        <div className="relative">
                            <select
                                value={selectedCountry}
                                onChange={(e) => setSelectedCountry(e.target.value)}
                                className="w-full pl-10 pr-10 py-3 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white font-medium"
                            >
                                {countries.map((country) => (
                                    <option key={country.code} value={country.code}>
                                        {country.flag} {country.name}
                                    </option>
                                ))}
                            </select>
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg">
                                {selectedCountryData?.flag}
                            </span>
                            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 pointer-events-none" />
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-6">
                        <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-4">
                            <FileText className="h-4 w-4 text-slate-400" />
                            Ingredient info
                        </h3>
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Documents
                        </h4>
                        <div className="flex gap-3 flex-wrap">
                            <button
                                type="button"
                                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                <FileText className="h-4 w-4" />
                                <span className="text-sm font-medium">Datasheet</span>
                            </button>
                            <button
                                type="button"
                                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                <FileCheck className="h-4 w-4" />
                                <span className="text-sm font-medium">Claim</span>
                            </button>
                            <button
                                type="button"
                                className="flex-1 min-w-[100px] flex items-center justify-center gap-2 px-4 py-3 border border-blue-200 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors"
                            >
                                <Scale className="h-4 w-4" />
                                <span className="text-sm font-medium">Regulation</span>
                            </button>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Allergen Statements
                        </h4>
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg w-fit">
                            <ShieldAlert className="h-4 w-4 text-red-400" />
                            <span className="text-sm text-red-600 font-medium">Not Available</span>
                        </div>
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Certification
                        </h4>
                        {ingredient.certifications.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {ingredient.certifications.map((cert) => (
                                    <span
                                        key={cert}
                                        className="px-3 py-1.5 text-sm bg-green-50 text-green-700 border border-green-200 rounded-lg font-medium flex items-center gap-1.5"
                                    >
                                        <Award className="h-3.5 w-3.5" />
                                        {cert}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg w-fit">
                                <ShieldAlert className="h-4 w-4 text-red-400" />
                                <span className="text-sm text-red-600 font-medium">Not Available</span>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-slate-100 pt-5">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Shelf Life
                        </h4>
                        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-lg w-fit">
                            <Timer className="h-4 w-4 text-red-400" />
                            <span className="text-sm text-red-600 font-medium">Not Available</span>
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="grid grid-cols-3 gap-4">
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-orange-100 rounded-lg">
                                    <Apple className="h-4 w-4 text-orange-500" />
                                </div>
                                <span className="text-xs text-slate-500 font-medium">Nutrition</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{ingredient.nutritionScore}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-green-100 rounded-lg">
                                    <Leaf className="h-4 w-4 text-green-500" />
                                </div>
                                <span className="text-xs text-slate-500 font-medium">Sustainability</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">{ingredient.sustainabilityScore}</p>
                        </div>
                        <div className="bg-slate-50 rounded-xl p-4">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="p-1.5 bg-blue-100 rounded-lg">
                                    <DollarSign className="h-4 w-4 text-blue-500" />
                                </div>
                                <span className="text-xs text-slate-500 font-medium">Cost</span>
                            </div>
                            <p className="text-2xl font-bold text-slate-800">
                                {ingredient.price > 0 ? `$${ingredient.price.toFixed(2)}` : "N/A"}
                            </p>
                        </div>
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setNutritionExpanded(!nutritionExpanded)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <BarChart3 className="h-5 w-5 text-orange-500" />
                                </div>
                                <span className="font-semibold text-slate-800">Nutrition analysis</span>
                            </div>
                            {nutritionExpanded ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                        {nutritionExpanded && (
                            <div className="p-4 border-t border-slate-200">
                                <div className="grid grid-cols-2 gap-x-8 gap-y-3">
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-1 text-sm">
                                            <span className="text-slate-600">kCals</span>
                                            <span className="font-semibold text-violet-600">
                                                {nutritionData.kCals}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 text-sm">
                                            <span className="text-slate-600">Total fat</span>
                                            <span className="font-semibold text-violet-600">
                                                {nutritionData.totalFat}g
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 text-sm">
                                            <span className="text-slate-600">Protein</span>
                                            <span className="font-semibold text-violet-600">
                                                {nutritionData.protein}g
                                            </span>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center py-1 text-sm">
                                            <span className="text-slate-600">Sodium</span>
                                            <span className="font-semibold text-violet-600">
                                                {nutritionData.sodium}mg
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center py-1 text-sm">
                                            <span className="text-slate-600">Total carbohydrate</span>
                                            <span className="font-semibold text-violet-600">
                                                {nutritionData.totalCarbohydrate}g
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setSustainabilityExpanded(!sustainabilityExpanded)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Droplets className="h-5 w-5 text-green-500" />
                                </div>
                                <span className="font-semibold text-slate-800">Sustainability analysis</span>
                            </div>
                            {sustainabilityExpanded ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                        {sustainabilityExpanded && (
                            <div className="p-4 border-t border-slate-200">
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-green-50 rounded-lg p-3">
                                        <p className="text-xs text-slate-500">Carbon Footprint</p>
                                        <p className="text-lg font-semibold text-green-700 mt-1">2.4 kg CO2e</p>
                                    </div>
                                    <div className="bg-blue-50 rounded-lg p-3">
                                        <p className="text-xs text-slate-500">Water Usage</p>
                                        <p className="text-lg font-semibold text-blue-700 mt-1">120 L/kg</p>
                                    </div>
                                    <div className="bg-amber-50 rounded-lg p-3">
                                        <p className="text-xs text-slate-500">Land Use</p>
                                        <p className="text-lg font-semibold text-amber-700 mt-1">3.2 m²/kg</p>
                                    </div>
                                    <div className="bg-purple-50 rounded-lg p-3">
                                        <p className="text-xs text-slate-500">Overall Score</p>
                                        <p className="text-lg font-semibold text-purple-700 mt-1">
                                            {ingredient.sustainabilityScore}/100
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setCostExpanded(!costExpanded)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Globe className="h-5 w-5 text-blue-500" />
                                </div>
                                <span className="font-semibold text-slate-800">Cost prediction</span>
                            </div>
                            {costExpanded ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                        {costExpanded && (
                            <div className="p-4 border-t border-slate-200 space-y-4">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Current Price</span>
                                    <span className="text-lg font-semibold text-slate-800">
                                        ${ingredient.price.toFixed(2)}/{ingredient.unit}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-slate-600">Trend</span>
                                    <span
                                        className={`text-sm font-semibold ${
                                            trendUp ? "text-red-600" : trendDown ? "text-green-600" : "text-slate-600"
                                        }`}
                                    >
                                        {ingredient.trendPct !== 0
                                            ? `${trendUp ? "+" : trendDown ? "-" : ""}${Math.abs(ingredient.trendPct).toFixed(1)}%`
                                            : "—"}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {trendUp ? (
                                        <TrendingUp className="h-4 w-4 text-red-500" />
                                    ) : trendDown ? (
                                        <TrendingDown className="h-4 w-4 text-green-500" />
                                    ) : null}
                                </div>
                                <div className="pt-3 border-t border-slate-100 text-xs text-slate-500">
                                    Origin: {ingredient.origin}
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border border-slate-200 rounded-xl overflow-hidden">
                        <button
                            type="button"
                            onClick={() => setRegulatoryExpanded(!regulatoryExpanded)}
                            className="w-full flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-slate-100">
                                    <Shield className="h-5 w-5 text-slate-500" />
                                </div>
                                <span className="font-semibold text-slate-800">Regulatory compliance</span>
                                <span className="text-xs px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                                    Pending
                                </span>
                            </div>
                            {regulatoryExpanded ? (
                                <ChevronUp className="h-5 w-5 text-slate-400" />
                            ) : (
                                <ChevronDown className="h-5 w-5 text-slate-400" />
                            )}
                        </button>
                        {regulatoryExpanded && (
                            <div className="p-4 border-t border-slate-200 bg-white text-sm text-slate-600">
                                Regional compliance checks from the Journey Foods dashboard can be wired
                                when your API exposes them.
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4">
                        <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
                            Product Usage
                        </h4>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Package className="h-5 w-5 text-slate-400" />
                                <div>
                                    <p className="text-2xl font-bold text-slate-800">
                                        {ingredient.activeProducts + ingredient.conceptProducts}
                                    </p>
                                    <p className="text-xs text-slate-500">Total products</p>
                                </div>
                            </div>
                            <div className="flex gap-4 text-sm">
                                <div className="text-center">
                                    <p className="font-semibold text-green-600">{ingredient.activeProducts}</p>
                                    <p className="text-xs text-slate-500">Active</p>
                                </div>
                                <div className="text-center">
                                    <p className="font-semibold text-amber-600">{ingredient.conceptProducts}</p>
                                    <p className="text-xs text-slate-500">Concept</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-lg hover:bg-slate-700 transition-colors"
                        >
                            <Zap className="h-4 w-4" />
                            Find Alternatives
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2.5 border border-slate-200 text-sm font-medium text-slate-700 rounded-lg hover:bg-slate-50 transition-colors"
                        >
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
