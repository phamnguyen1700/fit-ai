import { post } from '@/shared/api/http'
import { ILoginRequest, ILoginResponse } from '@/types/auth'

// Service login
export const loginService = (data: ILoginRequest) => post<ILoginResponse>('account/api/auth/admin/login', data)