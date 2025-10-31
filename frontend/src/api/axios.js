
import axios from 'axios';

// Derive a safe default when env is missing
const derivedBaseUrl = (() => {
  const envUrl = import.meta?.env?.VITE_API_URL;
  if (envUrl && typeof envUrl === 'string') return envUrl;

  const host = typeof window !== 'undefined' ? window.location.hostname : '';
  if (host === 'localhost' || host === '127.0.0.1') {
    return 'http://localhost:5000/api';
  }
  // Fallback for production if env not set
  return 'https://bento-pao9.onrender.com/api';
})();

const instance = axios.create({
  baseURL: derivedBaseUrl,
});
// console.log("🌍 API Base URL =>", derivedBaseUrl);


// Interceptor to add the auth token to every request
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
