import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdvisorsService, getAdvisorDetailService, softDeleteAdvisorService, reactivateAdvisorService, updateAdvisorProfileService, uploadAdvisorProfilePictureService, changeAdvisorPasswordService, createAdvisorService, hardDeleteAdvisorService, ChangeAdvisorPasswordRequest } from '@/tanstack/services/advisor'
import { AdvisorListResponse, AdvisorParams, AdvisorDetail, UpdateAdvisorProfileRequest, CreateAdvisorRequest } from '@/types/advisor'
import { IApiResponse } from '@/shared/api/http'
import toast from 'react-hot-toast'
import { APIError } from '@/types/utils/APIError'

export const useGetAdvisors = (params?: AdvisorParams) => {
  return useQuery<IApiResponse<AdvisorListResponse>>({
    queryKey: ['advisors', params],
    queryFn: () => getAdvisorsService(params),
    staleTime: 5 * 60 * 1000,
  })
}

export const useAdvisorDetail = (advisorId?: string) => {
  return useQuery<IApiResponse<AdvisorDetail>>({
    queryKey: ['advisor-detail', advisorId],
    queryFn: async () => {
      if (!advisorId) {
        return Promise.reject(new Error('Advisor ID is required'))
      }
      const response = await getAdvisorDetailService(advisorId)
      return response
    },
    enabled: !!advisorId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
  })
}

