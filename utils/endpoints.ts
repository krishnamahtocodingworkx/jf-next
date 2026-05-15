// Centralised API route table — every service reads URLs from here so we never hardcode paths in callers.

/** Base path prefix every backend route is mounted under. */
const API = "/api/v1";

/** Single source of truth for backend URLs; functions in here build dynamic paths (e.g. `PRODUCTS.REMOVE(id)`). */
export const ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  AUTH: {
    LOGIN: `${API}/users/login`,
    REGISTER: `${API}/users/register`,
    REFRESH_TOKEN: `${API}/users/refresh-token`,
    LOGOUT: `${API}/users/logout`,
  },
  PROFILE: {
    COMPANY_TYPE: `${API}/companyType/company-type-list`,
  },
  COUNTRY: {
    GET_ALL: `${API}/country/get-all-countries`,
  },
  USER: {
    PROFILE: `${API}/users/`,
    PERMISSIONS: `${API}/user/access-permissions`,
  },
  COMPANY: {
    /** List companies for selects (Add Product), */
    LIST_FOR_SELECT: `${API}/companies/`,
  },
  PRODUCT_BRAND: {
    /** All brands for Add Product select. */
    LIST: `${API}/productBrand/get-product-brand`,
  },
  INGREDIENT: {
    GET_INGREDIENT_LIST: `${API}/ingredient/get-ingredient-list`,
  },
  INGREDIENTS: {
    SEARCH: (name: string) => `${API}/ingredients/${encodeURIComponent(name)}/search/`,
    STARRED: `${API}/ingredients/star/`,
  },
  PRODUCTS: {
    LIST: `${API}/user/products/`,
    /** Manufacturer list for Add Product ( `USER.MANUFACTURERS`). */
    MANUFACTURERS: `${API}/products/manufacturers/`,
    GET_PRODUCT_LIST: `${API}/product/get-product-list`,
    CREATE_PRODUCT: `${API}/product/create-product`,
    /** v1 product metrics / overview (detail page). */
    PRODUCT_DETAIL: (id: string) => `${API}/product/product-detail/${encodeURIComponent(id)}`,
    BY_ID: (id: string) => `${API}/user/products/${id}/`,
    GENERATE: `${API}/user/products/?generate_recommendation=true`,
    REMOVE: (id: string) => `${API}/user/products/${id}/`,
    DUPLICATE: (id: string) => `${API}/user/products/${id}/duplicate/`,
    NEW_VERSION: (id: string) => `${API}/user/products/${id}/new_version/`,
    IMAGE_UPLOAD: (productId: string) => `${API}/products/${productId}/imageUpload/`,
  },
  CURRENCY: {
    LIST: `${API}/currency/currency-list`,
  },
  PRODUCT_TYPE: {
    CATEGORY_LIST: `${API}/productType/category-list`,
  },
  ANALYTICS: {
    INGREDIENT_USAGE: `${API}/ingredients/usage/`,
  },
} as const;
