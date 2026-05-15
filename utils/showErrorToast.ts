// Named error-toast helpers — auth thunks call these on `rejected`. Routing the messages through dedicated
// functions makes future per-flow tweaks (i18n, instrumentation) easy.
import SHOW_ERROR_TOAST from "@/utils/showToast";
import { extractApiErrorMessage } from "@/utils/commonFunctions";
import { AUTH_STRINGS } from "@/utils/strings";

/** Only toast when we can actually extract a message — silent otherwise so we don't double-toast. */
export function showErrorToast(error: unknown) {
  const message = extractApiErrorMessage(error);
  if (message) SHOW_ERROR_TOAST(message);
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

/** Specialised toast for the recovery-password landing page when the `oobCode` is missing/expired. */
export function notifyRecoveryLinkInvalid() {
  SHOW_ERROR_TOAST(AUTH_STRINGS.recoveryPassword.invalidLink);
}
