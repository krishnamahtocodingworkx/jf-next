import { toast } from "react-hot-toast";
import { extractSuccessMessage } from "@/utils/commonFunctions";

/**
 * Toast helpers aligned with purpose-codes-platform-user-panel `showToast.ts`.
 */

const SHOW_ERROR_TOAST = (message = "OOPS! something went wrong") => {
  toast.dismiss();
  message = message.toString();
  toast.error(message);
};

export const SHOW_INTERNET_TOAST = () => {
  toast.dismiss();
  toast.error("Please check your internet connections.");
};

export const LOGOUT_TOAST = (message = "Logout Successful") => {
  toast.dismiss();
  message = message.toString();
  toast.success(message);
};

export const SUCCESS_TOAST = (message = "Successful") => {
  message = message.toString();
  toast.success(message);
};

export default SHOW_ERROR_TOAST;

/** Success toast when the API payload includes a message field (used from Redux thunks). */
export function notifyApiSuccessToast(payload: unknown) {
  const msg = extractSuccessMessage(payload);
  if (msg) {
    console.log("[auth] success toast", msg);
    SUCCESS_TOAST(msg);
  } else {
    console.log("[toast] no API message field in response", payload);
  }
}
