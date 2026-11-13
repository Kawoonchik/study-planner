import { createContext } from 'react';

export type TaskFilter = 'all' | 'completed' | 'incomplete';

export interface TaskContextValue {
  filter: TaskFilter;
  setFilter: (filter: TaskFilter) => void;
  toast: (message: string) => void;
  toastMessage: string | null;
}

export const TaskContext = createContext<TaskContextValue | undefined>(undefined);
