"use client";

// Route guard for `(app)/*` — redirects unauthenticated users back to `/auth/login` and renders a placeholder while checking.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { routes } from "@/utils/routes";

type AuthGuardProps = {
  children: React.ReactNode;
};

/** Wrap authenticated route subtrees with this to enforce a logged-in Redux state. */
export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  // Redirect after render so the router is ready; the early return below hides protected UI in the meantime.
  useEffect(() => {
    if (!isLoggedIn) {
      router.replace(routes.LOGIN);
    }
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-sm text-slate-500">
        Checking session...
      </div>
    );
  }

  return <>{children}</>;
}
