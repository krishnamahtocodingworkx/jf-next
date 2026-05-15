// Re-export cached Yup schemas so callers can import from `@/utils/validationSchema` (legacy path kept for stability).
export {
  ForgotPasswordSchema,
  LoginSchema,
  RecoveryPasswordSchema,
  RegisterSchema,
  forgotPasswordSchema,
  loginSchema,
  recoveryPasswordSchema,
  registerSchema,
} from "@/utils/schema";
