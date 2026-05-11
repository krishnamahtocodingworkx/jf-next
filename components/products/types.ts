export type Product = {
    id: string;
    name: string;
    productClass: string;
    primaryClass: string;
    status: "active" | "inactive";
    cost: number;
    markup: number;
    costMargin: number;
    nutritionScore: number;
};