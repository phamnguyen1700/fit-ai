// Note: Install @tanstack/react-query for production use
// npm install @tanstack/react-query
import { keepPreviousData, useQuery, useMutation } from '@tanstack/react-query';
import { userService } from '../service';
import { User, CreateUserRequest, UpdateUserRequest, ChangePasswordRequest } from '../types';
import { userQueryKeys } from '../queries/queryKeys';
import { queryClient } from '@/lib/queryClient';
// import { toast } from 'react-toastify'; // Uncomment when installing react-toastify

// Query Hooks
export const useUsers = (params: Record<string, any> = {}) => {
  return useQuery({
    queryKey: userQueryKeys.list(params),
    queryFn: () => userService.getUsers(params),
    placeholderData: keepPreviousData,
  });
};

export const useUser = (id: string) => {
  return useQuery({
    queryKey: userQueryKeys.detail(id),
    queryFn: () => userService.getUserById(id),
    enabled: !!id,
  });
};

// Mutation Hooks
export const useCreateUserMutation = () => {
  return useMutation({
    mutationFn: (payload: CreateUserRequest) => userService.createUser(payload),
    onSuccess: () => {
      // toast.success('Tạo người dùng thành công');
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Tạo người dùng thất bại');
    },
  });
};

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRequest }) => 
      userService.updateUser({ ...payload, id }),
    onSuccess: (_: any, variables: { id: string; payload: UpdateUserRequest }) => {
      // toast.success('Cập nhật người dùng thành công');
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(variables.id) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Cập nhật người dùng thất bại');
    },
  });
};

export const useDeleteUserMutation = () => {
  return useMutation({
    mutationFn: (id: string) => userService.deleteUser(id),
    onSuccess: () => {
      // toast.success('Xóa người dùng thành công');
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Xóa người dùng thất bại');
    },
  });
};

export const useToggleUserStatusMutation = () => {
  return useMutation({
    mutationFn: (id: string) => userService.toggleUserStatus(id),
    onSuccess: (_: any, variables: string) => {
      // toast.success('Cập nhật trạng thái người dùng thành công');
      queryClient.invalidateQueries({ queryKey: userQueryKeys.detail(variables) });
      queryClient.invalidateQueries({ queryKey: userQueryKeys.lists() });
    },
    onError: () => {
      // toast.error('Cập nhật trạng thái người dùng thất bại');
    },
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: (payload: ChangePasswordRequest) => userService.changePassword(payload),
    onSuccess: () => {
      // toast.success('Đổi mật khẩu thành công');
    },
    onError: () => {
      // toast.error('Đổi mật khẩu thất bại');
    },
  });
};

export const useResetPasswordMutation = () => {
  return useMutation({
    mutationFn: (id: string) => userService.resetPassword(id),
    onSuccess: () => {
      // toast.success('Reset mật khẩu thành công');
    },
    onError: () => {
      // toast.error('Reset mật khẩu thất bại');
    },
  });
};
