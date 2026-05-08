"use client";

import Link from "next/link";
import { Formik } from "formik";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { routes } from "@/utils/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { forgotPassword } from "@/redux/user/user-thunks";
import { FORGOT_PASSWORD_INITIAL_VALUES } from "@/utils/initialValues";
import { AUTH_STRINGS } from "@/utils/strings";
import { showToast } from "@/utils/showToast";
import { showErrorToast } from "@/utils/showErrorToast";
import { forgotPasswordSchema } from "@/utils/validationSchema";

export default function ForgotPasswordPage() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-2 text-center text-2xl font-semibold text-slate-900">{AUTH_STRINGS.forgotPassword.title}</h1>
      <p className="mb-6 text-center text-sm text-slate-500">{AUTH_STRINGS.forgotPassword.subtitle}</p>

      <Formik
        initialValues={FORGOT_PASSWORD_INITIAL_VALUES}
        validationSchema={forgotPasswordSchema}
        onSubmit={async (values) => {
          try {
            await dispatch(forgotPassword(values.email)).unwrap();
            console.log("[auth] Forgot password requested", values.email);
            showToast(AUTH_STRINGS.forgotPassword.success);
          } catch (error) {
            showErrorToast(error, AUTH_STRINGS.forgotPassword.errorFallback);
          }
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <AuthInput
              name="email"
              placeholder="Email address"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.email ? formik.errors.email : undefined}
            />
            <AuthSubmitButton
              label={AUTH_STRINGS.forgotPassword.submit}
              loadingLabel={AUTH_STRINGS.forgotPassword.submitLoading}
              isLoading={loading}
              disabled={!formik.isValid}
            />
            <div className="text-center text-sm">
              <Link href={routes.LOGIN} className="text-teal-600 hover:text-teal-700">
                {AUTH_STRINGS.forgotPassword.backToLogin}
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
