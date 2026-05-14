import axios from "axios";
import type { SelectOption } from "@/utils/model";
import type { IProductCatalogRow } from "@/interfaces/product";
import type { IIngredientCatalogRow, ISupplierIngredient } from "@/interfaces/ingredient";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function coerceToMessage(value: unknown): string | undefined {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (Array.isArray(value)) {
    const parts = value
      .map((item) => {
        if (typeof item === "string") return item;
        if (isRecord(item) && typeof item.message === "string") return item.message;
        return "";
      })
      .filter(Boolean);
    if (parts.length) return parts.join(", ");
  }
  return undefined;
}

/** Parses typical JSON API envelopes for human-readable message fields (success + error bodies). */
export function parseBackendMessageBody(data: unknown): string | undefined {
  if (!isRecord(data)) return undefined;

  const directKeys = ["message", "msg", "error", "detail", "description", "reason"];
  for (const key of directKeys) {
    if (key in data) {
      const msg = coerceToMessage(data[key]);
      if (msg) return msg;
    }
  }

  if (isRecord(data.errors)) {
    const collected: string[] = [];
    for (const v of Object.values(data.errors)) {
      const m = coerceToMessage(v);
      if (m) collected.push(m);
    }
    if (collected.length) return collected.join(", ");
  }

  if (data.data !== undefined && data.data !== data) {
    const nested = parseBackendMessageBody(data.data);
    if (nested) return nested;
  }

  return undefined;
}

/** Merges backend success text from the full JSON envelope into the inner payload (unwraps `data` + top-level `message`). */
export function attachBackendSuccessMessage<T extends Record<string, unknown>>(
  envelope: unknown,
  innerPayload: T,
): T {
  if (!isRecord(innerPayload)) return innerPayload;
  const fromInner = parseBackendMessageBody(innerPayload);
  const fromEnvelope = parseBackendMessageBody(envelope);
  const text = fromInner ?? fromEnvelope;
  if (!text) return { ...innerPayload };
  return { ...innerPayload, message: text };
}

/** Shape returned by `utils/service` axios response interceptor on HTTP failures. */
export function isSerializedInterceptorError(
  error: unknown,
): error is { message: string; status: number } {
  return (
    isRecord(error) &&
    typeof error.message === "string" &&
    typeof error.status === "number"
  );
}

export function extractApiErrorMessage(error: unknown): string | undefined {
  if (typeof error === "string" && error.trim()) {
    return error.trim();
  }
  if (isSerializedInterceptorError(error)) {
    return error.message.trim();
  }
  if (axios.isAxiosError(error)) {
    const body = error.response?.data;
    const fromBody = parseBackendMessageBody(body);
    if (fromBody) return fromBody;
    if (typeof body === "string" && body.trim()) return body.trim();
    return undefined;
  }
  if (isRecord(error)) {
    const fromBody = parseBackendMessageBody(error);
    if (fromBody) return fromBody;
  }
  if (error instanceof Error && error.message) {
    return error.message;
  }
  return undefined;
}

export function extractSuccessMessage(payload: unknown): string | undefined {
  if (payload === null || payload === undefined) return undefined;
  if (typeof payload !== "object") return undefined;
  return parseBackendMessageBody(payload);
}

export function getErrorMessage(error: unknown, fallback: string): string {
  const extracted = extractApiErrorMessage(error);
  if (extracted) return extracted;
  if (typeof error === "string" && error.trim()) return error.trim();
  return fallback;
}

/** Show Yup/Formik field error only after blur or after a submit attempt (per-field validation UX). */
export function visibleFormikFieldError(
  touched: boolean | undefined,
  submitCount: number,
  error: string | string[] | undefined,
): string | undefined {
  if (error === undefined || error === "") return undefined;
  const message = Array.isArray(error) ? error[0] : error;
  if (!message) return undefined;
  if (touched || submitCount > 0) return message;
  return undefined;
}

export function normalizeCompanyTypeOptions(
  rows: Array<{ id?: string; _id?: string; title?: string }> | undefined,
): SelectOption[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .map((row) => ({
      value: row._id || row.id || "",
      label: row.title || "",
    }))
    .filter((row) => row.value && row.label);
}

export function normalizeCountryOptions(
  rows: Array<{ _id?: string; name?: string; alpha2?: string }> | undefined,
): SelectOption[] {
  if (!Array.isArray(rows)) return [];
  return rows
    .filter((country) => country.name && country.alpha2)
    .map((country) => ({
      value: country._id || country.name || "",
      label: country.name || "",
    }))
    .sort((a, b) => a.label.localeCompare(b.label));
}

