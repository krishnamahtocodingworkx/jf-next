import axios, {
  AxiosError,
  AxiosInstance,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
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
    console.log("[auth] API request", config.method?.toUpperCase(), config.url);
    return config;
  });

  instance.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error): Promise<ErrorResponse> => {
      const axiosError = error as AxiosError<{
        message?: string;
        error?: { message?: string };
      }>;

      const message =
        axiosError.response?.data?.error?.message ??
        axiosError.response?.data?.message ??
        axiosError.response?.statusText ??
        axiosError.message ??
        SOMETHING_WENT_WRONG;

      const status: number = axiosError.response?.status ?? axiosError.status ?? 0;

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
