"use client";

// `/auth/forgot-password` — submits the email, then `forgotPassword` thunk fires the Firebase reset email.
import Link from "next/link";
import { Formik } from "formik";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { routes } from "@/utils/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { forgotPassword } from "@/redux/user/user-thunks";
import { FORGOT_PASSWORD_INITIAL_VALUES } from "@/utils/initialValues";
import { AUTH_STRINGS } from "@/utils/strings";
import { visibleFormikFieldError } from "@/utils/commonFunctions";
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
        validateOnMount={false}
        onSubmit={async (values) => {
          try {
            await dispatch(forgotPassword(values.email)).unwrap();
          } catch {
            /* Toasts shown in forgotPassword thunk */
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
              error={visibleFormikFieldError(formik.touched.email, formik.submitCount, formik.errors.email)}
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
