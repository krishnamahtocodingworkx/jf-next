"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { routes } from "@/utils/routes";

export default function HomePage() {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("[HomePage] logged-in user routed to app home");
      router.replace(routes.APP_HOME);
    } else {
      console.log("[HomePage] guest routed to login");
      router.replace(routes.LOGIN);
    }
  }, [isLoggedIn, router]);

  return null;
}
