export const PRIORITIES = ['low', 'medium', 'high'] as const;
export type Priority = typeof PRIORITIES[number];

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  isDeleting?: boolean; // Необов'язкове поле для позначення завдання, що очікує видалення[cite: 25]
}

// Типізація дій (Actions) для Reducer'а[cite: 22, 23]
export type TaskAction =
  | { type: 'add'; payload: Omit<Task, 'id' | 'isDeleting'> }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: Task }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'confirmDelete'; payload: { id: number } }
  | { type: 'undoDelete'; payload: { id: number } }
  | { type: 'clearCompleted' }
  | { type: 'reset'; payload: Task[] };

