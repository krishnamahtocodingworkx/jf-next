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
import { signInWithCustomToken } from "firebase/auth";
import { auth } from "@/lib/firebase";

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
  localStorage.clear();
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

  instance.interceptors.request.use(async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const { store } = await import("@/redux/store");
    const token = store.getState().user.idToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  // instance.interceptors.response.use(
  //   (response: AxiosResponse) => response,
  //   async (error): Promise<ErrorResponse | AxiosResponse> => {
  //     const axiosError = error as AxiosError;
  //     const originalReq = axiosError.config as RetriableConfig | undefined;

  //     if (!axiosError.response) {
  //       if (axiosError.code === "ECONNABORTED") {
  //         SHOW_ERROR_TOAST("Request timeout. Please try again.");
  //         return Promise.reject({
  //           message: "Request timeout. Please try again.",
  //           status: STATUS_CODE.timeout,
  //         });
  //       }
  //       SHOW_INTERNET_TOAST();
  //       return Promise.reject({
  //         message: "Network error. Please check your internet connection.",
  //         status: 0,
  //       });
  //     }

  //     const body = axiosError.response?.data as unknown;
  //     const message =
  //       parseBackendMessageBody(body) ??
  //       (typeof body === "string" && body.trim() ? body.trim() : undefined) ??
  //       axiosError.response?.statusText ??
  //       axiosError.message ??
  //       SOMETHING_WENT_WRONG;

  //     const status: number = axiosError.response?.status ?? axiosError.status ?? 0;
  //     const store = await import("@/redux/store");
  //     const refreshToken = store.store.getState().user.refreshToken;
  //     const errBody = (body as { detail?: string } | undefined) ?? undefined;
  //     console.log("refresh token :", refreshToken);
  //     debugger;
  //     if (
  //       status === STATUS_CODE.Unauthorized
  //       &&
  //       // originalReq &&
  //       originalReq &&
  //       refreshToken
  //       // errBody?.detail === "INVALID TOKEN"
  //     ) {
  //       console.log("inside refresh token")
  //       debugger;
  //       // originalReq._retry = true;
  //       try {
  //         const res = await axios.post(baseURL + ENDPOINTS.AUTH.REFRESH_TOKEN, {
  //           refresh_token: refreshToken,
  //         });
  //         console.log("refresh token response :", res);
  //         debugger;
  //         const accessToken = res.data.data?.accessToken;
  //         const res2 = await signInWithCustomToken(auth, accessToken);
  //         const idToken = await res2.user?.getIdToken();
  //         // save access token
  //         // save idToken in redux storage

  //         return instance.request(originalReq);
  //       } catch (refreshError) {
  //         console.log("[api] refresh token failed", refreshError);
  //         sessionExpireHandler();
  //         return Promise.reject({ message, status });
  //       }
  //     }
  //     console.log("outside of refresh token ");
  //     debugger;

  //     if (status === STATUS_CODE.Unauthorized) {
  //       sessionExpireHandler();
  //     }

  //     return Promise.reject({ message, status });
  //   },
  // );
  instance.interceptors.response.use(
    (response: AxiosResponse) => response,

    async (error): Promise<ErrorResponse | AxiosResponse> => {
      const axiosError = error as AxiosError;
      const originalReq = axiosError.config as RetriableConfig;

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
        (typeof body === "string" && body.trim()
          ? body.trim()
          : undefined) ??
        axiosError.response?.statusText ??
        axiosError.message ??
        SOMETHING_WENT_WRONG;

      const status =
        axiosError.response?.status ??
        axiosError.status ??
        0;

      // =========================
      // REFRESH TOKEN FLOW
      // =========================

      if (
        status === STATUS_CODE.Unauthorized &&
        originalReq &&
        !originalReq._retry
      ) {
        originalReq._retry = true;

        try {
          const { store } = await import("@/redux/store");

          const state = store.getState();

          const refreshToken = state.user.refreshToken;

          if (!refreshToken) {
            sessionExpireHandler();

            return Promise.reject({
              message: "Session expired",
              status,
            });
          }

          // refresh api call
          const refreshResponse = await axios.post(
            BASE_URL + ENDPOINTS.AUTH.REFRESH_TOKEN,
            {
              refresh_token: refreshToken,
            }
          );

          // backend response
          const newAccessToken =
            refreshResponse.data.data?.accessToken;

          const newRefreshToken =
            refreshResponse.data.data?.refreshToken;

          // Firebase login again
          const firebaseRes = await signInWithCustomToken(
            auth,
            newAccessToken
          );

          const newIdToken =
            await firebaseRes.user.getIdToken();

          // save storage
          storage.setItem("access_token", newAccessToken);

          storage.setItem(
            "refresh_token",
            newRefreshToken || refreshToken
          );

          storage.setItem("idToken", newIdToken);

          // update redux
          const { updateTokens } = await import(
            "@/redux/user/user-slice"
          );

          store.dispatch(
            updateTokens({
              accessToken: newAccessToken,
              refreshToken: newRefreshToken,
              idToken: newIdToken,
            })
          );

          // update failed request token
          originalReq.headers.Authorization = `Bearer ${newIdToken}`;

          // retry request
          return instance(originalReq);
        } catch (refreshError) {
          console.log(
            "[api] refresh token failed",
            refreshError
          );

          sessionExpireHandler();

          return Promise.reject({
            message: "Session expired",
            status,
          });
        }
      }

      // =========================
      // NORMAL ERROR
      // =========================

      if (status === STATUS_CODE.Unauthorized) {
        sessionExpireHandler();
      }

      return Promise.reject({
        message,
        status,
      });
    }
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
