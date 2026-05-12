"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { routes } from "@/utils/routes";

type PublicGuardProps = {
  children: React.ReactNode;
};

export default function PublicGuard({ children }: PublicGuardProps) {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isLoggedIn) {
      console.log("[PublicGuard] logged-in user redirected to app home");
      router.replace(routes.APP_HOME);
      return;
    }
    setChecked(true);
  }, [isLoggedIn, router]);

  if (isLoggedIn || !checked) {
    return null;
  }

  return <>{children}</>;
}
