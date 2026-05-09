import SHOW_ERROR_TOAST from "@/utils/showToast";
import { extractApiErrorMessage } from "@/utils/commonFunctions";
import { AUTH_STRINGS } from "@/utils/strings";

/** Error toast only when a message is extracted (API / serialized / Axios / Error). */
export function showErrorToast(error: unknown) {
  const message = extractApiErrorMessage(error);
  if (message) {
    console.log("[auth] error toast", message, error);
    SHOW_ERROR_TOAST(message);
  } else if (process.env.NODE_ENV === "development") {
    console.log("[toast] no extractable error message; toast skipped", error);
  }
}

export function notifyLoginApiError(error: unknown) {
  showErrorToast(error);
}

export function notifyRegisterApiError(error: unknown) {
  showErrorToast(error);
}

export function notifyForgotPasswordApiError(error: unknown) {
  showErrorToast(error);
}

export function notifyResetPasswordApiError(error: unknown) {
  showErrorToast(error);
}

export function notifyRecoveryLinkInvalid() {
  SHOW_ERROR_TOAST(AUTH_STRINGS.recoveryPassword.invalidLink);
}
