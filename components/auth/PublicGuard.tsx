"use client";

// Route guard for `/auth/*` — bounces already-signed-in users into the app instead of showing them auth screens.
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks";
import { routes } from "@/utils/routes";

type PublicGuardProps = {
  children: React.ReactNode;
};

/** Wrap public-only route subtrees with this; the auth layout uses it for the entire `/auth` tree. */
export default function PublicGuard({ children }: PublicGuardProps) {
  const router = useRouter();
  const isLoggedIn = useAppSelector((state) => state.user.isLoggedIn);

  useEffect(() => {
    if (isLoggedIn) {
      router.replace(routes.APP_HOME);
    }
  }, [isLoggedIn, router]);

  // Hide the auth UI for a frame while the redirect resolves.
  if (isLoggedIn) {
    return null;
  }

  return <>{children}</>;
}
