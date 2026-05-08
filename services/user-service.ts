import { api } from "@/services/api";
import { ENDPOINTS } from "@/utils/endpoints";
import { auth } from "@/lib/firebase";
import { normalizeCountryOptions } from "@/utils/commonFunctions";
import {
  signInWithCustomToken,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  confirmPasswordReset,
  sendEmailVerification,
} from "firebase/auth";

type LoginPayload = { email: string; password: string };
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
  async login(payload: LoginPayload) {
    const { data } = await api.post(ENDPOINTS.AUTH.LOGIN, payload);
    const loginData = data?.data ?? data;
    const accessToken = loginData?.accessToken;

    if (!accessToken) {
      throw new Error("Login response does not include access token");
    }

    const firebaseCredential = await signInWithCustomToken(auth, accessToken);
    const idToken = await firebaseCredential.user.getIdToken();

    console.log("[auth] login API + firebase token success", payload.email);

    return {
      ...loginData,
      idToken,
    };
  }

  async register(payload: RegisterPayload) {
    const { data } = await api.post(ENDPOINTS.AUTH.REGISTER, payload);

    const userCredential = await signInWithEmailAndPassword(auth, payload.email, payload.password);
    await sendEmailVerification(userCredential.user);
    await auth.signOut();

    console.log("[auth] register API + email verification sent", payload.email);

    return data?.data ?? data;
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
