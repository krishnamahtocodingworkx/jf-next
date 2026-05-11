import { createSlice } from "@reduxjs/toolkit";
import { storage } from "@/lib/storage";
import { forgotPassword, manualLogin, registerUser, resetPassword } from "@/redux/user/user-thunks";
import type { UserState } from "@/redux/user/user-types";

const initialState: UserState = {
  isLoggedIn: false,
  authState: "signed_out",
  accessToken: "",
  refreshToken: "",
  idToken: "",
  details: null,
  loading: false,
  error: "",
}
const userSlice = createSlice({
  name: "user",
  initialState: initialState,
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
      state.details = null;
      state.error = "";
    },
  },
  extraReducers: (builder) => {
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

export const { logout } = userSlice.actions;
export default userSlice.reducer;
