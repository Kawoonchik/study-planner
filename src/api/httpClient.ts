import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://dummyjson.com';

let currentAccessToken: string | null = null;

export function setAuthToken(token: string | null) {
  currentAccessToken = token;
}

export const httpClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

//
httpClient.interceptors.request.use((config) => {
  if (currentAccessToken) {
    config.headers.Authorization = `Bearer ${currentAccessToken}`;
  }
  return config;
});

// 
httpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isCancel(error)) {
      return Promise.reject(error);
    }
    const message =
      error.response?.data?.message ||
      error.message ||
      'Помилка мережі або сервера';
    return Promise.reject(new Error(message));
  }
);