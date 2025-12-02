import axios, { InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// Base API configuration
const API_BASE_URL = 'https://bukid-ni-manang-api.onrender.com'; // Your Laravel backend URL
// const API_BASE_URL = 'https://bukid-ni-manang-api.onrender.com'; // Your Laravel backend URL

// Create axios instance
export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // For handling cookies/sessions
});

// Request interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: AxiosError) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('auth_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Service functions
export const authApi = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/api/auth/login', credentials),
  
  register: (userData: { firstName: string; lastName: string; email: string; password: string }) =>
    api.post('/api/auth/register', userData),
  
  logout: () => api.post('/api/auth/logout'),
  
  me: () => api.get('/api/auth/me'),
  
  session: () => api.get('/api/auth/session'),
};

export const accommodationsApi = {
  getAll: () => api.get('/api/accommodations'),
  
  getById: (id: string) => api.get(`/api/accommodations/${id}`),
  
  create: (data: any) => api.post('/api/accommodations', data),
  
  update: (id: string, data: any) => api.put(`/api/accommodations/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/accommodations/${id}`),
};

export const bookingsApi = {
  getAll: () => api.get('/api/bookings'),
  
  getById: (id: string) => api.get(`/api/bookings/${id}`),
  
  create: (data: any) => api.post('/api/bookings', data),
  
  update: (id: string, data: any) => api.put(`/api/bookings/${id}`, data),
  
  delete: (id: string) => api.delete(`/api/bookings/${id}`),
};

export default api;