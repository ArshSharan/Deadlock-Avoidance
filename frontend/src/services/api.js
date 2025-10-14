import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.status, error.message);
    return Promise.reject(error);
  }
);

/**
 * Run Banker's Algorithm for a resource request
 */
export const runBankersAlgorithm = async (data) => {
  try {
    const response = await api.post('/run-bankers', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to run Banker\'s Algorithm' };
  }
};

/**
 * Check if current state is safe
 */
export const checkSafety = async (data) => {
  try {
    const response = await api.post('/check-safety', data);
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to check safety' };
  }
};

/**
 * Get all allocation logs
 */
export const getLogs = async () => {
  try {
    const response = await api.get('/logs');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to fetch logs' };
  }
};

/**
 * Export logs as CSV
 */
export const exportLogs = async () => {
  try {
    const response = await api.get('/logs/export');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to export logs' };
  }
};

/**
 * Reset system state
 */
export const resetSystem = async () => {
  try {
    const response = await api.post('/reset');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to reset system' };
  }
};

/**
 * Load a demo scenario
 */
export const loadScenario = async (scenario) => {
  try {
    const response = await api.post('/simulate', { scenario });
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Failed to load scenario' };
  }
};

/**
 * Health check
 */
export const healthCheck = async () => {
  try {
    const response = await api.get('/health');
    return response.data;
  } catch (error) {
    throw error.response?.data || { error: 'Backend server is not responding' };
  }
};

export default api;
