import { httpClient } from '../api/httpClient';
import type { Task, ApiTodo, TodosResponse } from '../types/task';

// Допоміжна функція: перетворює дані сервера (ApiTodo) на наші завдання (Task)[cite: 12]
// Оскільки API не має полів description, priority та category, ми ставимо для них значення за замовчуванням[cite: 12].
function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    category: 'General',
  };
}

export const taskRepository = {
  // Отримання списку завдань з пагінацією та можливістю скасування (AbortSignal)[cite: 11, 13, 15]
  async getAll(limit = 10, skip = 0, signal?: AbortSignal): Promise<{ tasks: Task[], total: number }> {
    const response = await httpClient.get<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, { signal });
    return {
      tasks: response.data.todos.map(toTask), // мапимо кожен елемент масиву[cite: 12]
      total: response.data.total
    };
  },

  // Отримання одного завдання за ID (для перегляду деталей)[cite: 11, 13]
  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const response = await httpClient.get<ApiTodo>(`/todos/${id}`, { signal });
    return toTask(response.data);
  },

  // Створення нового завдання[cite: 11, 13]
  async create(task: Omit<Task, 'id' | 'isDeleting'>): Promise<Task> {
    const response = await httpClient.post<ApiTodo>('/todos/add', {
      todo: task.title,
      completed: task.completed,
      userId: 1, // DummyJSON вимагає передавати userId
    });
    
    // Ми беремо id від сервера, але відновлюємо наші клієнтські поля, яких там немає[cite: 12]
    const createdTodo = toTask(response.data);
    return { 
      ...createdTodo, 
      description: task.description, 
      priority: task.priority, 
      category: task.category 
    };
  },

  // Оновлення завдання[cite: 11, 13]
  async update(id: number, updates: Partial<Task>): Promise<Task> {
    // Формуємо payload лише з тих полів, які підтримує DummyJSON
    const payload: Partial<ApiTodo> = {};
    if (updates.title !== undefined) payload.todo = updates.title;
    if (updates.completed !== undefined) payload.completed = updates.completed;
    
    const response = await httpClient.patch<ApiTodo>(`/todos/${id}`, payload);
    return toTask(response.data);
  },

  // Видалення завдання[cite: 11, 13]
  async delete(id: number): Promise<boolean> {
    const response = await httpClient.delete(`/todos/${id}`);
    // DummyJSON повертає { ..., isDeleted: true }
    return response.data.isDeleted;
  }
};