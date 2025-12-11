import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { IApiResponse } from '@/shared/api/http';
import { APIError } from '@/types/utils/APIError';
import { AdminProfile, UpdateAdminProfileRequest } from '@/types/admin';
import { getAdminProfileService, updateAdminProfileService } from '@/tanstack/services/admin';

export const useAdminProfile = () => {
  const query = useQuery<IApiResponse<AdminProfile>>({
    queryKey: ['admin-profile'],
    queryFn: () => getAdminProfileService(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (query.data) {
      console.log('✅ [Hook] Admin profile success:', query.data);
      console.log('✅ [Hook] Admin profile data:', query.data?.data);
    }
    if (query.error) {
      console.error('❌ [Hook] Admin profile error:', query.error);
    }
  }, [query.data, query.error]);

  return query;
};

export const useUpdateAdminProfile = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateAdminProfileRequest) => {
      console.log('Updating admin profile:', data);
      return updateAdminProfileService(data);
    },
    onSuccess: (response) => {
      console.log('Update admin profile success:', response);
      if (response.success) {
        toast.success(response.message || 'Cập nhật thông tin admin thành công!');
        // Invalidate và refetch admin profile
        queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      } else {
        toast.error(response.message || 'Cập nhật thông tin admin thất bại');
      }
    },
    onError: (error: unknown) => {
      console.error('Update admin profile error:', error);
      const errorMessage =
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Cập nhật thông tin admin thất bại. Vui lòng thử lại.';
      toast.error(errorMessage);
    },
  });
};
