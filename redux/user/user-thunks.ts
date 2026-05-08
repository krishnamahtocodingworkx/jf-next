import { createAsyncThunk } from "@reduxjs/toolkit";
import { userService } from "@/services/user-service";
import { storage } from "@/lib/storage";

export const loginUser = createAsyncThunk(
  "user/loginUser",
  async (payload: { email: string; password: string }, { rejectWithValue }) => {
    try {
      console.log("[auth] loginUser thunk", payload.email);
      const response = await userService.login(payload);

      storage.setItem("access_token", response.accessToken || "");
      storage.setItem("refresh_token", response.refreshToken || "");
      storage.setItem("idToken", response.idToken || "");

      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Login failed";
      return rejectWithValue(message);
    }
  },
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
      return response;
    } catch (error) {
      const message = error instanceof Error ? error.message : "Registration failed";
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
      const message = error instanceof Error ? error.message : "Failed to send reset instructions";
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
      const message = error instanceof Error ? error.message : "Failed to reset password";
      return rejectWithValue(message);
    }
  },
);
