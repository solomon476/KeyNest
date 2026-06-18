import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? 'http://localhost:3000/api' : '/_/backend/api');

const api = axios.create({
  baseURL: API_URL,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiry
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const loginUser = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

export const registerUser = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

// Properties
export const getProperties = async () => {
  const response = await api.get('/properties');
  return response.data;
};

export const getUnits = async () => {
  const response = await api.get('/units');
  return response.data;
};

// Tenants
export const getTenants = async () => {
  const response = await api.get('/tenants');
  return response.data;
};

// Caretakers
export const getCaretakers = async () => {
  const response = await api.get('/caretakers');
  return response.data;
};

export const assignCaretaker = async (data) => {
  const response = await api.post('/caretakers', data);
  return response.data;
};

// Messages
export const getConversation = async (userId) => {
  const response = await api.get(`/messages/${userId}`);
  return response.data;
};

export const sendMessage = async (data) => {
  const response = await api.post('/messages', data);
  return response.data;
};

// Notifications
export const getNotifications = async () => {
  const response = await api.get('/notifications');
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

// Leases
export const approveLease = async (id) => {
  const response = await api.patch(`/leases/${id}/approve`);
  return response.data;
};

export const rejectLease = async (id) => {
  const response = await api.patch(`/leases/${id}/reject`);
  return response.data;
};

// Dashboard Stats
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};

export const getTenantStats = async () => {
  const response = await api.get('/dashboard/tenant-stats');
  return response.data;
};

// Payments
export const getPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const recordPayment = async (data) => {
  const response = await api.post('/payments', data);
  return response.data;
};

// Maintenance
export const getMaintenanceTasks = async () => {
  const response = await api.get('/maintenance');
  return response.data;
};

export const createMaintenanceTask = async (data) => {
  const response = await api.post('/maintenance', data);
  return response.data;
};

export default api;
