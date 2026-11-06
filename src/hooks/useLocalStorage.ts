import { useState, useEffect } from 'react';

// Дженерик <T> дозволяє хуку працювати з будь-яким типом даних (рядок, масив, об'єкт)
export function useLocalStorage<T>(key: string, initialValue: T) {
  // Використовуємо функцію для ініціалізації стану (Lazy initialization)
  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      // Обов'язково обробляємо можливі помилки JSON.parse[cite: 16]
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Помилка читання localStorage для ключа "${key}":`, error);
      return initialValue; // Якщо дані пошкоджені, повертаємо початкове значення[cite: 16]
    }
  });

  // useEffect автоматично синхронізує state із localStorage при кожній зміні value
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Помилка запису в localStorage для ключа "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}