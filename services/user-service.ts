import {
  confirmPasswordReset,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithCustomToken,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { api } from "@/services/api";
import { auth } from "@/lib/firebase";
import { ENDPOINTS } from "@/utils/endpoints";
import {
  attachBackendSuccessMessage,
  dedupeSelectOptionsByValue,
  normalizeBrandManufacturerRowToOption,
  normalizeCountryOptions,
  normalizeEntitySelectOptions,
  unwrapApiListData,
  unwrapCompanyTypeListRows,
} from "@/utils/commonFunctions";
import { notifyApiSuccessToast } from "@/utils/showToast";
import type {
  FirebaseAuthError,
  RegisterPayload,
  SelectOption,
} from "@/utils/model";
import {
  extractMfaChallengeFromError,
  isMfaChallenge,
  resolveFirebaseAuthMessage,
} from "@/utils/auth-helpers";

/** All auth + user-directory API calls used by Auth, Ingredients (companies), and Products (Add panel). */
export const userService = {
  /** Step 1 of login — Firebase sign-in; surfaces MFA challenge data when required. */
  async loginWithFirebase(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);
      return { user: res.user, mfaRequired: false as const };
    } catch (error) {
      const err = error as FirebaseAuthError;
      // MFA path: caller can hand `resolver` to the OTP screen.
      if (isMfaChallenge(err)) {
        return { mfaRequired: true as const, ...extractMfaChallengeFromError(err) };
      }
      throw new Error(resolveFirebaseAuthMessage(err));
    }
  },

  /** Step 2 of login — backend issues a custom token, we exchange it for a Firebase idToken used by API auth. */
  async login(email: string, password: string) {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, { email, password });
    const accessToken = data.data?.accessToken;
    const res = await signInWithCustomToken(auth, accessToken);
    const idToken = await res.user?.getIdToken();
    notifyApiSuccessToast(data);
    return { ...data.data, idToken };
  },

  /** Creates the account, fires a verification email, then signs the user back out (login is gated on verification). */
  async register(payload: RegisterPayload) {
    const { data } = await api.post(ENDPOINTS.AUTH.REGISTER, payload);

    const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
    await sendEmailVerification(userCredential.user);
    await auth.signOut();

    const inner = data?.data ?? data;
    return attachBackendSuccessMessage(data, inner);
  },

  /** Triggers Firebase's password-reset email; the link returns to `/auth/recovery-password?oobCode=…`. */
  async forgotPassword(email: string): Promise<true> {
    await sendPasswordResetEmail(auth, email);
    return true;
  },

  /** Completes the reset flow with the `oobCode` from the email link. */
  async resetPassword(code: string, password: string): Promise<true> {
    await confirmPasswordReset(auth, code, password);
    return true;
  },

  /** Country directory for Register / Add Product / Ingredient panels; returns `{id, name}` for legacy callers. */
  async getCountries(): Promise<Array<{ id: string; name: string }>> {
    try {
      const { data } = await api.get(ENDPOINTS.COUNTRY.GET_ALL);
      const rows = data?.data?.data ?? data?.data ?? data ?? [];
      return normalizeCountryOptions(rows).map((option) => ({
        id: option.value,
        name: option.label,
      }));
    } catch {
      return [];
    }
  },

  /** Company-type options used by both Register and the Add Product company select. */
  async getCompanyTypeList(): Promise<SelectOption[]> {
    try {
      const { data } = await api.get(ENDPOINTS.PROFILE.COMPANY_TYPE);
      const rows = unwrapCompanyTypeListRows(data);
      return normalizeEntitySelectOptions(rows);
    } catch {
      return [];
    }
  },

  /** Company directory for the Ingredient "add" form. */
  async getCompanies(): Promise<SelectOption[]> {
    try {
      const { data } = await api.get(ENDPOINTS.COMPANY.LIST_FOR_SELECT);
      const rows = unwrapApiListData(data?.data ?? data);
      return normalizeEntitySelectOptions(rows);
    } catch {
      return [];
    }
  },

  /** Manufacturer directory used by the Add Product manufacturer select. */
  async getManufacturers(): Promise<SelectOption[]> {
    try {
      const { data } = await api.get(ENDPOINTS.PRODUCTS.MANUFACTURERS);
      const rows = unwrapApiListData(data?.data ?? data);
      return normalizeEntitySelectOptions(rows);
    } catch {
      return [];
    }
  },

  /** Brands for Add Product; also returns a brand→company map so picking a brand auto-fills the company field. */
  async getProductBrandList(): Promise<{
    items: SelectOption[];
    companyByBrandId: Record<string, string>;
  }> {
    try {
      const { data } = await api.get(ENDPOINTS.PRODUCT_BRAND.LIST);
      const rows = unwrapApiListData(data?.data ?? data);

      const items: SelectOption[] = [];
      const companyByBrandId: Record<string, string> = {};
      for (const row of rows) {
        if (!row || typeof row !== "object") continue;
        const record = row as Record<string, unknown>;
        const brandId = String(record._id ?? record.id ?? "").trim();
        if (!brandId) continue;
        const option = normalizeBrandManufacturerRowToOption(record);
        if (!option) continue;
        const companyId = String(record.company ?? "").trim();
        if (companyId) companyByBrandId[brandId] = companyId;
        items.push(option);
      }

      // Dedupe by brand id, then prune the company map to surviving entries only.
      const deduped = dedupeSelectOptionsByValue(items);
      const filteredMap: Record<string, string> = {};
      for (const option of deduped) {
        const companyId = companyByBrandId[option.value];
        if (companyId) filteredMap[option.value] = companyId;
      }
      return { items: deduped, companyByBrandId: filteredMap };
    } catch {
      return { items: [], companyByBrandId: {} };
    }
  },
};
