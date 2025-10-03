import { useMutation } from '@tanstack/react-query'
import { login } from '@/tanstack/services/auth'
import toast from 'react-hot-toast'

export const useLoginMutation = () => 
  useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      toast.success('Đăng nhập thành công ✅')
      console.log(data)
    },
    onError: (err: any) => {
      toast.error(err?.message || 'Đăng nhập thất bại ❌')
      console.error('onError err:', err) // log để debug
    },
  })
