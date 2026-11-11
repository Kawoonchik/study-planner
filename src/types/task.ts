export type Priority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  isDeleting?: boolean; 
}


export type TaskAction =
  | { type: 'add'; payload: Omit<Task, 'id' | 'isDeleting'> }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: Task }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'confirmDelete'; payload: { id: number } }
  | { type: 'undoDelete'; payload: { id: number } }
  | { type: 'clearCompleted' }
  | { type: 'reset'; payload: Task[] };

