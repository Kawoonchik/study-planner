import { createContext, useState, useCallback, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

export type TaskFilter = 'all' | 'completed' | 'incomplete';

// Залишаємо в Контексті ТІЛЬКИ UI-стан (фільтр та повідомлення)[cite: 15]
interface TaskContextValue {
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  toast: (message: string) => void;
  toastMessage: string | null;
}

export const TaskContext = createContext<TaskContextValue | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  // Активний фільтр все ще зберігаємо в localStorage (це дозволено методичкою)[cite: 15]
  const [filter, setFilter] = useLocalStorage<TaskFilter>('study-planner-filter', 'all');
  
  // Логіка для Toast-повідомлень залишається без змін
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  const contextValue = useMemo(() => ({
    filter, setFilter, toast, toastMessage
  }), [filter, setFilter, toast, toastMessage]);

  return (
    <TaskContext.Provider value={contextValue}>
      {children}
    </TaskContext.Provider>
  );
}