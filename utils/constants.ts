export const AUTH_CONSTANTS = {
  ROLE_COMPANY_ADMIN: "company_admin",
  PASSWORD_MIN_LENGTH: 8,
} as const;

export const UI_LIMITS = {
  AUTH_CARD_MAX_WIDTH: "max-w-md",
  AUTH_WIDE_CARD_MAX_WIDTH: "max-w-2xl",
} as const;

export enum USER_ROLES {
  JF_ADMIN = "Journey food Admin",
  JF_STAFF = "Journey foods staff",
  JF_DATA = "Journey foods data",
  COMPANY_ADMIN = "Company Admin",
  COMPANY_USER = "Company User"
}