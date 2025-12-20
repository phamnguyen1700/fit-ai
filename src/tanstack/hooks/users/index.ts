import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { registerService, getUsersService, updateUserStatusService, getUserDetail } from '@/tanstack/services/users'
import { Params, UserState, UserDetail } from '@/types/users'
import { IApiResponse } from '@/shared/api/http'
import { APIError } from '@/types/utils/APIError'

export const useRegisterMutation = () => 
  useMutation({
    mutationFn: registerService,
    onSuccess: (response) => {
      if (response.success && response.data) {
        toast.success(response.message || 'Đăng ký thành công')
      }
      console.log('Register response:', response)
    },
    onError: (err: unknown) => {
      console.error('Register error:', err)
      toast.error('Đăng ký thất bại. Vui lòng thử lại.')
    },
  }) 

export const useGetUsers = (params: Params) => {
  return useQuery<IApiResponse<UserState>>({
    queryKey: ['users', params],
    queryFn: async () => {
      try {
        const response = await getUsersService(params);
        // Đảm bảo response có data và items
        if (response.success && response.data) {
          // Validate structure
          if (!response.data.items) {
            console.warn('Users API response missing items array:', response);
          }
          return response;
        }
        // Log warning nếu response không thành công
        if (process.env.NODE_ENV === 'development') {
          console.warn('Users API response not successful:', response);
        }
        return response;
      } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
      }
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
    retry: 1,
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
    onError: (err: unknown) => {
      console.error('Update user status error:', err)
      const errorMessage = (err as APIError)?.response?.data?.message || (err as Error)?.message || 'Cập nhật trạng thái người dùng thất bại. Vui lòng thử lại.'
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