import { api } from "@/services/api";
import { ENDPOINTS } from "@/utils/endpoints";
import { normalizeCompanyTypeOptions } from "@/utils/commonFunctions";

export type CompanyTypeOption = {
  id: string;
  title: string;
};

class CompanyService {
  async getProfileCompanyTypes(): Promise<CompanyTypeOption[]> {
    try {
      const { data } = await api.get(ENDPOINTS.PROFILE.COMPANY_TYPE);
      const rows = data?.data?.data?.data ?? data?.data?.data ?? data?.data ?? [];
      const normalized = normalizeCompanyTypeOptions(rows).map((option) => ({
        id: option.value,
        title: option.label,
      }));

      console.log("[auth] company types fetched", normalized.length);

      return normalized.filter((row) => row.id && row.title);
    } catch (error) {
      console.log("[auth] company types fetch failed", error);
      return [];
    }
  }
}

export const companyService = new CompanyService();
