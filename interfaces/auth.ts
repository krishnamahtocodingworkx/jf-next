// Domain interfaces for the Auth module — pair with type aliases in `utils/model.ts`.
import type { AuthState } from "@/utils/model";

/** Profile data returned by the backend on login; consumed by Add Product / Ingredient panels for company defaults. */
export interface AuthUser {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  city: string;
  state: string;
  country: string;
  phoneNumber: string;
  companyType: string;
  password: string;
  role: string;
  firebaseUserId: string;
  isActive: boolean;
  disable: boolean;
  notify: string;
  walkthrough: boolean;
  createdAt: string;
  updatedAt: string;
  profilePicture: string;
  company?: {
    _id?: string;
    id?: string;
    name?: string;
    companyName?: string;
    title?: string;
  };
}

/** Persisted user slice — tokens + profile + transient loading/error flags. */
export interface UserState {
  isLoggedIn: boolean;
  authState: AuthState;
  accessToken: string;
  refreshToken: string;
  idToken: string;
  details: AuthUser | null;
  loading: boolean;
  error: string;
}
