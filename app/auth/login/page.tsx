"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Formik } from "formik";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { routes } from "@/utils/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
// import { loginUser } from "@/redux/user/user-thunks";
import { LOGIN_INITIAL_VALUES } from "@/utils/initialValues";
import { AUTH_STRINGS } from "@/utils/strings";
import { visibleFormikFieldError } from "@/utils/commonFunctions";
import { loginSchema } from "@/utils/validationSchema";
import { manualLogin } from "@/redux/user/user-thunks";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);

  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">{AUTH_STRINGS.login.title}</h1>

      <Formik
        initialValues={LOGIN_INITIAL_VALUES}
        validationSchema={loginSchema}
        validateOnMount={false}
        onSubmit={async (values) => {
          await dispatch(manualLogin(values)).unwrap().then((res) => {
            console.log("response login :", res);
            router.push(routes.OVERVIEW);
          })
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
            <AuthInput
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={visibleFormikFieldError(formik.touched.password, formik.submitCount, formik.errors.password)}
            />
            <AuthSubmitButton
              label={AUTH_STRINGS.login.submit}
              loadingLabel={AUTH_STRINGS.login.submitLoading}
              isLoading={loading}
              disabled={!formik.isValid}
            />
            <div className="text-center text-sm">
              <Link href={routes.FORGOT_PASSWORD} className="text-teal-600 hover:text-teal-700">
                {AUTH_STRINGS.login.forgotPassword}
              </Link>
            </div>
            <div className="text-center text-sm text-slate-500">
              {AUTH_STRINGS.login.needAccount}{" "}
              <Link href={routes.REGISTER} className="font-medium text-teal-600 hover:text-teal-700">
                {AUTH_STRINGS.login.createAccount}
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
