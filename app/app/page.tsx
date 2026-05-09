"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logout } from "@/redux/user/user-slice";
import { LOGOUT_TOAST } from "@/utils/showToast";
import { AUTH_STRINGS } from "@/utils/strings";
import { routes } from "@/utils/routes";

export default function AppHomePage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoggedIn, user } = useAppSelector((state) => state.user);

  useEffect(() => {
    if (!isLoggedIn) router.push(routes.LOGIN);
  }, [isLoggedIn, router]);

  if (!isLoggedIn) {
    return null;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-xl rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <h1 className="mb-2 text-2xl font-semibold text-slate-900">Authenticated</h1>
        <p className="mb-5 text-slate-600">
          Welcome {user?.firstName || user?.email}. Auth flow is now wired with Redux + thunk + axios.
        </p>
        <button
          onClick={() => {
            console.log("[auth] Logout clicked");
            dispatch(logout());
            LOGOUT_TOAST(AUTH_STRINGS.logout.successToast);
              console.log("[auth] logout success toast shown");
            router.push(routes.LOGIN);
          }}
          className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-800"
        >
          Logout
        </button>
      </div>
    </main>
  );
}
