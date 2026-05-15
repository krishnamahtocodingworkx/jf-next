// Yup schemas for every Formik form in the app. Each schema is exported both as a factory (for fresh instances)
// and as a cached default at the bottom of the file (preferred for Formik's `validationSchema` prop).
import * as Yup from "yup";
import { AUTH_CONSTANTS } from "@/utils/constants";
import { isValidMongoObjectId } from "@/utils/commonFunctions";
import type { AddProductFormValues, AddProductPickedIngredient } from "@/utils/model";
import {
  emailRegExp,
  passRegExp,
  passwordError,
  phoneRegExp,
  nameRegExp,
} from "@/utils/validation";

/** Login form — email + strong password. */
export const LoginSchema = () =>
  Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Enter the required field")
      .matches(emailRegExp, "Please enter valid Email"),
    password: Yup.string()
      .trim()
      .required("Enter the required field")
      .max(16, "Password should be maximum of 16 characters")
      .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, `Password should be minimum of ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`)
      .matches(passRegExp, passwordError),
  });

/** Register form — full profile + strong password + match confirm. */
export const RegisterSchema = () =>
  Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("Enter your first name")
      .min(2, "First name should be minimum of 2 characters")
      .max(20, "First name should be maximum of 20 characters")
      .matches(nameRegExp, "Please enter a valid name"),
    lastName: Yup.string()
      .trim()
      .required("Enter your last name")
      .min(2, "Last name should be minimum of 2 characters")
      .max(20, "Last name should be maximum of 20 characters")
      .matches(nameRegExp, "Please enter a valid name"),
    company: Yup.string().trim().required("Company is required"),
    companyType: Yup.string().trim().required("Company type is required"),
    phoneNumber: Yup.string()
      .trim()
      .required("Enter your phone number")
      .matches(phoneRegExp, "Please enter a valid phone number."),
    jobTitle: Yup.string().trim().required("Job Title is required"),
    city: Yup.string().trim().required("City is required"),
    state: Yup.string().trim().required("State is required"),
    country: Yup.string().trim().required("Country is required"),
    email: Yup.string()
      .trim()
      .required("Enter the required field")
      .matches(emailRegExp, "Please enter valid Email"),
    password: Yup.string()
      .trim()
      .required("Enter the required field")
      .max(16, "Password should be maximum of 16 characters")
      .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, `Password should be minimum of ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`)
      .matches(passRegExp, passwordError),
    confirmPassword: Yup.string()
      .trim()
      .required("Enter the required field")
      .oneOf([Yup.ref("password")], "Password and Confirm Password must match"),
  });

/** Forgot password — only the email field. */
export const ForgotPasswordSchema = () =>
  Yup.object().shape({
    email: Yup.string()
      .trim()
      .required("Enter the required field")
      .matches(emailRegExp, "Please enter valid Email"),
  });

/** Recovery / reset password — new password + confirm. */
export const RecoveryPasswordSchema = () =>
  Yup.object().shape({
    password: Yup.string()
      .trim()
      .required("Enter the required field")
      .max(16, "Password should be maximum of 16 characters")
      .min(AUTH_CONSTANTS.PASSWORD_MIN_LENGTH, `Password should be minimum of ${AUTH_CONSTANTS.PASSWORD_MIN_LENGTH} characters`)
      .matches(passRegExp, passwordError),
    confirmPassword: Yup.string()
      .trim()
      .required("Enter the required field")
      .oneOf([Yup.ref("password")], "Password and Confirm Password must match"),
  });

// Cached schemas — preferred for Formik `validationSchema` so Yup doesn't rebuild the tree per render.
export const loginSchema = LoginSchema();
export const registerSchema = RegisterSchema();
export const forgotPasswordSchema = ForgotPasswordSchema();
export const recoveryPasswordSchema = RecoveryPasswordSchema();

/** Add Product form — company id + product name + optional manufacturer (Mongo-style ids). */
export const AddProductFormSchema = () =>
  Yup.object({
    company: Yup.string()
      .trim()
      .required("Please select a company from the list.")
      .test("company-id", "Please select a company from the list.", (v) =>
        isValidMongoObjectId(String(v ?? "").trim()),
      ),
    name: Yup.string().trim().required("Product name is required"),
    manufacturer: Yup.string().test(
      "manufacturer-id",
      "Please select a manufacturer from the list, or leave it blank.",
      (v) => {
        const s = String(v ?? "").trim();
        if (!s) return true;
        return isValidMongoObjectId(s);
      },
    ),
    category: Yup.string().default(""),
    productType: Yup.string().default(""),
    subcategory: Yup.string().default(""),
    sku: Yup.string().default(""),
    brand: Yup.string().default(""),
    flavor: Yup.string().default(""),
    dateCreated: Yup.string().default(""),
    fulfilmentDate: Yup.string().default(""),
    servingSize: Yup.string().default("0"),
    servingUnit: Yup.string().default("g"),
    status: Yup.mixed<AddProductFormValues["status"]>()
      .oneOf(["active", "concept", "discontinued"])
      .default("active"),
    guavaEnabled: Yup.boolean().default(true),
    hasAdditives: Yup.boolean().default(false),
    guavaScore: Yup.string().default(""),
    upcCode: Yup.string().default(""),
    cost: Yup.string().default("0"),
    retailCost: Yup.string().default("0"),
    country: Yup.string().default(""),
    currency: Yup.string().default(""),
    objectives: Yup.array().of(Yup.string().defined()).default([]),
    notes: Yup.string().default(""),
  });

/** Cached instance used by the Add Product panel. */
export const addProductFormSchema = AddProductFormSchema();

/** Returns the first form-level error message (e.g. for inline display in the panel header). */
export function getAddProductFormValidationError(
  values: AddProductFormValues,
): string | undefined {
  try {
    addProductFormSchema.validateSync(values, { abortEarly: true });
    return undefined;
  } catch (e) {
    if (e instanceof Yup.ValidationError) return e.message;
    return "Validation failed.";
  }
}

/** Cross-row validator for the ingredient list (Yup can't easily express "every weight > 0"). */
export function getAddProductIngredientSelectionError(
  picked: AddProductPickedIngredient[],
): string | undefined {
  if (picked.some((i) => Number(i.weight) <= 0)) {
    return "Each selected ingredient must have weight greater than 0.";
  }
  return undefined;
}
