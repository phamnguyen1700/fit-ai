// httpClient.ts
import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

export interface IApiResponse<T> {
  data?: T;
  success: boolean;
  message: string;
}

class HttpClient {
  private instance: AxiosInstance;

  constructor() {
    const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

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

  private handleResponse<T>(res: AxiosResponse<T>): IApiResponse<T> {
    return {
      data: res.data,
      success: true,
      message: 'OK',
    };
  }

  private handleError<T>(error: any): IApiResponse<T> {
    return {
      data: undefined,
      success: false,
      message:
        error?.response?.data?.message ||
        error?.message ||
        'Something went wrong',
    };
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<IApiResponse<T>> {
    try {
      const res = await this.instance.get<T>(url, config);
      return this.handleResponse(res);
    } catch (err) {
      return this.handleError<T>(err);
    }
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IApiResponse<T>> {
    try {
      const res = await this.instance.post<T>(url, data, config);
      return this.handleResponse(res);
    } catch (err) {
      return this.handleError<T>(err);
    }
  }

  async put<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<IApiResponse<T>> {
    try {
      const res = await this.instance.put<T>(url, data, config);
      return this.handleResponse(res);
    } catch (err) {
      return this.handleError<T>(err);
    }
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<IApiResponse<T>> {
    try {
      const res = await this.instance.delete<T>(url, config);
      return this.handleResponse(res);
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
