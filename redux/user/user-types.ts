export type AuthState = "signed_out" | "signed_in";

export interface AuthUser {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}

export interface UserState {
  isLoggedIn: boolean;
  authState: AuthState;
  accessToken: string;
  refreshToken: string;
  idToken: string;
  user: AuthUser | null;
  loading: boolean;
  error: string;
}
