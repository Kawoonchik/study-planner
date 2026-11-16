import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { TaskContext, type TaskFilter } from './task-context';

export function TaskProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useLocalStorage<TaskFilter>('study-planner-filter', 'all');
  
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