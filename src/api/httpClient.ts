import axios from 'axios';

// Отримуємо URL зі змінних середовища (Vite використовує import.meta.env)[cite: 9, 12]
const baseURL = import.meta.env.VITE_API_URL;

if (!baseURL) {
  console.warn("VITE_API_URL is not defined in .env file. Falling back to default.");
}

// Додаткове завдання 3: Створення Axios instance з базовим URL[cite: 15]
export const httpClient = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  // timeout: 10000, // Можна розкоментувати, щоб запити скасовувалися через 10 сек
});

// Додаткове завдання 4: Централізована нормалізація помилок[cite: 15]
// Цей перехоплювач (interceptor) буде спрацьовувати при кожній відповіді від сервера
httpClient.interceptors.response.use(
  (response) => {
    // Якщо все добре, просто повертаємо відповідь
    return response;
  },
  (error) => {
    // Якщо сталася помилка (наприклад, 404 або 500)
    // Тут ми можемо нормалізувати її формат для всього застосунку
    const customError = new Error(
      error.response?.data?.message || error.message || 'Сталася невідома помилка під час запиту'
    );
    console.error('API Error [httpClient]:', customError.message);
    
    // Кидаємо помилку далі, щоб її міг обробити Repository або UI
    return Promise.reject(customError);
  }
);