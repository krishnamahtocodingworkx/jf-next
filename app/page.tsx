import { redirect } from "next/navigation";
import { routes } from "@/utils/routes";

export default function HomePage() {
  redirect(routes.LOGIN);
}
