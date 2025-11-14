import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAdvisorsService, getAdvisorDetailService, softDeleteAdvisorService, reactivateAdvisorService } from '@/tanstack/services/advisor'
import { AdvisorListResponse, AdvisorParams, AdvisorDetail } from '@/types/advisor'
import { IApiResponse } from '@/shared/api/http'
import toast from 'react-hot-toast'

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
    onError: (error: any) => {
      console.error('Soft delete advisor error:', error)
      console.error('Error response:', error?.response)
      const errorMessage = error?.response?.data?.message || error?.message || 'Tạm dừng advisor thất bại. Vui lòng thử lại.'
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
    onError: (error: any) => {
      console.error('Reactivate advisor error:', error)
      console.error('Error response:', error?.response)
      const errorMessage = error?.response?.data?.message || error?.message || 'Khởi động lại advisor thất bại. Vui lòng thử lại.'
      toast.error(errorMessage)
    },
  })
}
