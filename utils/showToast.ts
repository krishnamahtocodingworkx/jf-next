import toast from "react-hot-toast";

export function showToast(message: string) {
  console.log("[auth] success toast", message);
  toast.success(message);
}
