import { post, get, put } from '@/shared/api/http'
import { IRegister, Params, UserState, UserDetail } from '@/types/users'

export const registerService = (data: IRegister) => post(`account/api/auth/register`, data)

export const getUsersService = (params: Params) => get<UserState>(`account/api/user`, { params })

export const updateUserStatusService = (id: string) => put(`account/api/user/${id}/update-status`)

export const getUserDetail = (id: string) => get<UserDetail>(`account/api/user/${id}/detail`)