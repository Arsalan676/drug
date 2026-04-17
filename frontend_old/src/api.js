import axios from 'axios';

const API_BASE = 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' }
});

export const endpoints = {
  analyze: (input) => apiClient.post('/api/v1/analyze/', { input }),
  getMolecules: () => apiClient.get('/api/v1/analyze/molecules'),
  getTargets: () => apiClient.get('/api/v1/targets/'),
  getTarget: (key) => apiClient.get(`/api/v1/targets/${key}`),
  healthCheck: () => apiClient.get('/health')
};
