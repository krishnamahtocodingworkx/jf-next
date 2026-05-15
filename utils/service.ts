// Shared axios instance: attaches the Firebase idToken on every request and runs the silent refresh-token
// retry on 401. Other services import `api` from here (or via `@/services/api`).
import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { signInWithCustomToken } from "firebase/auth";
import { parseBackendMessageBody } from "@/utils/commonFunctions";
import SHOW_ERROR_TOAST, { SHOW_INTERNET_TOAST } from "@/utils/showToast";
import { storage } from "@/lib/storage";
import { ENDPOINTS } from "@/utils/endpoints";
import { routes } from "@/utils/routes";
import { auth } from "@/lib/firebase";

const SOMETHING_WENT_WRONG = "OOPS! Something went wrong";
const BASE_URL = ENDPOINTS.BASE_URL || "";
const REQUEST_TIMEOUT_MS = 30_000;

/** Named HTTP status codes used across the app — avoids magic numbers in error handling. */
export const STATUS_CODE = {
  success: 200,
  successAction: 201,
  notFound: 204,
  invalid: 400,
  badRequest: 400,
  Unauthorized: 401,
  timeout: 408,
  userDelete: 410,
  serverError: 500,
} as const;

export type ApiResponse<T = unknown> = {
  data: T;
  status: number;
  message?: string;
};

export type ErrorResponse = {
  message: string;
  status: number;
};

type RetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/** True if the axios interceptor already toasted a network/timeout failure. */
export function interceptorHandledNetworkOrTimeout(error: unknown): boolean {
  const e = error as { status?: number };
  return e?.status === 0 || e?.status === STATUS_CODE.timeout;
}

/** Hard reset on auth failure — clears storage and forces a navigation back to the login screen. */
function sessionExpireHandler() {
  if (typeof window === "undefined") return;
  localStorage.clear();
  window.location.replace(routes.LOGIN);
}

/** Builds the configured axios instance shared by all services. */
function createAxiosInstance(baseURL: string): AxiosInstance {
  const instance = axios.create({
    baseURL,
    timeout: REQUEST_TIMEOUT_MS,
    headers: { "Content-Type": "application/json" },
  });

  // Request interceptor — attaches the latest Firebase idToken from Redux on every outgoing request.
  // Dynamic import avoids the circular dependency between `store` and the slice that updates these tokens.
  instance.interceptors.request.use(async (config) => {
    const { store } = await import("@/redux/store");
    const idToken = store.getState().user.idToken;
    if (idToken) {
      config.headers.Authorization = `Bearer ${idToken}`;
    }
    return config;
  });

  // Response interceptor — three responsibilities:
  //   1) Toast network/timeout failures so every service doesn't repeat that handling.
  //   2) On 401, attempt a silent refresh via the backend then replay the original request once.
  //   3) Reshape errors into `{ message, status }` so callers can extract messages predictably.
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error): Promise<ErrorResponse | AxiosResponse> => {
      const axiosError = error as AxiosError;
      const originalReq = axiosError.config as RetriableConfig | undefined;

      if (!axiosError.response) {
        if (axiosError.code === "ECONNABORTED") {
          SHOW_ERROR_TOAST("Request timeout. Please try again.");
          return Promise.reject({
            message: "Request timeout. Please try again.",
            status: STATUS_CODE.timeout,
          });
        }
        SHOW_INTERNET_TOAST();
        return Promise.reject({
          message: "Network error. Please check your internet connection.",
          status: 0,
        });
      }

      const body = axiosError.response.data as unknown;
      const message =
        parseBackendMessageBody(body) ??
        (typeof body === "string" && body.trim() ? body.trim() : undefined) ??
        axiosError.response.statusText ??
        axiosError.message ??
        SOMETHING_WENT_WRONG;
      const status = axiosError.response.status ?? axiosError.status ?? 0;

      // Silent refresh-token flow — runs at most once per failed request (`_retry` flag).
      if (status === STATUS_CODE.Unauthorized && originalReq && !originalReq._retry) {
        originalReq._retry = true;
        try {
          const { store } = await import("@/redux/store");
          const refreshToken = store.getState().user.refreshToken;
          if (!refreshToken) {
            sessionExpireHandler();
            return Promise.reject({ message: "Session expired", status });
          }

          // Exchange the refresh token for a new access/refresh pair, then re-mint the Firebase idToken.
          const refreshResponse = await axios.post(
            BASE_URL + ENDPOINTS.AUTH.REFRESH_TOKEN,
            { refresh_token: refreshToken },
          );
          const newAccessToken = refreshResponse.data.data?.accessToken;
          const newRefreshToken = refreshResponse.data.data?.refreshToken;

          const firebaseRes = await signInWithCustomToken(auth, newAccessToken);
          const newIdToken = await firebaseRes.user.getIdToken();

          // Persist new tokens to both storage and Redux so subsequent requests use them.
          storage.setItem("access_token", newAccessToken);
          storage.setItem("refresh_token", newRefreshToken || refreshToken);
          storage.setItem("idToken", newIdToken);

          const { updateTokens } = await import("@/redux/user/user-slice");
          store.dispatch(
            updateTokens({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              idToken: newIdToken,
            }),
          );

          // Replay the original request with the fresh token.
          originalReq.headers.Authorization = `Bearer ${newIdToken}`;
          return instance(originalReq);
        } catch {
          sessionExpireHandler();
          return Promise.reject({ message: "Session expired", status });
        }
      }

      if (status === STATUS_CODE.Unauthorized) {
        sessionExpireHandler();
      }

      return Promise.reject({ message, status });
    },
  );

  return instance;
}

/** The shared axios client — every service imports this. */
export const api = createAxiosInstance(BASE_URL);

/** Toast wrapper for the `{ message, status }` shape produced by the interceptor. */
export function handleApiError(error: unknown, title?: string): void {
  if (interceptorHandledNetworkOrTimeout(error)) return;
  const e = error as { message?: string; status?: number };
  if (e?.status === STATUS_CODE.Unauthorized) return;
  const message = e?.message || SOMETHING_WENT_WRONG;
  SHOW_ERROR_TOAST(title ? `${title}: ${message}` : message);
}
