export type Ingredient = {
  id: string;
  name: string;
  subCategory: string;
  supplier: string;
  category: string;
  status: string;
  form: string;
  pricePerKg: string;
  nutritionScore: number;
  sustainabilityScore: number;
  costScore: number;
  productsCount: number;
  alert: boolean;
};

export type IngredientAlert = {
  id: string;
  type: "supply" | "price" | "score";
  severity: "critical" | "warning" | "info";
  category: string;
  ingredient: string;
  description: string;
  fromValue?: string;
  toValue?: string;
  isIncrease?: boolean;
  timestamp: string;
};
