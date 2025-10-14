import { post } from '@/shared/api/http'
import { ILoginRequest, ILoginResponse } from '@/types/auth'

// Service login
export const loginService = (data: ILoginRequest) => post<ILoginResponse>('/auth/admin/login', data)