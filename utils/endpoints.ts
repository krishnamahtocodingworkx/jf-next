const API = "/api/v1";

export const ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || "",
  AUTH: {
    LOGIN: `${API}/users/login`,
    REGISTER: `${API}/users/register`,
    REFRESH_TOKEN: `${API}/auth/refresh-token`,
    LOGOUT: `${API}/auth/logout`,
  },
  PROFILE: {
    COMPANY_TYPE: `${API}/profile_company_type/`,
  },
  COUNTRY: {
    GET_ALL: `${API}/country/get-all-countries`,
  },
  USER: {
    PROFILE: `${API}/users/`,
    PERMISSIONS: `${API}/user/access-permissions`,
    BRANDS: `${API}/user/brands/`,
  },
  COMPANY: {
    /** List companies for selects (Add Product), aligned with JourneyFoodsDashboardUpgraded. */
    LIST_FOR_SELECT: `${API}/companies/`,
  },
  PRODUCT_BRAND: {
    GET_BY_ID: (productId: string) => `${API}/productBrand/get-product-brand/${productId}`,
  },
  INGREDIENT: {
    GET_INGREDIENT_LIST: `${API}/ingredient/get-ingredient-list`,
    ADD_INGREDIENT: `${API}/ingredient/add-ingredient`,
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
  ANALYTICS: {
    INGREDIENT_USAGE: `${API}/ingredients/usage/`,
  },
} as const;
