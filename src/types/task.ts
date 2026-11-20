export type TaskPriority = 'low' | 'medium' | 'high';

export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: TaskPriority;
  category: string;
  createdBy: string;
  createdAt: string;
}

export interface ApiTodo {
  id: number;
  todo: string;
  completed: boolean;
  userId: number;
}

export interface TodosResponse {
  todos: ApiTodo[];
  total: number;
  skip: number;
  limit: number;
}