import { useState, useEffect } from 'react';


export function useLocalStorage<T>(key: string, initialValue: T) {

  const [value, setValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);

      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.warn(`Помилка читання localStorage для ключа "${key}":`, error);
      return initialValue;
    }
  });


  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Помилка запису в localStorage для ключа "${key}":`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}