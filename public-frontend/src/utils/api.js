import axios from 'axios';

// Get API base URL from Vite environment variables (fallback to localhost:5000/api/v1)
const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
