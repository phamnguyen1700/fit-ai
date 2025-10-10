import { useMutation } from '@tanstack/react-query'
import { loginService } from '@/tanstack/services/auth'
import toast from 'react-hot-toast'
import { useAuthStore } from '@/stores/stores'

export const useLoginMutation = () => 
  useMutation({
    mutationFn: loginService,
    onSuccess: (response) => {
      if (response.success && response.data) {
        // Lưu token và user data vào zustand store
        const { token, id } = response.data;
        useAuthStore.getState().login(token, id );
        toast.success(response.message || 'Đăng nhập thành công')
      }
    },
    onError: (err: any) => {
      console.error('Login error:', err)
    },
  })
