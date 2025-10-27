import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { registerService, getUsersService, updateUserStatusService, getUserDetail } from '@/tanstack/services/users'
import { Params, UserState, UserDetail } from '@/types/users'
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
  return useQuery<IApiResponse<UserState>>({
    queryKey: ['users', params],
    queryFn: () => getUsersService(params),
  })
}

export const useUpdateUserStatusMutation = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id: string) => {
      console.log('Attempting to update user status with ID:', id);
      return updateUserStatusService(id);
    },
    onSuccess: (response) => {
      console.log('Update status response:', response);
      if (response.success) {
        toast.success(response.message || 'Cập nhật trạng thái người dùng thành công')
        // Refresh the users list
        queryClient.invalidateQueries({ queryKey: ['users'] })
      } else {
        toast.error(response.message || 'Cập nhật trạng thái người dùng thất bại')
      }
    },
    onError: (err: any) => {
      console.error('Update user status error:', err)
      const errorMessage = err?.response?.data?.message || err?.message || 'Cập nhật trạng thái người dùng thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}

export const useUserDetail = (id: string) => {
  return useQuery<IApiResponse<UserDetail>>({
    queryKey: ['userDetail', id],
    queryFn: () => getUserDetail(id),
    enabled: !!id, 
  })
}