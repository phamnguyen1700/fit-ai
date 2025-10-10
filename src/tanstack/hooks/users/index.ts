import { useMutation } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { registerService } from '@/tanstack/services/users'

export const useRegisterMutation = () => 
  useMutation({
    mutationFn: registerService,
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success(response.message || 'Đăng ký thành công')
      }
      console.log('Register response:', response)
    },
    onError: (err: any) => {
      console.error('Register error:', err)
      toast.error('Đăng ký thất bại. Vui lòng thử lại.')
    },
  }) 