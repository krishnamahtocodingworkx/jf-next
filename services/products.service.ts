import { ENDPOINTS } from "@/utils/endpoints";
import { api } from "./api";

class ProductsService {
    async getAllProducts(query: string) {
        const response = await api.get(ENDPOINTS.PRODUCTS.GET + query);
        return response.data;
    }
}

export const productsService = new ProductsService();