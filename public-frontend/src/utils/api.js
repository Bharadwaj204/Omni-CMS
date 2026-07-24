import axios from 'axios';

// Get API base URL from Vite environment variables (default to live Render backend)
const API_URL = import.meta.env.VITE_PUBLIC_API_URL || 'https://omni-cms-backend.onrender.com/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
