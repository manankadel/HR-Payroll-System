import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://hr-payroll-system-mgc5.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData)
};

export const employeeService = {
  getAll: () => api.get('/employees'),
  getById: (id) => api.get(`/employees/${id}`),
  create: (employeeData) => api.post('/employees', employeeData),
  update: (id, employeeData) => api.put(`/employees/${id}`, employeeData),
  delete: (id) => api.delete(`/employees/${id}`),
  getDepartmentStats: () => api.get('/employees/department-stats')
};

export const leaveService = {
  apply: (leaveData) => api.post('/leaves/apply', leaveData),
  getAll: () => api.get('/leaves'),
  getEmployeeLeaves: (employeeId) => api.get(`/leaves/employee/${employeeId}`),
  getBalance: (employeeId) => api.get(`/leaves/balance/${employeeId}`),
  updateStatus: (id, statusData) => api.put(`/leaves/${id}/status`, statusData),
  getTopTakers: () => api.get('/leaves/top-takers'),
  getCalendarEvents: (startDate, endDate) => 
    api.get(`/leaves/calendar?startDate=${startDate}&endDate=${endDate}`)
};

export const payrollService = {
  calculate: (payrollData) => api.post('/payroll/calculate', payrollData),
  getHistory: () => api.get('/payroll/history')
};

export default api;