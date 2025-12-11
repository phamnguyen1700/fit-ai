import { get, put, post } from '@/shared/api/http'
import {
  AdvisorListResponse,
  AdvisorParams,
  AdvisorDetail,
  UpdateAdvisorProfileRequest,
  CreateAdvisorRequest,
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

export const createAdvisorService = (data: CreateAdvisorRequest) => {
  console.log('Calling create advisor endpoint:', data)
  
  // If certificateFile exists, use FormData for multipart/form-data
  if (data.certificateFile) {
    const formData = new FormData()
    formData.append('Email', data.email)
    formData.append('FirstName', data.firstName)
    formData.append('LastName', data.lastName)
    formData.append('Phone', data.phone)
    formData.append('CertificateFile', data.certificateFile)
    
    return post<AdvisorDetail>(
      `${ACCOUNT_BASE_URL}/api/admin/advisor`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )
  }
  
  // Otherwise, send as JSON
  return post<AdvisorDetail>(`${ACCOUNT_BASE_URL}/api/admin/advisor`, data)
}
