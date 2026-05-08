"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Formik } from "formik";
import { AuthInput } from "@/components/auth/auth-input";
import { AuthSelect } from "@/components/auth/auth-select";
import { AuthSubmitButton } from "@/components/auth/auth-submit-button";
import { AuthSuccessCard } from "@/components/auth/auth-success-card";
import { routes } from "@/utils/routes";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { registerUser } from "@/redux/user/user-thunks";
import { companyService } from "@/services/company-service";
import { userService } from "@/services/user-service";
import { REGISTER_INITIAL_VALUES } from "@/utils/initialValues";
import { AUTH_STRINGS } from "@/utils/strings";
import { AUTH_CONSTANTS } from "@/utils/constants";
import { showToast } from "@/utils/showToast";
import { showErrorToast } from "@/utils/showErrorToast";
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
            showToast(AUTH_STRINGS.register.successToast);
          } catch (error) {
            showErrorToast(error, AUTH_STRINGS.register.errorFallback);
          }
        }}
      >
        {(formik) => (
          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <AuthInput
                name="firstName"
                placeholder="First Name"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.firstName ? formik.errors.firstName : undefined}
              />
              <AuthInput
                name="lastName"
                placeholder="Last Name"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.lastName ? formik.errors.lastName : undefined}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AuthInput
                name="company"
                placeholder="Company"
                value={formik.values.company}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.company ? formik.errors.company : undefined}
              />
              <AuthSelect
                name="companyType"
                placeholder="Select Company Type"
                value={formik.values.companyType}
                options={companyTypes.map((option) => ({ value: option.id, label: option.title }))}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.companyType ? formik.errors.companyType : undefined}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AuthInput
                name="phoneNumber"
                placeholder="Phone Number"
                value={formik.values.phoneNumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.phoneNumber ? formik.errors.phoneNumber : undefined}
              />
              <AuthInput
                name="jobTitle"
                placeholder="Job Title"
                value={formik.values.jobTitle}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.jobTitle ? formik.errors.jobTitle : undefined}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AuthInput
                name="city"
                placeholder="City"
                value={formik.values.city}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.city ? formik.errors.city : undefined}
              />
              <AuthInput
                name="state"
                placeholder="State"
                value={formik.values.state}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.state ? formik.errors.state : undefined}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <AuthSelect
                name="country"
                placeholder="Select Country"
                value={formik.values.country}
                options={countryOptions.map((option) => ({ value: option.id || option.name, label: option.name }))}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.country ? formik.errors.country : undefined}
              />
              <AuthInput
                name="email"
                placeholder="Email address"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email ? formik.errors.email : undefined}
              />
            </div>
            <AuthInput
              name="password"
              type="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password ? formik.errors.password : undefined}
            />
            <AuthInput
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmPassword ? formik.errors.confirmPassword : undefined}
            />
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
