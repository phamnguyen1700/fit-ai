import { get } from '@/shared/api/http'
import { AdvisorListResponse, AdvisorParams } from '@/types/advisor'

export const getAdvisorsService = (params?: AdvisorParams) => 
  get<AdvisorListResponse>(`account/api/advisor`, { params })
