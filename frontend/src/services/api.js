import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hr-payroll-system-mgc5.onrender.com/api';
// Replace 'hr-payroll-backend.onrender.com' with your actual Render.com backend URL

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

export const employeeService = {
  getAll: () => api.get('/employees'),
  create: (employeeData) => api.post('/employees', employeeData),
  update: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  delete: (id) => api.delete(`/employees/${id}`)
};

export const payrollService = {
  calculate: (payrollData) => api.post('/payroll/calculate', payrollData),
  getHistory: () => api.get('/payroll/history')
};

export default api;