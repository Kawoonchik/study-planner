import { createContext } from 'react';
import type { Task } from '../types/task';

export type TaskFilter = 'all' | 'completed' | 'incomplete';

interface TaskContextType {
  tasks: Task[];
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  addTask: (task: Omit<Task, 'id' | 'isDeleting'>) => void;
  updateTask: (task: Task) => void;
  toggleTask: (id: number) => void;
  requestDelete: (id: number) => void;
  confirmDelete: (id: number) => void;
  undoDelete: (id: number) => void;
  clearCompleted: () => void;
  resetTasks: () => void;
  toast: (message: string) => void;
  toastMessage: string | null;
}

export const TaskContext = createContext<TaskContextType | undefined>(undefined);
