import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/user-service";
import { storage } from "@/lib/storage";
import { extractApiErrorMessage } from "@/utils/commonFunctions";
import { notifyApiSuccessToast } from "@/utils/showToast";
import {
  notifyForgotPasswordApiError,
  notifyLoginApiError,
  notifyRegisterApiError,
  notifyResetPasswordApiError,
} from "@/utils/showErrorToast";
import { interceptorHandledNetworkOrTimeout } from "@/utils/service";
import { fireBaseLogEvent } from "@/lib/firebase";

// export const loginUser = createAsyncThunk(
//   "user/loginUser",
//   async (payload: { email: string; password: string }, { rejectWithValue }) => {
//     try {
//       console.log("[auth] loginUser thunk", payload.email);
//       const response = await userService.login(payload);

//       storage.setItem("access_token", response.accessToken || "");
//       storage.setItem("refresh_token", response.refreshToken || "");
//       storage.setItem("idToken", response.idToken || "");

//       notifyApiSuccessToast(response);
//       return response;
//     } catch (error) {
//       if (!interceptorHandledNetworkOrTimeout(error)) {
//         notifyLoginApiError(error);
//       }
//       const message = extractApiErrorMessage(error) ?? "";
//       return rejectWithValue(message);
//     }
//   },
// );
export const manualLogin = createAsyncThunk(
  "auth/manualLogin",
  async (
    { email, password }: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const firebaseRes = await userService.loginWithFirebase(email, password);

      //  MFA CASE
      if (firebaseRes.mfaRequired) {
        return {
          mfaRequired: true,
          resolver: firebaseRes.resolver,
          phoneNumber: firebaseRes.phoneNumber
        };
      }

      // Step 2: Backend login
      const apiRes = await userService.login(email, password);
      console.log("login response in thunk:", apiRes);

      //  store tokens
      storage.setItem("access_token", apiRes.accessToken);
      storage.setItem("refresh_token", apiRes.refreshToken);
      storage.setItem("idToken", apiRes.idToken);

      // 📊 analytics
      fireBaseLogEvent("login", {
        method: "email_password",
        email
      });

      return {
        ...apiRes,
        mfaRequired: false
      };

    } catch (error: any) { 
      console.error("manualLogin error thunk:", error);

      return rejectWithValue(
        error?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (
    payload: {
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
    },
    { rejectWithValue },
  ) => {
    try {
      console.log("[auth] registerUser thunk", payload.email);
      const response = await userService.register(payload);
      notifyApiSuccessToast(response);
      return response;
    } catch (error) {
      if (!interceptorHandledNetworkOrTimeout(error)) {
        notifyRegisterApiError(error);
      }
      const message = extractApiErrorMessage(error) ?? "";
      return rejectWithValue(message);
    }
  },
);

export const forgotPassword = createAsyncThunk(
  "user/forgotPassword",
  async (email: string, { rejectWithValue }) => {
    try {
      console.log("[auth] forgotPassword thunk", email);
      await userService.forgotPassword(email);
      return true;
    } catch (error) {
      if (!interceptorHandledNetworkOrTimeout(error)) {
        notifyForgotPasswordApiError(error);
      }
      const message = extractApiErrorMessage(error) ?? "";
      return rejectWithValue(message);
    }
  },
);

export const resetPassword = createAsyncThunk(
  "user/resetPassword",
  async (payload: { code: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("[auth] resetPassword thunk", payload.code);
      await userService.resetPassword(payload.code, payload.password);
      return true;
    } catch (error) {
      if (!interceptorHandledNetworkOrTimeout(error)) {
        notifyResetPasswordApiError(error);
      }
      const message = extractApiErrorMessage(error) ?? "";
      return rejectWithValue(message);
    }
  },
);
