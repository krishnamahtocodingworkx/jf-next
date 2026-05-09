import SHOW_ERROR_TOAST from "@/utils/showToast";
import { getErrorMessage } from "@/utils/commonFunctions";
import { AUTH_STRINGS } from "@/utils/strings";

export function showErrorToast(error: unknown, fallbackMessage = "Something went wrong") {
  const message = getErrorMessage(error, fallbackMessage);
  console.log("[auth] error toast", message, error);
  SHOW_ERROR_TOAST(message);
}

/** Prefer these from Redux thunks so fallback strings stay in one place. */
export function notifyLoginApiError(error: unknown) {
  showErrorToast(error, AUTH_STRINGS.login.errorFallback);
}

export function notifyRegisterApiError(error: unknown) {
  showErrorToast(error, AUTH_STRINGS.register.errorFallback);
}

export function notifyForgotPasswordApiError(error: unknown) {
  showErrorToast(error, AUTH_STRINGS.forgotPassword.errorFallback);
}

export function notifyResetPasswordApiError(error: unknown) {
  showErrorToast(error, AUTH_STRINGS.recoveryPassword.errorFallback);
}

export function notifyRecoveryLinkInvalid() {
  SHOW_ERROR_TOAST(AUTH_STRINGS.recoveryPassword.invalidLink);
}
