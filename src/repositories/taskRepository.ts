import { httpClient } from '../api/httpClient';
import type { Task, ApiTodo, TodosResponse } from '../types/task';

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
  async getAll(limit = 10, skip = 0, signal?: AbortSignal): Promise<{ tasks: Task[], total: number }> {
    const response = await httpClient.get<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, { signal });
    return {
      tasks: response.data.todos.map(toTask),
      total: response.data.total,
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const response = await httpClient.get<ApiTodo>(`/todos/${id}`, { signal });
    return toTask(response.data);
  },

  async create(task: Omit<Task, 'id' | 'isDeleting'>): Promise<Task> {
    const response = await httpClient.post<ApiTodo>('/todos/add', {
      todo: task.title,
      completed: task.completed,
      userId: 1,
    });

    return {
      id: response.data.id,
      title: task.title,
      description: task.description,
      completed: task.completed,
      priority: task.priority,
      category: task.category,
    };
  },

  async update(id: number, updates: Partial<Task>): Promise<Task> {
    const payload: Partial<ApiTodo> = {};
    if (updates.title !== undefined) payload.todo = updates.title;
    if (updates.completed !== undefined) payload.completed = updates.completed;

    const response = await httpClient.patch<ApiTodo>(`/todos/${id}`, payload);
    return toTask(response.data);
  },

  async delete(id: number): Promise<boolean> {
    await httpClient.delete(`/todos/${id}`);
    return true;
  },


  async search(query: string, limit = 10, skip = 0, signal?: AbortSignal): Promise<{ tasks: Task[], total: number }> {
    const response = await httpClient.get<TodosResponse>(`/todos?limit=150&skip=0`, { signal });
    const filtered = response.data.todos
      .map(toTask)
      .filter((t) => t.title.toLowerCase().includes(query.toLowerCase()));

    return {
      tasks: filtered.slice(skip, skip + limit),
      total: filtered.length,
    };
  },
};