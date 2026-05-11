export const ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  AUTH: {
    LOGIN: "/api/v1/users/login",
    REGISTER: "/api/v1/users/register",
    REFRESH_TOKEN: "/api/v1/auth/refresh-token",
    LOGOUT: "/api/v1/auth/logout",
  },
  PROFILE: {
    COMPANY_TYPE: "/api/v1/profile_company_type/",
  },
  COUNTRY: {
    GET_ALL: "/api/v1/country/get-all-countries",
  },
  INGREDIENTS: {
    GET: "/api/v1/ingredient/get-ingredient-list",
    ADD: "/api/v1/ingredient/add-ingredient"
  },
  PRODUCTS: {
    GET: "/api/v1/product/get-product-list",
  }
} as const;
