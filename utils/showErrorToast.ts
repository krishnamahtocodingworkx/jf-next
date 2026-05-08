import toast from "react-hot-toast";
import { getErrorMessage } from "@/utils/commonFunctions";

export function showErrorToast(error: unknown, fallbackMessage = "Something went wrong") {
  const message = getErrorMessage(error, fallbackMessage);
  console.log("[auth] error toast", message, error);
  toast.error(message);
}
