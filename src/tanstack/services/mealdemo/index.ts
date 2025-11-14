import { get, post, put, del } from '@/shared/api/http';
import type {
  MealDemoListParams,
  MealDemoListResponse,
  MealDemo,
  CreateMealDemoPayload,
  CreateMealDemoResponse,
  UpdateMealDemoAllPayload,
  UpdateMealDemoAllResponse,
  UpdateMealDemoDetailPayload,
  UpdateMealDemoDetailResponse,
  MealDemoDetailResponse,
  MealDemoDetailMenu,
} from '@/types/mealdemo';

type RawMealDemoResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
  totalRecords?: number;
  totalCount?: number;
};

const transformMealDemoListResponse = (payload: unknown): { data: MealDemoListResponse } => {
  if (!payload) {
    return { data: { totalRecords: 0, data: [] } };
  }

  let raw: RawMealDemoResponse = {};

  if (typeof payload === 'string') {
    try {
      raw = JSON.parse(payload);
    } catch (error) {
      console.error('Failed to parse meal demo response', error);
      return { data: { totalRecords: 0, data: [] } };
    }
  } else if (typeof payload === 'object') {
    raw = payload as RawMealDemoResponse;
  }

  const list = Array.isArray(raw.data) ? (raw.data as MealDemo[]) : [];

  const totalRecords = (() => {
    if (typeof raw.totalRecords === 'number') return raw.totalRecords;
    if (typeof raw.totalCount === 'number') return raw.totalCount;
    return list.length;
  })();

  return {
    data: {
      totalRecords,
      data: list,
    },
  };
};

export const getMealDemoListService = (params?: MealDemoListParams) =>
  get<MealDemoListResponse>('fitness/api/mealdemo', {
    params,
    transformResponse: [transformMealDemoListResponse],
  });

export const createMealDemoService = (payload: CreateMealDemoPayload) =>
  post<CreateMealDemoResponse>('fitness/api/mealdemo', payload);

export const updateMealDemoAllService = (mealDemoId: string, payload: UpdateMealDemoAllPayload) =>
  put<UpdateMealDemoAllResponse>(`fitness/api/mealdemodetail/meal-demo/${mealDemoId}/update-all`, payload);

type RawMealDemoDetailResponse = {
  success?: boolean;
  message?: string;
  data?: unknown;
};

const transformMealDemoDetailResponse = (payload: unknown): { data: MealDemoDetailResponse } => {
  if (!payload) {
    return { data: [] };
  }

  let raw: RawMealDemoDetailResponse = {};

  if (typeof payload === 'string') {
    try {
      raw = JSON.parse(payload);
    } catch (error) {
      console.error('Failed to parse meal demo detail response', error);
      return { data: [] };
    }
  } else if (typeof payload === 'object') {
    raw = payload as RawMealDemoDetailResponse;
  }

  const detailList = Array.isArray(raw.data) ? (raw.data as MealDemoDetailMenu[]) : [];

  return {
    data: detailList,
  };
};

export const getMealDemoDetailService = (mealDemoId: string) =>
  get<MealDemoDetailResponse>(`fitness/api/mealdemodetail/meal-demo/${mealDemoId}`, {
    transformResponse: [transformMealDemoDetailResponse],
  });

export const updateMealDemoDetailService = (id: string, payload: UpdateMealDemoDetailPayload) =>
  put<UpdateMealDemoDetailResponse>(`fitness/api/mealdemodetail/${id}`, payload);

export const deleteMealDemoService = (id: string) =>
  del<{ success: boolean; message: string }>(`fitness/api/mealdemo/${id}`);

export const hardDeleteMealDemoService = (id: string) =>
  del<{ success: boolean; message: string }>(`fitness/api/mealdemo/${id}/hard`);
