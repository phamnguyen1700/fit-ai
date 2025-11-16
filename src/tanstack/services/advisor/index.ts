import { get, put } from '@/shared/api/http'
import { AdvisorListResponse, AdvisorParams, AdvisorDetail, UpdateAdvisorProfileRequest } from '@/types/advisor'

export const getAdvisorsService = (params?: AdvisorParams) =>
  get<AdvisorListResponse>(`account/api/advisor`, { params })

export const getAdvisorDetailService = (advisorId: string) =>
  get<AdvisorDetail>(`account/api/advisor/${advisorId}`)

export const softDeleteAdvisorService = (advisorId: string) => {
  console.log('Calling soft delete endpoint for advisor:', advisorId)
  // Thử endpoint với account/ prefix (giống các endpoint khác)
  return put<string>(`account/api/advisor/${advisorId}/soft-delete`)
}

export const reactivateAdvisorService = (advisorId: string) => {
  console.log('Calling reactivate endpoint for advisor:', advisorId)
  // Thử endpoint với account/ prefix (giống các endpoint khác)
  return put<string>(`account/api/advisor/${advisorId}/reactivate`)
}

export const updateAdvisorProfileService = (advisorId: string, data: UpdateAdvisorProfileRequest) => {
  console.log('Calling update advisor profile endpoint for advisor:', advisorId, data)
  // Theo Swagger, endpoint là /api/advisor/{advisorId}/profile (không có account/ prefix)
  return put<AdvisorDetail>(`account/api/advisor/${advisorId}/profile`, data)
}
