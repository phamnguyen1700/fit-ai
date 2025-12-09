import { get, put } from "@/shared/api/http";
import { DiscountTemplate, DiscountTemplateParams, UpdateDiscountTemplateRequest } from "@/types/discount";

const ACCOUNT_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || '';

export const getDiscountTemplatesService = (params?: DiscountTemplateParams) => 
  get<DiscountTemplate[]>(`${ACCOUNT_BASE_URL}/api/discount/templates`, { params });

export const updateDiscountTemplateService = (discountId: string, data: UpdateDiscountTemplateRequest) =>
  put<DiscountTemplate>(`${ACCOUNT_BASE_URL}/api/discount/templates/${discountId}`, data);

