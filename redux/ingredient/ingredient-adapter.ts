import type { IIngredientCatalogRow, ISupplierIngredient } from "@/interfaces/ingredient";

function hash(id: string): number {
    let h = 0;
    for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
    return Math.abs(h);
}

function inferForm(name: string, claim: string | undefined): string {
    const n = `${name} ${claim ?? ""}`.toLowerCase();
    if (/powder/.test(n)) return "Powder";
    if (/liquid|extract|concentrate/.test(n)) return "Liquid";
    if (/puree|paste/.test(n)) return "Puree";
    if (/granule|granulate/.test(n)) return "Granule";
    if (/crystal/.test(n)) return "Crystal";
    return "Powder";
}

function inferCategory(claim: string | undefined): string {
    const c = (claim ?? "").toLowerCase();
    if (/beverage|drink|water|juice|tea/.test(c)) return "Beverages";
    if (/cosmetic|skin|beauty/.test(c)) return "Cosmetic";
    if (/household|cleaning|detergent/.test(c)) return "Household";
    if (/supplement|vitamin|mineral/.test(c)) return "Supplement";
    if (c) return "Food";
    return "Food";
}

export function ingredientToCatalogRow(row: ISupplierIngredient): IIngredientCatalogRow {
    const h = hash(row.id || "x");
    const name = row.jf_display_name || "Unnamed Ingredient";
    const nutrition = Math.round(Number(row.nutrition_score ?? 70 + (h % 25)));
    const sustain = Math.round(Number(row.sustainability_score ?? 65 + (h % 30)));
    const cost = Math.round(Number(row.cost_score ?? 60 + (h % 35)));
    const overall = Math.round(
        Number(row.overall_score ?? Math.round((nutrition + sustain + cost) / 3)),
    );
    const certifications = Array.isArray(row.certifications)
        ? row.certifications
              .map((c) => {
                  if (typeof c === "string") return c.trim();
                  if (c && typeof c === "object") {
                      const o = c as Record<string, unknown>;
                      return String(o.name || o.title || o.label || "").trim();
                  }
                  return "";
              })
              .filter(Boolean)
              .slice(0, 4)
        : [];

    const flagged = Boolean(row.supplier_audit_scheduled) || overall < 50;

    return {
        id: row.id,
        name,
        category: inferCategory(row.claim),
        form: inferForm(name, row.claim),
        nutritionScore: nutrition,
        sustainabilityScore: sustain,
        costScore: cost,
        overallScore: overall,
        price: Number(row.estimated_price ?? 0),
        unit: "kg",
        activeProducts: Number(row.active_count ?? 0),
        conceptProducts: Number(row.concept_count ?? 0),
        origin: row.origin_country || "Unknown",
        starred: Boolean(row.is_starred),
        flagged,
        trendPct: Number(row.trend_pct ?? 0),
        trendPositive:
            typeof row.trend_positive === "boolean" ? row.trend_positive : h % 3 !== 0,
        certifications,
    };
}
