export type Priority = 'low' | 'medium' | 'high';

// Наша існуюча Domain-модель для UI (один раз!)
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: Priority;
  category: string;
  isDeleting?: boolean; 
}

// Дії для Reducer'а (поки залишаємо, хоча пізніше ми від них частково відмовимося)
export type TaskAction =
  | { type: 'add'; payload: Omit<Task, 'id' | 'isDeleting'> }
  | { type: 'toggle'; payload: { id: number } }
  | { type: 'update'; payload: Task }
  | { type: 'requestDelete'; payload: { id: number } }
  | { type: 'confirmDelete'; payload: { id: number } }
  | { type: 'undoDelete'; payload: { id: number } }
  | { type: 'clearCompleted' }
  | { type: 'reset'; payload: Task[] };

// Формат об'єкта, який приходить від DummyJSON API
export interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

// Формат відповіді сервера при запиті списку завдань[cite: 11]
export interface TodosResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}