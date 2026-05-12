"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Formik } from "formik";
import { AuthInput } from "@/components/auth/AuthInput";
import { AuthSelect } from "@/components/auth/AuthSelect";
import { AuthSubmitButton } from "@/components/auth/AuthSubmitButton";
import { AuthSuccessCard } from "@/components/auth/AuthSuccessCard";
import { routes } from "@/utils/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/user/user-thunks";
import { companyService } from "@/services/company-service";
import { userService } from "@/services/user-service";
import { REGISTER_INITIAL_VALUES } from "@/utils/initialValues";
import { AUTH_STRINGS } from "@/utils/strings";
import { AUTH_CONSTANTS } from "@/utils/constants";
import { visibleFormikFieldError } from "@/utils/commonFunctions";
import { registerSchema } from "@/utils/validationSchema";

export default function RegisterPage() {
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((state) => state.user);
  const [isSuccess, setIsSuccess] = useState(false);
  const [successEmail, setSuccessEmail] = useState("");
  const [companyTypes, setCompanyTypes] = useState<Array<{ id: string; title: string }>>([]);
  const [countries, setCountries] = useState<Array<{ id: string; name: string }>>([]);

  useEffect(() => {
    (async () => {
      try {
        const [types, normalizedCountries] = await Promise.all([
          companyService.getProfileCompanyTypes(),
          userService.getCountries(),
        ]);
        setCompanyTypes(types);
        setCountries(normalizedCountries);
      } catch (error) {
        console.log("[auth] register options fetch failed", error);
      }
    })();
  }, []);

  const countryOptions = useMemo(
    () => [...countries].sort((a, b) => a.name.localeCompare(b.name)),
    [countries],
  );

  if (isSuccess) {
    return (
      <AuthSuccessCard
        title={AUTH_STRINGS.register.successTitle}
        description={
          <>
            {AUTH_STRINGS.register.successBodyPrefix} <span className="font-medium">{successEmail}</span>{" "}
            {AUTH_STRINGS.register.successBodySuffix}
          </>
        }
        ctaLabel={AUTH_STRINGS.register.login}
        ctaHref={routes.LOGIN}
      />
    );
  }

  return (
    <div className="w-full max-w-2xl rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
      <h1 className="mb-6 text-center text-2xl font-semibold text-slate-900">{AUTH_STRINGS.register.title}</h1>

      <Formik
        initialValues={REGISTER_INITIAL_VALUES}
        validationSchema={registerSchema}
        validateOnMount={false}
        onSubmit={async (values) => {
          try {
            await dispatch(
              registerUser({
                firstName: values.firstName,
                lastName: values.lastName,
                company: values.company,
                companyType: values.companyType,
                phoneNumber: values.phoneNumber,
                jobTitle: values.jobTitle,
                city: values.city,
                state: values.state,
                country: values.country,
                email: values.email,
                password: values.password,
                role: AUTH_CONSTANTS.ROLE_COMPANY_ADMIN,
              }),
            ).unwrap();
            console.log("[auth] Register success", values.email);
            setSuccessEmail(values.email);
            setIsSuccess(true);
          } catch {
            /* Toasts shown in registerUser thunk */
          }
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 items-start gap-3">
              <AuthInput
                name="firstName"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(
                  formik.touched.firstName,
                  formik.submitCount,
                  formik.errors.firstName,
                )}
              />
              <AuthInput
                name="lastName"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(formik.touched.lastName, formik.submitCount, formik.errors.lastName)}
              />
            </div>
            <div className="grid grid-cols-2 items-start gap-3">
              <AuthInput
                name="company"
                placeholder="Company"
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(formik.touched.company, formik.submitCount, formik.errors.company)}
              />
              <AuthSelect
                name="companyType"
                placeholder="Select Company Type"
                value={formik.values.companyType}
                options={companyTypes.map((option) => ({ value: option.id, label: option.title }))}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(
                  formik.touched.companyType,
                  formik.submitCount,
                  formik.errors.companyType,
                )}
              />
            </div>
            <div className="grid grid-cols-2 items-start gap-3">
              <AuthInput
                name="phoneNumber"
                placeholder="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(
                  formik.touched.phoneNumber,
                  formik.submitCount,
                  formik.errors.phoneNumber,
                )}
              />
              <AuthInput
                name="jobTitle"
                placeholder="Job Title"
                value={formik.values.jobTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(formik.touched.jobTitle, formik.submitCount, formik.errors.jobTitle)}
              />
            </div>
            <div className="grid grid-cols-2 items-start gap-3">
              <AuthInput
                name="city"
                placeholder="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(formik.touched.city, formik.submitCount, formik.errors.city)}
              />
              <AuthInput
                name="state"
                placeholder="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(formik.touched.state, formik.submitCount, formik.errors.state)}
              />
            </div>
            <div className="grid grid-cols-2 items-start gap-3">
              <AuthSelect
                name="country"
                placeholder="Select Country"
                value={formik.values.country}
                options={countryOptions.map((option) => ({ value: option.id || option.name, label: option.name }))}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(formik.touched.country, formik.submitCount, formik.errors.country)}
              />
              <AuthInput
                name="email"
                placeholder="Email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(formik.touched.email, formik.submitCount, formik.errors.email)}
              />
            </div>
            <div className="grid grid-cols-2 items-start gap-3">
              <AuthInput
                name="password"
                type="password"
                placeholder="Password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(formik.touched.password, formik.submitCount, formik.errors.password)}
              />
              <AuthInput
                name="confirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={formik.values.confirmPassword}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={visibleFormikFieldError(
                  formik.touched.confirmPassword,
                  formik.submitCount,
                  formik.errors.confirmPassword,
                )}
              />
            </div>
            <AuthSubmitButton
              label={AUTH_STRINGS.register.submit}
              loadingLabel={AUTH_STRINGS.register.submitLoading}
              isLoading={loading}
              disabled={!formik.isValid || formik.isSubmitting}
            />
            <div className="text-center text-sm text-slate-500">
              {AUTH_STRINGS.register.hasAccount}{" "}
              <Link href={routes.LOGIN} className="font-medium text-teal-600 hover:text-teal-700">
                {AUTH_STRINGS.register.login}
              </Link>
            </div>
          </form>
        )}
      </Formik>
    </div>
  );
}
