import { get, put, post } from '@/shared/api/http'
import {
  AdvisorListResponse,
  AdvisorParams,
  AdvisorDetail,
  UpdateAdvisorProfileRequest,
} from '@/types/advisor'

const ACCOUNT_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || ''

export const getAdvisorsService = (params?: AdvisorParams) =>
  get<AdvisorListResponse>(`${ACCOUNT_BASE_URL}/api/advisor`, { params })

export const getAdvisorDetailService = (advisorId: string) =>
  get<AdvisorDetail>(`${ACCOUNT_BASE_URL}/api/advisor/${advisorId}/detail`)

export const softDeleteAdvisorService = (advisorId: string) => {
  console.log('Calling soft delete endpoint for advisor:', advisorId)
  return put<string>(`${ACCOUNT_BASE_URL}/api/advisor/${advisorId}/soft-delete`)
}

export const reactivateAdvisorService = (advisorId: string) => {
  console.log('Calling reactivate endpoint for advisor:', advisorId)
  return put<string>(`${ACCOUNT_BASE_URL}/api/advisor/${advisorId}/reactivate`)
}

export const updateAdvisorProfileService = (
  advisorId: string,
  data: UpdateAdvisorProfileRequest,
) => {
  console.log('Calling update advisor profile endpoint for advisor:', advisorId, data)
  // Theo Swagger, endpoint là /api/advisor/{advisorId}/profile`
  return put<AdvisorDetail>(`${ACCOUNT_BASE_URL}/api/advisor/${advisorId}/profile`, data)
}

export const uploadAdvisorProfilePictureService = (advisorId: string, file: File) => {
  const formData = new FormData()
  formData.append('File', file)
  
  return post<AdvisorDetail>(
    `${ACCOUNT_BASE_URL}/api/advisor/${advisorId}/profile-picture`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  )
}

export interface ChangeAdvisorPasswordRequest {
  oldPassword: string
  newPassword: string
}

export const changeAdvisorPasswordService = (
  advisorId: string,
  data: ChangeAdvisorPasswordRequest
) => {
  console.log('Calling change advisor password endpoint for advisor:', advisorId)
  return put<string>(`${ACCOUNT_BASE_URL}/api/advisor/${advisorId}/password`, data)
}
