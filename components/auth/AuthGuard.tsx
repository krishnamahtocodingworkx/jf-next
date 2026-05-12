"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { routes } from "@/utils/routes";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("[AuthGuard] blocked unauthenticated route access");
      router.replace(routes.LOGIN);
      return;
    }
    console.log("[AuthGuard] authenticated route access allowed");
    setChecked(true);
  }, [isLoggedIn, router]);

  if (!isLoggedIn || !checked) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
