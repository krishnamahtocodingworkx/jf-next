"use client";

// Root `/` route — pure redirector. Sends signed-in users into the app, everyone else to the login page.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { routes } from "@/utils/routes";

export default function HomePage() {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    router.replace(isLoggedIn ? routes.APP_HOME : routes.LOGIN);
  }, [isLoggedIn, router]);

  return null;
}
