"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { routes } from "@/utils/routes";

type PublicGuardProps = {
  children: React.ReactNode;
};

export default function PublicGuard({ children }: PublicGuardProps) {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("[PublicGuard] logged-in user redirected to app home");
      router.replace(routes.APP_HOME);
    }
  }, [isLoggedIn, router]);

  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
