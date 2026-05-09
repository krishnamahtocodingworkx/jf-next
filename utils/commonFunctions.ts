import axios from "axios";
import type { SelectOption } from "@/utils/model";

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
