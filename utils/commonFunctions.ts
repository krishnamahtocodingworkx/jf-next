// Cross-module helpers: API envelope/error parsing, SelectOption normalizers, generic id/number coercion.
import axios from "axios";
import type { SelectOption } from "@/utils/model";

/** Type guard for plain objects (rejects null + arrays + primitives). */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

/** Best-effort conversion of unknown values into a displayable error/success string. */
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

/** Walks a JSON envelope looking for human-readable message text under any of the common keys. */
export function parseBackendMessageBody(data: unknown): string | undefined {
  if (!isRecord(data)) return undefined;

  // Direct top-level keys first — covers most success + error envelopes.
  const directKeys = ["message", "msg", "error", "detail", "description", "reason"];
  for (const key of directKeys) {
    if (key in data) {
      const msg = coerceToMessage(data[key]);
      if (msg) return msg;
    }
  }

  // Field-level errors object: `{ errors: { email: "Invalid" } }` etc.
  if (isRecord(data.errors)) {
    const collected: string[] = [];
    for (const v of Object.values(data.errors)) {
      const m = coerceToMessage(v);
      if (m) collected.push(m);
    }
    if (collected.length) return collected.join(", ");
  }

  // Recurse into `data` for envelopes that double-wrap the payload.
  if (data.data !== undefined && data.data !== data) {
    const nested = parseBackendMessageBody(data.data);
    if (nested) return nested;
  }

  return undefined;
}

/** Promotes the backend's success message onto the unwrapped inner payload so callers can toast it. */
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

/** Recognises the `{ message, status }` rejection shape produced by the axios interceptor. */
export function isSerializedInterceptorError(
  error: unknown,
): error is { message: string; status: number } {
  return (
    isRecord(error) &&
    typeof error.message === "string" &&
    typeof error.status === "number"
  );
}

/** Resolves a user-facing error string from any error type thrown by the service layer. */
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

/** Same idea as `parseBackendMessageBody`, but typed for the happy-path payload (used by `notifyApiSuccessToast`). */
export function extractSuccessMessage(payload: unknown): string | undefined {
  if (payload === null || payload === undefined) return undefined;
  if (typeof payload !== "object") return undefined;
  return parseBackendMessageBody(payload);
}

/** Convenience wrapper: prefer the API/error message, otherwise return the caller-provided fallback. */
export function getErrorMessage(error: unknown, fallback: string): string {
  const extracted = extractApiErrorMessage(error);
  if (extracted) return extracted;
  if (typeof error === "string" && error.trim()) return error.trim();
  return fallback;
}

/** Formik UX rule — show a field error only after blur or after the user attempted a submit. */
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

/** Filters bogus rows (missing alpha2) and returns sorted `{value,label}` country options. */
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

/** Validates Mongo-style 24-char hex ids — gates fields that submit to APIs requiring an ObjectId. */
export function isValidMongoObjectId(value: string): boolean {
  return /^[a-f\d]{24}$/i.test(String(value || "").trim());
}

/** Safe numeric coercion that distinguishes empty/garbage from `0`. */
export function toFiniteNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string" && value.trim() !== "") {
    const n = Number(value);
    if (!Number.isNaN(n) && Number.isFinite(n)) return n;
  }
  return undefined;
}

/** Recursively peels `{ data }` / `{ result }` wrappers until reaching the actual payload. */
export function unwrapApiEnvelope(payload: unknown): unknown {
  if (payload == null) return payload;
  if (Array.isArray(payload)) return payload;
  if (typeof payload !== "object") return payload;
  const obj = payload as Record<string, unknown>;
  if (obj.data !== undefined) return unwrapApiEnvelope(obj.data);
  if (obj.result !== undefined) return unwrapApiEnvelope(obj.result);
  return payload;
}

/** Keys to search when extracting the array payload from an API list response (most common shapes first). */
const LIST_KEY_CANDIDATES = [
  "list",
  "items",
  "results",
  "rows",
  "data",
  "products",
  "productList",
  "ingredients",
  "companies",
  "brands",
  "content",
  "records",
] as const;

/** Unwraps the envelope then finds the array payload under one of the known list keys. */
export function unwrapApiListData(payload: unknown): Record<string, unknown>[] {
  const p = unwrapApiEnvelope(payload);
  if (Array.isArray(p)) return p as Record<string, unknown>[];
  if (!p || typeof p !== "object") return [];
  const obj = p as Record<string, unknown>;
  for (const key of LIST_KEY_CANDIDATES) {
    const candidate = obj[key];
    if (Array.isArray(candidate)) return candidate as Record<string, unknown>[];
  }
  return [];
}

/** Specialised unwrap for the deeply-nested `data.data.data[]` shape from the company-type endpoint. */
export function unwrapCompanyTypeListRows(apiBody: unknown): Record<string, unknown>[] {
  if (apiBody == null || typeof apiBody !== "object") return [];
  const root = apiBody as Record<string, unknown>;
  const mid = root.data as Record<string, unknown> | undefined;
  const page = mid?.data as Record<string, unknown> | undefined;
  const list = page?.data;
  if (Array.isArray(list)) return list as Record<string, unknown>[];
  return unwrapApiListData(mid ?? root);
}

/** Reads a string from the first matching key; supports both flat strings and nested `{ name }` shapes. */
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

/** Resolves the row id from common aliases (`_id`, `id`, nested `company._id`). */
function readIdField(row: Record<string, unknown>): string {
  const id =
    row._id ??
    row.id ??
    (row.company as { _id?: string; id?: string } | undefined)?._id ??
    (row.company as { _id?: string; id?: string } | undefined)?.id;
  return typeof id === "string" && id.trim() ? id.trim() : "";
}

/** Generic API row → `{value,label}` mapper for dropdown options (company, manufacturer, brand, etc.). */
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

/** Combines API company options with company info found on the logged-in user's profile (dedupes by id). */
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
  // Single company on the profile object.
  const co = profile?.company as
    | { id?: string; _id?: string; name?: string; companyName?: string; company_name?: string }
    | undefined;
  if (co) {
    const coId = co.id || co._id;
    if (coId) add(String(coId), String(co.name || co.companyName || co.company_name || "Company"));
  }
  // Multi-company profile (`profile.companies`).
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

/** Maps a brand or manufacturer row (heavily aliased fields) to a single `{value,label}` option. */
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

/** Removes duplicate options by `value`, keeping the first occurrence's label. */
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

/** Currency-specific mapper that produces labels like `USD - US Dollar`. */
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
