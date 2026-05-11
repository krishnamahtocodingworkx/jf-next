import { ENDPOINTS } from "@/utils/endpoints";
import { api } from "./api";

class IngredientsService {
    async getAllIngredients(query: string) {
        const response = await api.get(ENDPOINTS.INGREDIENTS.GET + query);
        console.log("response :", response);
        return response.data;
    }
}
export const ingredientsService = new IngredientsService();