/** 24-char hex Mongo-style id (used by create-product / profile company refs). */
export function isValidMongoObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(String(value || "").trim());
}

function unwrapAnyDeep(payload: unknown): unknown {
  if (payload == null) return payload;
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== "object") return payload;
  const obj = payload as Record<string, unknown>;
  if (obj.data !== undefined) return unwrapAnyDeep(obj.data);
  if (obj.result !== undefined) return unwrapAnyDeep(obj.result);
  return payload;
}

/** Normalizes typical `{ data: ... }` API envelopes into an object array for dropdowns. */
export function unwrapApiListData(payload: unknown): Record<string, unknown>[] {
  const p = unwrapAnyDeep(payload);
  if (Array.isArray(p)) return p as Record<string, unknown>[];
  if (!p || typeof p !== "object") return [];
  const obj = p as Record<string, unknown>;
  const candidates = [obj.list, obj.items, obj.results, obj.rows, obj.data, obj.companies, obj.brands];
  for (const c of candidates) {
    if (Array.isArray(c)) return c as Record<string, unknown>[];
  }
  return [];
}

/** Rows from `GET .../companyType/company-type-list` (`data.data.data[]`). */
export function unwrapCompanyTypeListRows(apiBody: unknown): Record<string, unknown>[] {
  if (apiBody == null || typeof apiBody !== "object") return [];
  const root = apiBody as Record<string, unknown>;
  const mid = root.data as Record<string, unknown> | undefined;
  const page = mid?.data as Record<string, unknown> | undefined;
  const list = page?.data;
  if (Array.isArray(list)) return list as Record<string, unknown>[];
  return unwrapApiListData(mid ?? root);
}

function readStringField(row: Record<string, unknown>, keys: string[]): string {
  for (const key of keys) {
    const v = row[key];
    if (typeof v === "string" && v.trim()) return v.trim();
    if (v && typeof v === "object" && "name" in (v as object)) {
      const n = (v as { name?: string }).name;
      if (typeof n === "string" && n.trim()) return n.trim();
    }
  }
  return "";
}

function readIdField(row: Record<string, unknown>): string {
  const id =
    row._id ??
    row.id ??
    (row.company as { _id?: string; id?: string } | undefined)?._id ??
    (row.company as { _id?: string; id?: string } | undefined)?.id;
  return typeof id === "string" && id.trim() ? id.trim() : "";
}

/** Maps heterogeneous list rows to `{ value, label }` for native `<select>` options. */
export function normalizeEntitySelectOptions(rows: Record<string, unknown>[]): SelectOption[] {
  return rows
    .map((row) => {
      const value = readIdField(row);
      const label =
        readStringField(row, ["name", "title", "label", "companyName", "brandName", "displayName"]) ||
        value;
      return { value, label };
    })
    .filter((o) => o.value && o.label);
}

/** Merge API company options with `profile.company` / `profile.companies` . */
export function mergeCompanySources(
  primary: SelectOption[],
  profile: Record<string, unknown> | null | undefined,
): SelectOption[] {
  const map = new Map<string, string>();
  const add = (id: string, name: string) => {
    const tid = String(id || "").trim();
    if (!tid) return;
    const label = String(name || tid).trim() || tid;
    if (!map.has(tid)) map.set(tid, label);
  };
  primary.forEach((o) => add(o.value, o.label));
  const co = profile?.company as
    | { id?: string; _id?: string; name?: string; companyName?: string; company_name?: string }
    | undefined;
  if (co) {
    const coId = co.id || co._id;
    if (coId) add(String(coId), String(co.name || co.companyName || co.company_name || "Company"));
  }
  const list = profile?.companies as
    | Array<{ id?: string; _id?: string; name?: string; company_name?: string }>
    | undefined;
  if (Array.isArray(list)) {
    list.forEach((x) => {
      const xid = x?.id || x?._id;
      if (xid) add(String(xid), String(x.name || x.company_name || ""));
    });
  }
  return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
}

/** @deprecated Use {@link mergeCompanySources}; kept for call sites that only add profile company. */
export function mergeCompanyFromUserProfile(
  options: SelectOption[],
  profile: Record<string, unknown> | null | undefined,
): SelectOption[] {
  return mergeCompanySources(options, profile);
}

