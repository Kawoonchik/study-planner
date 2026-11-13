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

// Наша існуюча Domain-модель для UI (залишається без змін)
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  category: string;
  isDeleting?: boolean;
}

// НОВЕ: Формат об'єкта, який приходить від DummyJSON API[cite: 12]
export interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// НОВЕ: Формат відповіді сервера при запиті списку завдань[cite: 11]
export interface TodosResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}