export const useSoftDeleteAdvisor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (advisorId: string) => {
      console.log('Soft deleting advisor:', advisorId)
      return softDeleteAdvisorService(advisorId)
    },
    onSuccess: (response, advisorId) => {
      console.log('Soft delete advisor success - full response:', response)
      console.log('Response success:', response.success)
      console.log('Response data:', response.data)
      console.log('Response message:', response.message)
      
      // Chỉ xử lý khi response.success === true
      if (response.success === true) {
        toast.success('Tạm dừng advisor thành công!')
        // Invalidate và refetch advisor detail và list
        queryClient.invalidateQueries({ queryKey: ['advisor-detail', advisorId] })
        queryClient.invalidateQueries({ queryKey: ['advisors'] })
      } else {
        // Nếu success = false, throw error để vào onError
        console.warn('API returned success: false', response)
        throw new Error(response.message || 'Tạm dừng advisor thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Soft delete advisor error:', error)
      console.error('Error response:', (error as APIError)?.response)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Tạm dừng advisor thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}

export const useReactivateAdvisor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (advisorId: string) => {
      console.log('Reactivating advisor:', advisorId)
      return reactivateAdvisorService(advisorId)
    },
    onSuccess: (response, advisorId) => {
      console.log('Reactivate advisor success - full response:', response)
      console.log('Response success:', response.success)
      console.log('Response data:', response.data)
      console.log('Response message:', response.message)
      
      // Chỉ xử lý khi response.success === true
      if (response.success === true) {
        toast.success('Khởi động lại advisor thành công!')
        // Invalidate và refetch advisor detail và list
        queryClient.invalidateQueries({ queryKey: ['advisor-detail', advisorId] })
        queryClient.invalidateQueries({ queryKey: ['advisors'] })
      } else {
        // Nếu success = false, throw error để vào onError
        console.warn('API returned success: false', response)
        throw new Error(response.message || 'Khởi động lại advisor thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Reactivate advisor error:', error)
      console.error('Error response:', (error as APIError)?.response)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Khởi động lại advisor thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}

export const useUpdateAdvisorProfile = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ advisorId, data }: { advisorId: string; data: UpdateAdvisorProfileRequest }) => {
      console.log('Updating advisor profile:', advisorId, data)
      return updateAdvisorProfileService(advisorId, data)
    },
    onSuccess: (response, variables) => {
      console.log('Update advisor profile success - full response:', response)
      console.log('Response success:', response.success)
      console.log('Response data:', response.data)
      console.log('Response message:', response.message)
      
      // Chỉ xử lý khi response.success === true
      if (response.success === true) {
        toast.success('Cập nhật thông tin advisor thành công!')
        // Invalidate và refetch advisor detail và list
        queryClient.invalidateQueries({ queryKey: ['advisor-detail', variables.advisorId] })
        queryClient.invalidateQueries({ queryKey: ['advisors'] })
      } else {
        // Nếu success = false, throw error để vào onError
        console.warn('API returned success: false', response)
        throw new Error(response.message || 'Cập nhật thông tin advisor thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Update advisor profile error:', error)
      console.error('Error response:', (error as APIError)?.response)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Cập nhật thông tin advisor thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}

export const useUploadAdvisorProfilePicture = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ advisorId, file }: { advisorId: string; file: File }) => {
      console.log('Uploading advisor profile picture:', advisorId, file.name)
      return uploadAdvisorProfilePictureService(advisorId, file)
    },
    onSuccess: async (response, variables) => {
      console.log('Upload advisor profile picture success - full response:', response)
      
      if (response.success === true) {
        toast.success('Cập nhật ảnh đại diện thành công!')
        
        // Update cache trực tiếp nếu có data từ response
        if (response.data) {
          const currentData = queryClient.getQueryData<IApiResponse<AdvisorDetail>>([
            'advisor-detail',
            variables.advisorId,
          ])
          
          if (currentData) {
            // Merge với data hiện tại, ưu tiên data mới từ response
            queryClient.setQueryData<IApiResponse<AdvisorDetail>>(
              ['advisor-detail', variables.advisorId],
              {
                ...currentData,
                data: {
                  ...currentData.data,
                  ...response.data,
                  profilePicture: response.data.profilePicture, // Đảm bảo profilePicture được update
                },
              }
            )
          } else {
            // Nếu chưa có cache, set trực tiếp
            queryClient.setQueryData(['advisor-detail', variables.advisorId], response)
          }
        }
        
        // Invalidate và refetch advisor detail để đảm bảo data được cập nhật từ server
        await queryClient.invalidateQueries({ queryKey: ['advisor-detail', variables.advisorId] })
        await queryClient.refetchQueries({ queryKey: ['advisor-detail', variables.advisorId] })
      } else {
        console.warn('API returned success: false', response)
        throw new Error(response.message || 'Cập nhật ảnh đại diện thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Upload advisor profile picture error:', error)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Cập nhật ảnh đại diện thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}

export const useChangeAdvisorPassword = () => {
  return useMutation({
    mutationFn: ({ advisorId, data }: { advisorId: string; data: ChangeAdvisorPasswordRequest }) => {
      console.log('Changing advisor password:', advisorId)
      return changeAdvisorPasswordService(advisorId, data)
    },
    onSuccess: (response) => {
      console.log('Change advisor password success - full response:', response)
      
      if (response.success === true) {
        toast.success('Đổi mật khẩu thành công!')
      } else {
        console.warn('API returned success: false', response)
        throw new Error(response.message || 'Đổi mật khẩu thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Change advisor password error:', error)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Đổi mật khẩu thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}

export const useCreateAdvisor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data: CreateAdvisorRequest) => {
      console.log('Creating advisor:', data)
      return createAdvisorService(data)
    },
    onSuccess: (response) => {
      console.log('Create advisor success - full response:', response)
      
      if (response.success === true) {
        toast.success('Tạo advisor thành công!')
        // Invalidate và refetch advisors list
        queryClient.invalidateQueries({ queryKey: ['advisors'] })
      } else {
        console.warn('API returned success: false', response)
        throw new Error(response.message || 'Tạo advisor thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Create advisor error:', error)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Tạo advisor thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}

export const useHardDeleteAdvisor = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (advisorId: string) => {
      console.log('Hard deleting advisor:', advisorId)
      return hardDeleteAdvisorService(advisorId)
    },
    onSuccess: (response, advisorId) => {
      console.log('Hard delete advisor success - full response:', response)
      console.log('Response success:', response.success)
      console.log('Response data:', response.data)
      console.log('Response message:', response.message)
      
      // Chỉ xử lý khi response.success === true
      if (response.success === true) {
        toast.success('Xóa vĩnh viễn advisor thành công!')
        // Invalidate và refetch advisor detail và list
        queryClient.invalidateQueries({ queryKey: ['advisor-detail', advisorId] })
        queryClient.invalidateQueries({ queryKey: ['advisors'] })
      } else {
        // Nếu success = false, throw error để vào onError
        console.warn('API returned success: false', response)
        throw new Error(response.message || 'Xóa vĩnh viễn advisor thất bại')
      }
    },
    onError: (error: unknown) => {
      console.error('Hard delete advisor error:', error)
      console.error('Error response:', (error as APIError)?.response)
      const errorMessage = (error as APIError)?.response?.data?.message || (error as Error)?.message || 'Xóa vĩnh viễn advisor thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}
