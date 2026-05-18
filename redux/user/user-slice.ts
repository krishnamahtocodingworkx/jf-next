// Auth slice — owns the tokens, signed-in flag, and AuthUser profile. Persisted via redux-persist.
import { createSlice } from "@reduxjs/toolkit";
import { storage } from "@/lib/storage";
import { forgotPassword, manualLogin, registerUser, resetPassword } from "@/redux/user/user-thunks";
import { createInitialUserState } from "@/utils/auth-helpers";

/** Default state on first load / after logout / when the persisted blob is empty. */
const initialState = createInitialUserState();

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    /** Clears tokens in both localStorage and Redux state — invoked from navbar logout / interceptor 401. */
    logout(state) {
      storage.removeItem("access_token");
      storage.removeItem("refresh_token");
      storage.removeItem("idToken");
      state.isLoggedIn = false;
      state.authState = "signed_out";
      state.accessToken = "";
      state.refreshToken = "";
      state.idToken = "";
      state.details = null;
      state.error = "";
    },
    /** Refresh-token flow updates tokens in place without touching `isLoggedIn`. */
    updateTokens(
      state,
      action: {
        payload: {
          accessToken: string;
          refreshToken?: string;
          idToken: string;
        };
      },
    ) {
      state.accessToken = action.payload.accessToken;
      state.idToken = action.payload.idToken;
      if (action.payload.refreshToken) {
        state.refreshToken = action.payload.refreshToken;
      }
    },
  },
  extraReducers: (builder) => {
    // ── manualLogin: pending starts the spinner; fulfilled hydrates tokens + AuthUser; rejected surfaces the error.
    builder.addCase(manualLogin.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(manualLogin.fulfilled, (state, action) => {
      state.loading = false;
      state.isLoggedIn = true;
      state.authState = "signed_in";
      state.accessToken = action.payload.accessToken || "";
      state.refreshToken = action.payload.refreshToken || "";
      state.idToken = action.payload.idToken || "";
      state.details = action.payload.user || null;
    });
    builder.addCase(manualLogin.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "";
    });

    // ── registerUser: only flips the loading flag; navigation + toasts happen on the Register page.
    builder.addCase(registerUser.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(registerUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(registerUser.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "";
    });

    // ── forgotPassword: identical loading lifecycle; the Firebase email is fire-and-forget on the page.
    builder.addCase(forgotPassword.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(forgotPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(forgotPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "";
    });

    // ── resetPassword: same lifecycle pattern; the page navigates back to login on success.
    builder.addCase(resetPassword.pending, (state) => {
      state.loading = true;
      state.error = "";
    });
    builder.addCase(resetPassword.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(resetPassword.rejected, (state, action) => {
      state.loading = false;
      state.error = (action.payload as string) || "";
    });
  },
});

export const { logout, updateTokens } = userSlice.actions;
export default userSlice.reducer;
