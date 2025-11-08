import { useQuery } from '@tanstack/react-query'
import { getAdvisorsService } from '@/tanstack/services/advisor'
import { AdvisorListResponse, AdvisorParams } from '@/types/advisor'
import { IApiResponse } from '@/shared/api/http'

export const useGetAdvisors = (params?: AdvisorParams) => {
  return useQuery<IApiResponse<AdvisorListResponse>>({
    queryKey: ['advisors', params],
    queryFn: () => getAdvisorsService(params),
    staleTime: 5 * 60 * 1000,
  })
}
