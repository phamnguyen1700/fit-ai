import { post } from '@/shared/api/http'
import { ILoginRequest, ILoginResponse, IAdvisorLoginResponse } from '@/types/auth'

const ACCOUNT_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || ''

// Service login (admin)
export const loginService = (data: ILoginRequest) =>
  post<ILoginResponse>(`${ACCOUNT_BASE_URL}/api/auth/admin/login`, data)

// Service login advisor
export const advisorLoginService = (data: ILoginRequest) =>
  post<IAdvisorLoginResponse>(`${ACCOUNT_BASE_URL}/api/auth/advisor/login`, data)