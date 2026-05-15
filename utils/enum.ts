/**
 * Values aligned with `GET /api/v1/productType/category-list?category=…`
 * (`Beverages` | `Food` | `Supplements`).
 */
export enum ProductCategoryEnum {
    Beverages = "Beverages",
    Food = "Food",
    Supplements = "Supplements",
}

/** Category options for Add Product and similar selects. */
export const PRODUCT_CATEGORY_OPTIONS: { value: ProductCategoryEnum; label: string }[] = [
    { value: ProductCategoryEnum.Food, label: "Food" },
    { value: ProductCategoryEnum.Beverages, label: "Beverages" },
    { value: ProductCategoryEnum.Supplements, label: "Supplements" },
];

/**
 * `productTypes` returned for `category=Beverages` on category-list
 * (e.g. Water, Juice, Wine, …).
 */
export enum BeverageProductTypeEnum {
    Water = "Water",
    Juice = "Juice",
    Wine = "Wine",
    Liquor = "Liquor",
    Beer = "Beer",
    Coffee = "Coffee",
    NonCarbonated = "Non-Carbonated",
    Tea = "Tea",
    Smoothie = "Smoothie",
    Carbonated = "Carbonated",
}

/** Typical Food `subCategories` (Condiments, Snacks, Frozen). */
export enum FoodSubCategoryEnum {
    Condiments = "Condiments",
    Snacks = "Snacks",
    Frozen = "Frozen",
}

/** Ordered beverage product types for defaults / validation. */
export const BEVERAGE_PRODUCT_TYPE_LIST = Object.freeze(
    Object.values(BeverageProductTypeEnum) as BeverageProductTypeEnum[],
);

/** Ordered Food subcategories for defaults / validation. */
export const FOOD_SUB_CATEGORY_LIST = Object.freeze(
    Object.values(FoodSubCategoryEnum) as FoodSubCategoryEnum[],
);

/**
 * Static subcategory lists per category (API row may add more at runtime).
 * Beverages row in category-list often has `subCategories: []`.
 */
export const SUB_CATEGORIES_BY_CATEGORY: Record<
    ProductCategoryEnum,
    readonly string[]
> = {
    [ProductCategoryEnum.Beverages]: [],
    [ProductCategoryEnum.Food]: FOOD_SUB_CATEGORY_LIST as readonly string[],
    [ProductCategoryEnum.Supplements]: [],
};

export const DEFAULT_PRODUCT_TYPES_BY_CATEGORY: Record<
    ProductCategoryEnum,
    readonly string[]
> = {
    [ProductCategoryEnum.Beverages]: BEVERAGE_PRODUCT_TYPE_LIST as readonly string[],
    [ProductCategoryEnum.Food]: [],
    [ProductCategoryEnum.Supplements]: [],
};

/** Labels/flags for compliance region codes (country lists come from API). */
export const COMPLIANCE_REGION_DISPLAY: Record<string, { name: string; flag: string }> = {
    NA: { name: "North America", flag: "🌎" },
    EU: { name: "European Union", flag: "🇪🇺" },
    UK: { name: "United Kingdom", flag: "🇬🇧" },
    EUROPE: { name: "Rest of Europe", flag: "🌍" },
    APAC: { name: "Asia Pacific", flag: "🌏" },
    LATAM: { name: "Latin America", flag: "🌎" },
    MEA: { name: "Middle East & Africa", flag: "🌍" },
    SA: { name: "South Asia", flag: "🌏" },
    CIS: { name: "Central Asia", flag: "🌏" },
};

/** Order for Target Markets selector (compliance UI). */
export const COMPLIANCE_MARKET_REGION_ORDER = [
    "NA",
    "EU",
    "UK",
    "EUROPE",
    "APAC",
    "LATAM",
    "MEA",
    "SA",
    "CIS",
] as const;
