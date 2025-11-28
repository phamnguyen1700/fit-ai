import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdvisorsService, getAdvisorDetailService, softDeleteAdvisorService, reactivateAdvisorService, updateAdvisorProfileService } from '@/tanstack/services/advisor'
import { AdvisorListResponse, AdvisorParams, AdvisorDetail, UpdateAdvisorProfileRequest } from '@/types/advisor'
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
    queryFn: () => {
      if (!advisorId) {
        return Promise.reject(new Error('Advisor ID is required'))
      }
      return getAdvisorDetailService(advisorId)
    },
    enabled: !!advisorId,
    staleTime: 5 * 60 * 1000,
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