/** Deep unwrap for list payloads (Add Product ). */
export function unwrapListPayloadDeep(payload: unknown): Record<string, unknown>[] {
  if (payload == null) return [];
  if (Array.isArray(payload)) return payload as Record<string, unknown>[];
  if (typeof payload !== "object") return [];
  const obj = payload as Record<string, unknown>;
  const direct = [obj.results, obj.items, obj.list, obj.rows, obj.countries, obj.currencies, obj.data];
  for (const c of direct) {
    if (Array.isArray(c)) return c as Record<string, unknown>[];
  }
  if (obj.data !== undefined) {
    const nested = unwrapListPayloadDeep(obj.data);
    if (nested.length) return nested;
  }
  for (const key of Object.keys(obj)) {
    const val = obj[key];
    if (val && typeof val === "object" && !Array.isArray(val)) {
      const nested = unwrapListPayloadDeep(val);
      if (nested.length) return nested;
    }
  }
  return [];
}

/** Map brand/manufacturer row to select option (`normalizeBrandManufacturerRow`). */
export function normalizeBrandManufacturerRowToOption(row: unknown): SelectOption | null {
  const r = row as Record<string, unknown>;
  const nestedBrand =
    r.brand && typeof r.brand === "object" ? (r.brand as Record<string, unknown>) : null;
  const value = String(
    r._id ?? r.id ?? r.brand_id ?? nestedBrand?._id ?? nestedBrand?.id ?? "",
  ).trim();
  if (!value) return null;
  const label =
    String(
      r.name ??
        r.title ??
        r.brand ??
        r.brandName ??
        r.brand_name ??
        nestedBrand?.name ??
        r.company_name ??
        r.manufacturer_name ??
        r.label ??
        "",
    ).trim() || value;
  return { value, label };
}

export function dedupeSelectOptionsByValue(rows: SelectOption[]): SelectOption[] {
  const seen = new Set<string>();
  const out: SelectOption[] = [];
  for (const row of rows) {
    const id = String(row.value || "").trim();
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push({ value: id, label: String(row.label || id) });
  }
  return out;
}

/** Extract `{ value, label }` brand from a product list row. */
export function extractBrandFromProductRow(row: Record<string, unknown>): SelectOption | null {
  const brand = row.brand;
  if (brand && typeof brand === "object") {
    return normalizeBrandManufacturerRowToOption(brand);
  }
  const brandId = String(row.brand_id ?? row.brandId ?? "").trim();
  const brandName = String(row.brand_name ?? row.brandName ?? "").trim();
  if (brandId && brandName) return { value: brandId, label: brandName };
  return null;
}

/** Brand dropdown options from first page of product list (AddProductForm). */
export function brandsFromProductListRows(list: Record<string, unknown>[]): SelectOption[] {
  const direct = list
    .map((row) => extractBrandFromProductRow(row))
    .filter(Boolean) as SelectOption[];
  return dedupeSelectOptionsByValue(direct);
}

/** Currency rows → select options (`normalizeCurrencyOptions`). */
export function normalizeCurrencySelectOptionsFromRows(rows: Record<string, unknown>[]): SelectOption[] {
  return rows
    .map((r) => {
      const value = String(r._id ?? r.id ?? r.currency_id ?? r.code ?? r.alpha3 ?? "").trim();
      const code = String(r.alpha3 ?? r.code ?? "").trim();
      const name = String(r.name ?? r.title ?? r.currency ?? "").trim();
      const label = [code, name].filter(Boolean).join(" - ") || name || code;
      if (!value || !label) return null;
      return { value, label };
    })
    .filter(Boolean) as SelectOption[];
}

// --- Product catalog card mapping (formerly `redux/product/product-adapter.ts`) ---

