import type { User as AuthUser } from '@/types/users'

export interface IAuthState {
	token: string | null
	user: AuthUser | null
	login: (token: string, id: string) => void
	logout: () => void
	setUser: (user: AuthUser | null) => void
}

export interface ILoginRequest {
	email: string
	password: string
}

export interface ILoginResponse {
	id: string
	email: string
	token: string
}


