import { get, put } from '@/shared/api/http';
import { AdminProfile, UpdateAdminProfileRequest } from '@/types/admin';

const ACCOUNT_BASE_URL = process.env.NEXT_PUBLIC_ACCOUNT_API_URL || '';

export const getAdminProfileService = () =>
  get<AdminProfile>(`${ACCOUNT_BASE_URL}/api/admin/me`);

export const updateAdminProfileService = (data: UpdateAdminProfileRequest) =>
  put<AdminProfile>(`${ACCOUNT_BASE_URL}/api/admin/me`, data);
