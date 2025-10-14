import { post } from '@/shared/api/http'
import { IRegister } from '@/types/users'

export const registerService = (data: IRegister) => post('/auth/register', data)