import axios from 'axios';
import { API_BASE_URL } from '../Config/env.js';
import { store } from '../Redux/store';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    
    // Handle authentication errors
    if (error.response?.status === 401) {
      // Token expired or invalid - could dispatch logout action here
      console.log('Authentication error - token may be expired');
    }
    
    return Promise.reject(error);
  }
);

// Generic API call function
export const apiCall = async (method, endpoint, data = null) => {
  try {
    const config = {
      method: method.toLowerCase(),
      url: endpoint,
    };

    if (data) {
      if (method.toLowerCase() === 'get') {
        config.params = data;
      } else {
        config.data = data;
      }
    }

    const response = await api(config);
    return response;
  } catch (error) {
    console.error(`API Call Error (${method} ${endpoint}):`, error);
    throw error;
  }
};

// Convenience methods
export const get = (endpoint, params = null) => apiCall('GET', endpoint, params);
export const post = (endpoint, data = null) => apiCall('POST', endpoint, data);
export const put = (endpoint, data = null) => apiCall('PUT', endpoint, data);
export const patch = (endpoint, data = null) => apiCall('PATCH', endpoint, data);
export const del = (endpoint) => apiCall('DELETE', endpoint);

export default api; 