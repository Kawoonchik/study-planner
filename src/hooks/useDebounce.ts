import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Встановлюємо таймер, який оновлює значення після затримки
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Клінап: якщо користувач знову вводить літеру до закінчення таймера — скасовуємо попередній таймер
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}