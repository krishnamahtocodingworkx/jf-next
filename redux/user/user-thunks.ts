// Auth thunks — wrap `userService` calls in createAsyncThunk so the slice can react to pending/fulfilled/rejected.
import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/user-service";
import { storage } from "@/lib/storage";
import { fireBaseLogEvent } from "@/lib/firebase";
import { extractApiErrorMessage } from "@/utils/commonFunctions";
import { notifyApiSuccessToast } from "@/utils/showToast";
import {
  notifyForgotPasswordApiError,
  notifyLoginApiError,
  notifyRegisterApiError,
  notifyResetPasswordApiError,
} from "@/utils/showErrorToast";
import { interceptorHandledNetworkOrTimeout } from "@/utils/service";

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
  confirmPassword: string;
};

type ResetPasswordPayload = { code: string; password: string };

/** Full login flow: Firebase sign-in → backend `/users/login` → persist tokens → analytics. */
export const manualLogin = createAsyncThunk(
  "auth/manualLogin",
  async ({ email, password }: LoginPayload, { rejectWithValue }) => {
    try {
      const firebaseRes = await userService.loginWithFirebase(email, password);
      // Short-circuit when MFA is required; UI uses `resolver` to drive the OTP step.
      if (firebaseRes.mfaRequired) {
        return {
          mfaRequired: true,
          resolver: firebaseRes.resolver,
          phoneNumber: firebaseRes.phoneNumber,
        };
      }

      const apiRes = await userService.login(email, password);
      // Persist tokens so the axios interceptor can attach them on every request after a reload.
      storage.setItem("access_token", apiRes.accessToken);
      storage.setItem("refresh_token", apiRes.refreshToken);
      storage.setItem("idToken", apiRes.idToken);

      fireBaseLogEvent("login", { method: "email_password", email });

      return { ...apiRes, mfaRequired: false };
    } catch (error) {
      if (!interceptorHandledNetworkOrTimeout(error)) {
        notifyLoginApiError(error);
      }
      return rejectWithValue(extractApiErrorMessage(error) ?? "Login failed");
    }
  },
);

/** Register a new user; success message comes from the backend envelope. */
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (payload: RegisterPayload, { rejectWithValue }) => {
    try {
      const response = await userService.register(payload);
      notifyApiSuccessToast(response);
      return response;
    } catch (error) {
      if (!interceptorHandledNetworkOrTimeout(error)) {
        notifyRegisterApiError(error);
      }
      return rejectWithValue(extractApiErrorMessage(error) ?? "");
    }
  },
);

/** Sends the password reset email — the user clicks a link that returns them to `/auth/recovery-password`. */
export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      await userService.forgotPassword(email);
      return true;
    } catch (error) {
      if (!interceptorHandledNetworkOrTimeout(error)) {
        notifyForgotPasswordApiError(error);
      }
      return rejectWithValue(extractApiErrorMessage(error) ?? "");
    }
  },
);

/** Completes the password reset flow with the `oobCode` from the reset email. */
export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async ({ code, password }: ResetPasswordPayload, { rejectWithValue }) => {
    try {
      await userService.resetPassword(code, password);
      return true;
    } catch (error) {
      if (!interceptorHandledNetworkOrTimeout(error)) {
        notifyResetPasswordApiError(error);
      }
      return rejectWithValue(extractApiErrorMessage(error) ?? "");
    }
  },
);
