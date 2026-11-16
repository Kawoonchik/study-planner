import axios from 'axios';


const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.warn("VITE_API_URL is not defined in .env file. Falling back to default.");
}


export const httpClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, 
});


httpClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const customError = new Error(
      error.response?.data?.message || error.message || 'Сталася невідома помилка під час запиту'
    );
    console.error('API Error [httpClient]:', customError.message);

    return Promise.reject(customError);
  }
);