import axios, { AxiosInstance } from 'axios';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = (data: { name: string; email: string; password: string; role: string }) =>
  api.post('/api/auth/register', data);
export const login = (data: { email: string; password: string }) => api.post('/api/auth/login', data);
export const getMe = () => api.get('/api/auth/me');
export const createOrder = (data: { product: string; quantity: number; location: string }) =>
  api.post('/api/orders', data);
export const getCustomerOrders = (id: string) => api.get(`/api/orders/customer/${id}`);
export const getPendingOrders = () => api.get('/api/orders/pending');
export const updateOrderStatus = (id: string, status: string) =>
  api.put(`/api/orders/${id}/status`, { status });
export const getOrderHistory = (userId: string) => api.get(`/api/orders/history/${userId}`);