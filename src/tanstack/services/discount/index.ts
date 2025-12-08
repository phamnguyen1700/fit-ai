import { get } from "@/shared/api/http";
import { DiscountTemplate, DiscountTemplateParams } from "@/types/discount";

const ACCOUNT_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || '';

export const getDiscountTemplatesService = (params?: DiscountTemplateParams) => 
  get<DiscountTemplate[]>(`${ACCOUNT_BASE_URL}/api/discount/templates`, { params });

