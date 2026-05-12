import { api } from "@/services/api";
import { ENDPOINTS } from "@/utils/endpoints";
import { auth } from "@/lib/firebase";
import { attachBackendSuccessMessage, normalizeCountryOptions } from "@/utils/commonFunctions";
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
} from "firebase/auth";
import { notifyApiSuccessToast } from "@/utils/showToast";

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
}

export const userService = new UserService();
