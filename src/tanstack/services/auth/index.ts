import { post } from '@/shared/api/http'
import { ILoginRequest, ILoginResponse, IAdvisorLoginResponse } from '@/types/auth'

// Service login
export const loginService = (data: ILoginRequest) => post<ILoginResponse>('account/api/auth/admin/login', data)

// Service login advisor
export const advisorLoginService = (data: ILoginRequest) => post<IAdvisorLoginResponse>('account/api/auth/advisor/login', data)