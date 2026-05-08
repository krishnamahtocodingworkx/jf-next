import type { SelectOption } from "@/utils/model";

export function getErrorMessage(error: unknown, fallback: string): string {
  return typeof error === "string" ? error : fallback;
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
