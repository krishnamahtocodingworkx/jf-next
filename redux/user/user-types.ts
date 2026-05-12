export type AuthState = "signed_out" | "signed_in";

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
