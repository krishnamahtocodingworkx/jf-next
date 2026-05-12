import { api } from "@/services/api";
import { ENDPOINTS } from "@/utils/endpoints";
import { auth } from "@/lib/firebase";
import { attachBackendSuccessMessage, normalizeCountryOptions, unwrapApiListData, normalizeEntitySelectOptions } from "@/utils/commonFunctions";
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
} from "firebase/auth";
import { notifyApiSuccessToast } from "@/utils/showToast";
import type { SelectOption } from "@/utils/model";

type RegisterPayload = {
  firstName: string;
  lastName: string;
  company: string;
  companyType: string;
  phoneNumber: string;
  jobTitle: string;
  city: string;
  state: string;
  country: string;
  email: string;
  password: string;
  role: string;
};

class UserService {
  //  Step 1: Firebase login (check MFA)
  async loginWithFirebase(email: string, password: string) {
    try {
      const res = await signInWithEmailAndPassword(auth, email, password);

      return {
        user: res.user,
        mfaRequired: false
      };
    } catch (error: any) {
      console.log("loginWithFirebase error:", error);

      switch (error.code) {
        case "auth/user-not-found":
          throw new Error("User does not exist. Please register first.");

        case "auth/wrong-password":
          throw new Error("Incorrect password");

        case "auth/invalid-email":
          throw new Error("Invalid email address");

        case "auth/too-many-requests":
          throw new Error("Too many attempts. Try again later.");

        case "auth/multi-factor-auth-required":
          return {
            mfaRequired: true,
            resolver: error.resolver,
            phoneNumber:
              error?.customData?._tokenResponse?.mfaInfo?.[0]?.phoneInfo
          };

        default:
          throw new Error(error?.message || "Something went wrong");
      }
    }
  }

  //  Step 2: Backend login + Firebase custom token
  async login(email: string, password: string) {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, {
      email,
      password
    });
    const accessToken = data.data?.accessToken;
    const res = await signInWithCustomToken(auth, accessToken);
    const idToken = await res.user?.getIdToken();
    notifyApiSuccessToast(data);
    return {
      ...data.data,
      idToken
    };
  }

  async register(payload: RegisterPayload) {
    const { data } = await api.post(ENDPOINTS.AUTH.REGISTER, payload);

    const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
    await sendEmailVerification(userCredential.user);
    await auth.signOut();

    console.log("[auth] register API + email verification sent", payload.email);

    const inner = data?.data ?? data;

    return attachBackendSuccessMessage(data, inner);
  }

  async getCountries() {
    try {
      const { data } = await api.get(ENDPOINTS.COUNTRY.GET_ALL);
      const rows = data?.data?.data ?? data?.data ?? data ?? [];
      const normalized = normalizeCountryOptions(rows).map((option) => ({
        id: option.value,
        name: option.label,
      }));

      console.log("[auth] countries fetched", normalized.length);

      return normalized;
    } catch (error) {
      console.log("[auth] countries fetch failed", error);
      return [];
    }
  }

  async forgotPassword(email: string) {
    await sendPasswordResetEmail(auth, email);
    console.log("[auth] firebase forgot password email sent", email);
    return true;
  }

  async resetPassword(code: string, password: string) {
    await confirmPasswordReset(auth, code, password);
    console.log("[auth] firebase password reset success", code);
    return true;
  }

  async getBrands(): Promise<SelectOption[]> {
    try {
      const { data } = await api.get(ENDPOINTS.USER.BRANDS);
      const rows = unwrapApiListData(data?.data ?? data);
      const opts = normalizeEntitySelectOptions(rows);
      console.log("[userService] getBrands", opts.length);
      return opts;
    } catch (error) {
      console.log("[userService] getBrands failed", error);
      return [];
    }
  }

  async getCompanies(): Promise<SelectOption[]> {
    try {
      const { data } = await api.get(ENDPOINTS.COMPANY.LIST_FOR_SELECT);
      const rows = unwrapApiListData(data?.data ?? data);
      const opts = normalizeEntitySelectOptions(rows);
      console.log("[userService] getCompanies", opts.length);
      return opts;
    } catch (error) {
      console.log("[userService] getCompanies failed", error);
      return [];
    }
  }

  async getManufacturers(): Promise<SelectOption[]> {
    try {
      const { data } = await api.get(ENDPOINTS.PRODUCTS.MANUFACTURERS);
      const rows = unwrapApiListData(data?.data ?? data);
      const opts = normalizeEntitySelectOptions(rows);
      console.log("[userService] getManufacturers", opts.length);
      return opts;
    } catch (error) {
      console.log("[userService] getManufacturers failed", error);
      return [];
    }
  }

  /** Brand object for a product id (`GET /api/v1/productBrand/get-product-brand/:id`). */
  async getProductBrandById(productId: string): Promise<Record<string, unknown> | null> {
    const clean = String(productId || "").trim();
    if (!clean) return null;
    try {
      const { data } = await api.get(ENDPOINTS.PRODUCT_BRAND.GET_BY_ID(clean));
      const nested = (data as Record<string, unknown> | undefined)?.data as
        | Record<string, unknown>
        | undefined;
      const row = (nested?.data ?? nested ?? null) as Record<string, unknown> | null;
      const usable =
        row && typeof row === "object" && Object.keys(row).length > 0 ? row : null;
      console.log("[userService] getProductBrandById", clean, Boolean(usable));
      return usable;
    } catch (error) {
      console.log("[userService] getProductBrandById failed", clean, error);
      return null;
    }
  }
}

export const userService = new UserService();
