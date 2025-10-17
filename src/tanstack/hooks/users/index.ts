import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { registerService, getUsersService, deleteUserService } from '@/tanstack/services/users'
import { Params, UserState } from '@/types/users'
import { IApiResponse } from '@/shared/api/http'

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

export const useGetUsers = (params: Params) => {
  return useQuery<any>({
    queryKey: ['users', params],
    queryFn: () => getUsersService(params),
  })
}

export const useDeleteUserMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: deleteUserService,
    onSuccess: (response) => {
      if (response.success) {
        toast.success(response.message || 'Xóa người dùng thành công')
        // Refresh the users list
        queryClient.invalidateQueries({ queryKey: ['users'] })
      } else {
        toast.error(response.message || 'Xóa người dùng thất bại')
      }
    },
    onError: (err: any) => {
      console.error('Delete user error:', err)
      const errorMessage = err?.response?.data?.message || err?.message || 'Xóa người dùng thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}