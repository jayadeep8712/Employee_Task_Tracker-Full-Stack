import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000',
  timeout: 8000,
});

let unauthorizedHandler = null;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof unauthorizedHandler === 'function') {
      unauthorizedHandler();
    }
    return Promise.reject(error);
  }
);

const unwrap = (promise) => promise.then((response) => response.data.data);

export const setAuthToken = (token) => {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common.Authorization;
  }
};

export const setUnauthorizedHandler = (handler) => {
  unauthorizedHandler = handler;
};

export const api = {
  login: (credentials) => unwrap(apiClient.post('/auth/login', credentials)),
  getEmployees: () => unwrap(apiClient.get('/employees')),
  createEmployee: (payload) => unwrap(apiClient.post('/employees', payload)),
  updateEmployee: (id, payload) => unwrap(apiClient.put(`/employees/${id}`, payload)),
  deleteEmployee: (id) => apiClient.delete(`/employees/${id}`),
  getTasks: (params = {}) => unwrap(apiClient.get('/tasks', { params })),
  createTask: (payload) => unwrap(apiClient.post('/tasks', payload)),
  updateTask: (id, payload) => unwrap(apiClient.put(`/tasks/${id}`, payload)),
  deleteTask: (id) => apiClient.delete(`/tasks/${id}`),
  getDashboard: () => unwrap(apiClient.get('/dashboard')),
};

export const handleApiError = (error) => {
  if (error.response?.data?.errors) {
    return error.response.data.errors.join(', ');
  }
  return error.response?.data?.message || error.message || 'Unexpected error';
};

