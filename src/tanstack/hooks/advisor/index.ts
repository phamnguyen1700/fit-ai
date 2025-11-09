import { useQuery } from '@tanstack/react-query'
import { getAdvisorsService, getAdvisorDetailService } from '@/tanstack/services/advisor'
import { AdvisorListResponse, AdvisorParams, AdvisorDetail } from '@/types/advisor'
import { IApiResponse } from '@/shared/api/http'

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
