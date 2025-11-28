// httpClient.ts
import { APIError } from '@/types/utils/APIError';
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IApiResponse<T> {
  data?: T;
  success: boolean;
  message: string;
}

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL;

    this.instance = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Request interceptor
    this.instance.interceptors.request.use((config) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('authToken');
        if (token) {
          config.headers = config.headers || {};
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    });

    // Response interceptor: chỉ lo phần 401, không ép kiểu
    this.instance.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const status = error.response?.status;
        if (status === 401 && typeof window !== 'undefined') {
          localStorage.removeItem('authToken');
          window.location.href = '/admin/login';
        }
        return Promise.reject(error);
      }
    );
  }

  private handleResponse<T>(res: AxiosResponse<{ data: T, message: string }>): IApiResponse<T> {
    // Handle nested response structure: data.data
    const responseData = res.data?.data || res.data;
    const message = res.data?.message || 'OK';
    
    return {
      data: responseData as T,
      success: true,
      message: message,
    };
  }

  private handleError<T>(error: unknown): IApiResponse<T> {
    return {
      data: undefined,
      success: false,
      message:
        (error as APIError)?.response?.data?.message ||
        (error as Error)?.message ||
        'Something went wrong',
    };
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<IApiResponse<T>> {
    try {
      const res = await this.instance.get<T>(url, config);
      return this.handleResponse(res as AxiosResponse<{ data: T, message: string }>);
    } catch (err) {
      return this.handleError<T>(err);
    }
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IApiResponse<T>> {
    try {
      const res = await this.instance.post<T>(url, data, config);
      return this.handleResponse(res as AxiosResponse<{ data: T, message: string }>);
    } catch (err) {
      return this.handleError<T>(err);
    }
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<IApiResponse<T>> {
    try {
      const res = await this.instance.put<T>(url, data, config);
      return this.handleResponse(res as AxiosResponse<{ data: T, message: string }>);
    } catch (err) {
      return this.handleError<T>(err);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<IApiResponse<T>> {
    try {
      const res = await this.instance.delete<T>(url, config);
      return this.handleResponse(res as AxiosResponse<{ data: T, message: string }>);
    } catch (err) {
      return this.handleError<T>(err);
    }
  }
}

const httpClient = new HttpClient();

export const get = httpClient.get.bind(httpClient);
export const post = httpClient.post.bind(httpClient);
export const put = httpClient.put.bind(httpClient);
export const del = httpClient.delete.bind(httpClient);

export default httpClient;