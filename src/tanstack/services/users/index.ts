import { post, get, put } from '@/shared/api/http'
import { IRegister, Params, UserState, UserDetail } from '@/types/users'

const ACCOUNT_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || ''

export const registerService = (data: IRegister) =>
  post(`${ACCOUNT_BASE_URL}/api/auth/register`, data)

export const getUsersService = (params: Params) =>
  get<UserState>(`${ACCOUNT_BASE_URL}/api/user`, { params })

export const updateUserStatusService = (id: string) =>
  put(`${ACCOUNT_BASE_URL}/api/user/${id}/update-status`)

export const getUserDetail = (id: string) =>
  get<UserDetail>(`${ACCOUNT_BASE_URL}/api/user/${id}/detail`)