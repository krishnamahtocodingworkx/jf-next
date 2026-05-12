import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { parseBackendMessageBody } from "@/utils/commonFunctions";
import SHOW_ERROR_TOAST, { SHOW_INTERNET_TOAST } from "@/utils/showToast";
import { storage } from "@/lib/storage";
import { ENDPOINTS } from "@/utils/endpoints";
import { routes } from "@/utils/routes";

const SOMETHING_WENT_WRONG = "OOPS! Something went wrong";
const BASE_URL = ENDPOINTS.BASE_URL || "";

export const STATUS_CODE = {
  success: 200,
  invalid: 400,
  timeout: 408,
  notFound: 204,
  badRequest: 400,
  userDelete: 410,
  serverError: 500,
  Unauthorized: 401,
  successAction: 201,
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

/** Rejects from axios interceptor (`{ message, status }`) — network/timeout already toasted in interceptor. */
export function interceptorHandledNetworkOrTimeout(error: unknown): boolean {
  const e = error as { status?: number };
  return e?.status === 0 || e?.status === STATUS_CODE.timeout;
}

const sessionExpireHandler = () => {
  storage.removeItem("access_token");
  storage.removeItem("refresh_token");
  storage.removeItem("idToken");
  if (typeof window !== "undefined") {
    window.location.replace(routes.LOGIN);
  }
};

const createAxiosInstance = (
  baseURL: string,
  headers: Record<string, string> = {},
): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers,
  });

  instance.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = storage.getItem("idToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log("[api] request", config.method?.toUpperCase(), config.url, token ? "(auth)" : "(anon)");
    return config;
  });

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

      const body = axiosError.response?.data as unknown;
      const message =
        parseBackendMessageBody(body) ??
        (typeof body === "string" && body.trim() ? body.trim() : undefined) ??
        axiosError.response?.statusText ??
        axiosError.message ??
        SOMETHING_WENT_WRONG;

      const status: number = axiosError.response?.status ?? axiosError.status ?? 0;

      const refreshToken = storage.getItem("refresh_token");
      const errBody = (body as { detail?: string } | undefined) ?? undefined;

      if (
        status === STATUS_CODE.Unauthorized &&
        originalReq &&
        !originalReq._retry &&
        refreshToken &&
        errBody?.detail === "INVALID TOKEN"
      ) {
        originalReq._retry = true;
        try {
          console.log("[api] attempting refresh token flow");
          const res = await instance.post(ENDPOINTS.AUTH.REFRESH_TOKEN, {
            refresh_token: refreshToken,
          });
          const payload = (res.data?.data ?? res.data) as {
            access_token?: string;
            refresh_token?: string;
            idToken?: string;
          };
          if (payload?.access_token) storage.setItem("access_token", payload.access_token);
          if (payload?.refresh_token) storage.setItem("refresh_token", payload.refresh_token);
          if (payload?.idToken) storage.setItem("idToken", payload.idToken);
          return instance.request(originalReq);
        } catch (refreshError) {
          console.log("[api] refresh token failed", refreshError);
          sessionExpireHandler();
          return Promise.reject({ message, status });
        }
      }

      if (status === STATUS_CODE.Unauthorized) {
        sessionExpireHandler();
      }

      return Promise.reject({ message, status });
    },
  );

  return instance;
};

export const api = createAxiosInstance(BASE_URL, {
  "Content-Type": "application/json",
});

/**
 * Lightweight error toast wrapper
 * `Api.handleError(err, title)` helper, but tailored to the
 * `{ message, status }` shape produced by our interceptor.
 */
export function handleApiError(error: unknown, title?: string): void {
  if (interceptorHandledNetworkOrTimeout(error)) return;
  const e = error as { message?: string; status?: number };
  if (e?.status === STATUS_CODE.Unauthorized) return;
  const message = e?.message || SOMETHING_WENT_WRONG;
  console.log("[api] handleApiError", title, message);
  SHOW_ERROR_TOAST(title ? `${title}: ${message}` : message);
}
