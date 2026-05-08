import { createSlice } from "@reduxjs/toolkit";
import { jwtDecode } from "jwt-decode";
import { storage } from "@/lib/storage";
import { forgotPassword, loginUser, registerUser, resetPassword } from "@/redux/user/user-thunks";
import type { UserState } from "@/redux/user/user-types";

type DecodedToken = {
  app_user_id?: string;
  user_id?: string;
  email?: string;
  role?: string;
};

function getInitialState(): UserState {
  const idToken = storage.getItem("idToken") || "";

  if (!idToken) {
    return {
      isLoggedIn: false,
      authState: "signed_out",
      accessToken: "",
      refreshToken: "",
      idToken: "",
      user: null,
      loading: false,
      error: "",
    };
  }

  try {
    const decoded = jwtDecode<DecodedToken>(idToken);
    return {
      isLoggedIn: true,
      authState: "signed_in",
      accessToken: storage.getItem("access_token") || "",
      refreshToken: storage.getItem("refresh_token") || "",
      idToken,
      user: {
        id: decoded.app_user_id || decoded.user_id || "mock-user",
        email: decoded.email || "",
        role: decoded.role || "",
      },
      loading: false,
      error: "",
    };
  } catch {
    return {
      isLoggedIn: false,
      authState: "signed_out",
      accessToken: "",
      refreshToken: "",
      idToken: "",
      user: null,
      loading: false,
      error: "",
    };
  }
}

const userSlice = createSlice({
  name: "user",
  initialState: getInitialState(),
  reducers: {
    logout(state) {
      storage.removeItem("access_token");
      storage.removeItem("refresh_token");
      storage.removeItem("idToken");
      state.isLoggedIn = false;
      state.authState = "signed_out";
      state.accessToken = "";
      state.refreshToken = "";
      state.idToken = "";
      state.user = null;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUser.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(loginUser.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.authState = "signed_in";
      state.accessToken = action.payload.accessToken || "";
      state.refreshToken = action.payload.refreshToken || "";
      state.idToken = action.payload.idToken || "";
      state.user = action.payload.user || null;
    });
    builder.addCase(loginUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Login failed";
    });

    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Registration failed";
    });

    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to send reset instructions";
    });

    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "Failed to reset password";
    });
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
