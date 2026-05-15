// Toast helpers — thin wrappers around `react-hot-toast` so callers don't import the library directly.
import { toast } from "react-hot-toast";
import { extractSuccessMessage } from "@/utils/commonFunctions";

/** Dismisses any existing toast first to prevent stacked notifications. */
const SHOW_ERROR_TOAST = (message = "OOPS! something went wrong") => {
  toast.dismiss();
  message = message.toString();
  toast.error(message);
};

/** Specific toast shown by the axios interceptor on network failure. */
export const SHOW_INTERNET_TOAST = () => {
  toast.dismiss();
  toast.error("Please check your internet connections.");
};

/** Confirmation toast for explicit logout actions. */
export const LOGOUT_TOAST = (message = "Logout Successful") => {
  toast.dismiss();
  message = message.toString();
  toast.success(message);
};

/** Generic success toast. */
export const SUCCESS_TOAST = (message = "Successful") => {
  message = message.toString();
  toast.success(message);
};

export default SHOW_ERROR_TOAST;

/** Surfaces the backend's success message (if any) from an API envelope; called from Redux thunks on `fulfilled`. */
export function notifyApiSuccessToast(payload: unknown) {
  const msg = extractSuccessMessage(payload);
  if (msg) SUCCESS_TOAST(msg);
}
