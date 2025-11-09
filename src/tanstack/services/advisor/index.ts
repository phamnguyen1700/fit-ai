import { get } from '@/shared/api/http'
import { AdvisorListResponse, AdvisorParams, AdvisorDetail } from '@/types/advisor'

export const getAdvisorsService = (params?: AdvisorParams) =>
  get<AdvisorListResponse>(`account/api/advisor`, { params })

export const getAdvisorDetailService = (advisorId: string) =>
  get<AdvisorDetail>(`account/api/advisor/${advisorId}`)
