import { post } from '@/shared/api/http'
import { ILoginRequest, ILoginResponse } from '@/types/auth'

// Service login
export const login = (data: ILoginRequest) => post<ILoginResponse>('/auth/login', data)