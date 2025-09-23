// stores/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

// Types
import type { IAuthState } from '@/types/auth'

export const useAuthStore = create<IAuthState>()(
	persist(
		(set) => ({
			token: null,
			user: null,
			login: (token, user) => set({ token, user }),
			logout: () => set({ token: null, user: null }),
			setUser: (user) => set({ user }),
		}),
		{
			name: 'auth-store',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				token: state.token,
				user: state.user,
			}),
		}
	)
)