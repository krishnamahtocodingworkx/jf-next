"use client";

import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Formik } from "formik";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { routes } from "@/utils/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { resetPassword } from "@/redux/user/user-thunks";
import { RECOVERY_PASSWORD_INITIAL_VALUES } from "@/utils/initialValues";
import { AUTH_STRINGS } from "@/utils/strings";
import { notifyRecoveryLinkInvalid } from "@/utils/showErrorToast";
import { visibleFormikFieldError } from "@/utils/commonFunctions";
import { recoveryPasswordSchema } from "@/utils/validationSchema";

export default function RecoveryPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
  const code = searchParams.get("oobCode");

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">{AUTH_STRINGS.recoveryPassword.title}</h1>

      <Formik
        initialValues={RECOVERY_PASSWORD_INITIAL_VALUES}
        validationSchema={recoveryPasswordSchema}
        validateOnMount={false}
        onSubmit={async (values) => {
          if (!code) {
            notifyRecoveryLinkInvalid();
            return;
          }
          try {
            await dispatch(resetPassword({ code, password: values.password })).unwrap();
            console.log("[auth] Password reset success", code);
            router.push(routes.LOGIN);
          } catch {
            /* Toasts shown in resetPassword thunk */
          }
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <AuthInput
              name="password"
              type="password"
              placeholder="New password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={visibleFormikFieldError(formik.touched.password, formik.submitCount, formik.errors.password)}
            />
            <AuthInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={visibleFormikFieldError(
                formik.touched.confirmPassword,
                formik.submitCount,
                formik.errors.confirmPassword,
              )}
            />
            <AuthSubmitButton
              label={AUTH_STRINGS.recoveryPassword.submit}
              loadingLabel={AUTH_STRINGS.recoveryPassword.submitLoading}
              isLoading={loading}
              disabled={!formik.isValid}
            />
            <div className="text-center text-sm">
              <Link href={routes.LOGIN} className="text-teal-600 hover:text-teal-700">
                {AUTH_STRINGS.recoveryPassword.backToLogin}
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
