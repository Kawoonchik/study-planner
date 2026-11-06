import { createContext } from 'react';
import type { Task } from '../types/task';

interface TaskContextType {
  tasks: Task[];
  filter: string;
  setFilter: (filter: string) => void;
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
