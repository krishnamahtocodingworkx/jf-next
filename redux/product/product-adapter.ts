import type { IProductCatalogRow } from "@/interfaces/product";

function hashSeed(id: string, index: number): number {
    const s = `${id}#${index}`;
    let h = 0;
    for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
    return Math.abs(h);
}

function readNumber(raw: Record<string, unknown>, keys: string[]): number | undefined {
    for (const k of keys) {
        const v = raw[k];
        if (typeof v === "number" && Number.isFinite(v)) return v;
        if (typeof v === "string" && v.trim() !== "") {
            const n = Number(v);
            if (!Number.isNaN(n) && Number.isFinite(n)) return n;
        }
    }
    return undefined;
}

function readString(raw: Record<string, unknown>, keys: string[]): string {
    for (const k of keys) {
        const v = raw[k];
        if (typeof v === "string" && v.trim()) return v.trim();
    }
    return "";
}

function categoryLabel(raw: Record<string, unknown>): string {
    const c = raw.category;
    if (typeof c === "string" && c.trim()) return c.trim();
    if (c && typeof c === "object") {
        const o = c as Record<string, unknown>;
        const t = readString(o, ["name", "title", "label"]);
        if (t) return t;
    }
    const sub = readString(raw, ["subcategory", "sub_category", "product_subcategory", "type"]);
    if (sub) return sub;
    const pt = raw.product_type;
    if (pt && typeof pt === "object") {
        const o = pt as Record<string, unknown>;
        const t = readString(o, ["name", "title", "label"]);
        if (t) return t;
    }
    return "";
}

function parseTags(raw: Record<string, unknown>): string[] {
    const out: string[] = [];
    const pushMany = (arr: unknown) => {
        if (!Array.isArray(arr)) return;
        for (const x of arr) {
            if (typeof x === "string" && x.trim()) out.push(x.trim());
            else if (x && typeof x === "object") {
                const o = x as Record<string, unknown>;
                const n = readString(o, ["name", "title", "label"]);
                if (n) out.push(n);
            }
        }
    };
    pushMany(raw.tags);
    pushMany(raw.labels);
    pushMany(raw.claims);
    pushMany(raw.certifications);
    return Array.from(new Set(out)).slice(0, 8);
}

const TAG_POOL = [
    ["Vegan", "Non-GMO"],
    ["Gluten-Free", "Low Sugar"],
    ["Electrolytes", "Non-GMO"],
    ["Omega-3", "Vegan"],
];

/** Map API / overview product shape to catalog card model.  */
export function apiProductToCatalogRow(
    raw: Record<string, unknown>,
    index: number,
): IProductCatalogRow {
    const id = String(raw.id ?? raw._id ?? index);
    const h = hashSeed(id, index);
    const name = String(raw.name ?? "Product");
    const brandName =
        raw.brand && typeof raw.brand === "object" && (raw.brand as { name?: string }).name
            ? String((raw.brand as { name?: string }).name)
            : readString(raw, ["brand_name", "brandName"]) || "Brand";

    const cat = categoryLabel(raw);
    const subline = cat ? `${brandName} · ${cat}` : `${brandName}`;

    const nutrition =
        readNumber(raw, ["nutritionScore", "nutrition_score", "nutrition"]) ?? 78 + (h % 15);
    const sustain =
        readNumber(raw, [
            "sustainabilityScore",
            "sustainability_score",
            "sustain_score",
            "sustain",
        ]) ?? 76 + (h % 16);
    const cost =
        readNumber(raw, ["costScore", "cost_score", "cost", "commercial_score"]) ?? 74 + (h % 18);

    const overallFromApi = readNumber(raw, [
        "overallScore",
        "overall_score",
        "portfolio_score",
        "guava_score",
        "average_score",
        "score",
    ]);
    const overallScore =
        overallFromApi != null
            ? Math.min(100, Math.round(overallFromApi))
            : Math.min(100, Math.round((nutrition + sustain + cost) / 3));

    const priceNum =
        readNumber(raw, ["retail_price", "price", "unit_price", "selling_price", "markup"]) ??
        2.5 + (h % 80) / 10;

    const trendPct =
        readNumber(raw, [
            "trend_pct",
            "trendPct",
            "change_percent",
            "price_change_pct",
            "delta_pct",
        ]) ?? ((h % 25) + 5) / 10;
    const trendStableRaw = raw.trend_stable ?? raw.trendStable;
    const trendStable =
        trendStableRaw === true ||
        trendStableRaw === "true" ||
        String(trendStableRaw).toLowerCase() === "stable" ||
        (trendPct === 0 && readString(raw, ["trend_label"]) === "Stable");

    let trendPositive = h % 3 !== 0;
    const tp = raw.trend_positive ?? raw.trendPositive;
    if (typeof tp === "boolean") trendPositive = tp;
    else if (readString(raw, ["trend_direction"]) === "down") trendPositive = false;
    else if (readString(raw, ["trend_direction"]) === "up") trendPositive = true;

    const tags = parseTags(raw);
    const tagList = tags.length ? tags : TAG_POOL[h % TAG_POOL.length];

    const ps = raw.product_status ?? raw.active ?? raw.retail;
    const product_status =
        ps === true ||
        ps === "true" ||
        String(ps) === "1" ||
        String(ps).toLowerCase() === "active"
            ? true
            : ps === false ||
                ps === "false" ||
                String(ps) === "0" ||
                String(ps).toLowerCase() === "concept" ||
                String(ps).toLowerCase() === "inactive"
              ? false
              : h % 2 === 0;

    const starred =
        raw.starred === true ||
        raw.is_guava === true ||
        raw.featured === true ||
        readString(raw, ["badge"]) === "star" ||
        h % 7 === 1;

    const regulatoryWarning =
        readString(raw, [
            "regulatory_warning",
            "regulatoryWarning",
            "compliance_message",
            "warning_message",
        ]) || undefined;

    return {
        id,
        name,
        brandName,
        image_uri: typeof raw.image_uri === "string" ? raw.image_uri : undefined,
        subline,
        tags: tagList,
        overallScore,
        nutrition: Math.round(Number(nutrition)),
        sustain: Math.round(Number(sustain)),
        cost: Math.round(Number(cost)),
        price: Number(priceNum),
        trendPct: Number(trendPct),
        trendPositive,
        trendStable: Boolean(trendStable),
        product_status,
        starred: Boolean(starred),
        regulatoryWarning,
    };
}
