import { post, get, put } from '@/shared/api/http'
import { IRegister, Params, UserState, UserDetail } from '@/types/users'

export const registerService = (data: IRegister) => post('/auth/register', data)

export const getUsersService = (params: Params) => get<UserState>(`/user`, { params })

export const updateUserStatusService = (id: string) => put(`/user/${id}/update-status`)

export const getUserDetail = (id: string) => get<UserDetail>(`/user/${id}/detail`)