import { useReducer, useEffect, useState, type ReactNode, useCallback } from 'react';
import type { Task } from '../types/task';
import { taskReducer } from '../reducers/taskReducer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { initialTasks } from '../data/initialTasks';
import { TaskContext } from './taskContext';

const TASKS_STORAGE_KEY = 'study-planner-tasks';

// 2. Створюємо Provider — компонент-обгортку[cite: 15]
export function TaskProvider({ children }: { children: ReactNode }) {
  // Ініціалізація Reducer'а з читанням із localStorage
  const [tasks, dispatch] = useReducer(taskReducer, [], () => {
    try {
      const saved = localStorage.getItem(TASKS_STORAGE_KEY);
      return saved ? JSON.parse(saved) : initialTasks;
    } catch (error) {
      console.warn("Помилка читання завдань із localStorage", error);
      return initialTasks;
    }
  });

  // Синхронізація Reducer'а з localStorage при кожній зміні масиву tasks
  useEffect(() => {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  // Фільтр керується нашим кастомним хуком
  const [filter, setFilter] = useLocalStorage('study-planner-filter', 'all');

  // Логіка для Toast-повідомлень (показуємо 3 секунди)
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toast = useCallback((message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  }, []);

  // 3. Функції-обгортки над dispatch (щоб компоненти не знали про Reducer)[cite: 16]
  const addTask = useCallback((payload: Omit<Task, 'id' | 'isDeleting'>) => dispatch({ type: 'add', payload }), []);
  const updateTask = useCallback((payload: Task) => dispatch({ type: 'update', payload }), []);
  const toggleTask = useCallback((id: number) => dispatch({ type: 'toggle', payload: { id } }), []);
  const requestDelete = useCallback((id: number) => dispatch({ type: 'requestDelete', payload: { id } }), []);
  const confirmDelete = useCallback((id: number) => dispatch({ type: 'confirmDelete', payload: { id } }), []);
  const undoDelete = useCallback((id: number) => dispatch({ type: 'undoDelete', payload: { id } }), []);
  const clearCompleted = useCallback(() => dispatch({ type: 'clearCompleted' }), []);
  
  const resetTasks = useCallback(() => {
    dispatch({ type: 'reset', payload: initialTasks });
    toast('Дані скинуто до початкових');
  }, [toast]);

  return (
    <TaskContext.Provider value={{
      tasks, filter, setFilter,
      addTask, updateTask, toggleTask, requestDelete, confirmDelete, undoDelete, clearCompleted, resetTasks,
      toast, toastMessage
    }}>
      {children}
    </TaskContext.Provider>
  );
}