function catalogHashSeed(id: string, index: number): number {
  const s = `${id}#${index}`;
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function catalogReadNumber(raw: Record<string, unknown>, keys: string[]): number | undefined {
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

function catalogReadString(raw: Record<string, unknown>, keys: string[]): string {
  for (const k of keys) {
    const v = raw[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
}

function catalogCategoryLabel(raw: Record<string, unknown>): string {
  const c = raw.category;
  if (typeof c === "string" && c.trim()) return c.trim();
  if (c && typeof c === "object") {
    const o = c as Record<string, unknown>;
    const t = catalogReadString(o, ["name", "title", "label"]);
    if (t) return t;
  }
  const sub = catalogReadString(raw, ["subcategory", "sub_category", "product_subcategory", "type"]);
  if (sub) return sub;
  const pt = raw.product_type;
  if (pt && typeof pt === "object") {
    const o = pt as Record<string, unknown>;
    const t = catalogReadString(o, ["name", "title", "label"]);
    if (t) return t;
  }
  return "";
}

function catalogParseTags(raw: Record<string, unknown>): string[] {
  const out: string[] = [];
  const pushMany = (arr: unknown) => {
    if (!Array.isArray(arr)) return;
    for (const x of arr) {
      if (typeof x === "string" && x.trim()) out.push(x.trim());
      else if (x && typeof x === "object") {
        const o = x as Record<string, unknown>;
        const n = catalogReadString(o, ["name", "title", "label"]);
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

const CATALOG_TAG_POOL = [
  ["Vegan", "Non-GMO"],
  ["Gluten-Free", "Low Sugar"],
  ["Electrolytes", "Non-GMO"],
  ["Omega-3", "Vegan"],
];

/** Map API / overview product shape to catalog card model. */
export function apiProductToCatalogRow(raw: Record<string, unknown>, index: number): IProductCatalogRow {
  const id = String(raw.id ?? raw._id ?? index);
  const h = catalogHashSeed(id, index);
  const name = String(raw.name ?? "Product");
  const brandName =
    raw.brand && typeof raw.brand === "object" && (raw.brand as { name?: string }).name
      ? String((raw.brand as { name?: string }).name)
      : catalogReadString(raw, ["brand_name", "brandName"]) || "Brand";

  const cat = catalogCategoryLabel(raw);
  const subline = cat ? `${brandName} · ${cat}` : `${brandName}`;

  const nutrition =
    catalogReadNumber(raw, ["nutritionScore", "nutrition_score", "nutrition", "Nutrition"]) ??
    78 + (h % 15);
  const sustain =
    catalogReadNumber(raw, [
      "sustainabilityScore",
      "sustainability_score",
      "sustain_score",
      "sustain",
      "Sustainability",
    ]) ?? 76 + (h % 16);
  const cost =
    catalogReadNumber(raw, ["costScore", "cost_score", "cost", "commercial_score", "Cost"]) ??
    74 + (h % 18);

  const overallFromApi = catalogReadNumber(raw, [
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
    catalogReadNumber(raw, [
      "retail_price",
      "price",
      "unit_price",
      "selling_price",
      "markup",
      "retailCost",
    ]) ??
    2.5 + (h % 80) / 10;

  const trendPct =
    catalogReadNumber(raw, [
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
    (trendPct === 0 && catalogReadString(raw, ["trend_label"]) === "Stable");

  let trendPositive = h % 3 !== 0;
  const tp = raw.trend_positive ?? raw.trendPositive;
  if (typeof tp === "boolean") trendPositive = tp;
  else if (catalogReadString(raw, ["trend_direction"]) === "down") trendPositive = false;
  else if (catalogReadString(raw, ["trend_direction"]) === "up") trendPositive = true;

  const tags = catalogParseTags(raw);
  const tagList = tags.length ? tags : CATALOG_TAG_POOL[h % CATALOG_TAG_POOL.length];

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
    catalogReadString(raw, ["badge"]) === "star" ||
    h % 7 === 1;

  const regulatoryWarning =
    catalogReadString(raw, [
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

// --- Ingredient catalog card mapping (formerly `redux/ingredient/ingredient-adapter.ts`) ---

function ingredientHash(id: string): number {
  let h = 0;
  for (let i = 0; i < id.length; i++) h = (h * 31 + id.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function ingredientInferForm(name: string, claim: string | undefined): string {
  const n = `${name} ${claim ?? ""}`.toLowerCase();
  if (/powder/.test(n)) return "Powder";
  if (/liquid|extract|concentrate/.test(n)) return "Liquid";
  if (/puree|paste/.test(n)) return "Puree";
  if (/granule|granulate/.test(n)) return "Granule";
  if (/crystal/.test(n)) return "Crystal";
  return "Powder";
}

function ingredientInferCategory(claim: string | undefined): string {
  const c = (claim ?? "").toLowerCase();
  if (/beverage|drink|water|juice|tea/.test(c)) return "Beverages";
  if (/cosmetic|skin|beauty/.test(c)) return "Cosmetic";
  if (/household|cleaning|detergent/.test(c)) return "Household";
  if (/supplement|vitamin|mineral/.test(c)) return "Supplement";
  if (c) return "Food";
  return "Food";
}

/** Map supplier ingredient to catalog card model. */
export function ingredientToCatalogRow(row: ISupplierIngredient): IIngredientCatalogRow {
  const h = ingredientHash(row.id || "x");
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
    category: ingredientInferCategory(row.claim),
    form: ingredientInferForm(name, row.claim),
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
