import { httpClient } from '../api/httpClient';
import type { ApiTodo, Task, TodosResponse } from '../types/task';

function toTask(todo: ApiTodo): Task {
  return {
    id: todo.id,
    title: todo.todo,
    description: '',
    completed: todo.completed,
    priority: 'medium',
    category: 'General',
    //
    createdBy: `User #${todo.userId || 1}`,
    createdAt: new Date().toLocaleDateString('uk-UA'),
  };
}

export interface GetTasksParams {
  limit?: number;
  skip?: number;
  search?: string;
  signal?: AbortSignal;
}

export const taskRepository = {
  async getAll({ limit = 10, skip = 0, search = '', signal }: GetTasksParams = {}) {
    const trimmedSearch = search.trim();
    const endpoint = trimmedSearch ? '/todos/search' : '/todos';

    const response = await httpClient.get<TodosResponse>(endpoint, {
      params: trimmedSearch
        ? { q: trimmedSearch, limit, skip }
        : { limit, skip },
      signal,
    });

    return {
      tasks: response.data.todos.map(toTask),
      total: response.data.total,
    };
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const response = await httpClient.get<ApiTodo>(`/todos/${id}`, { signal });
    return toTask(response.data);
  },

  async create(
    task: Omit<Task, 'id' | 'createdAt' | 'createdBy'> & { createdBy?: string }
  ): Promise<Task> {
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
      //
      createdBy: task.createdBy || 'Anonymous',
      createdAt: new Date().toLocaleDateString('uk-UA'),
    };
  },

  async update(id: number, updates: Partial<Omit<Task, 'id'>>): Promise<Task> {
    const response = await httpClient.put<ApiTodo>(`/todos/${id}`, {
      ...(updates.title !== undefined && { todo: updates.title }),
      ...(updates.completed !== undefined && { completed: updates.completed }),
    });

    return {
      ...toTask(response.data),
      ...updates,
      id,
    };
  },

  async delete(id: number): Promise<void> {
    await httpClient.delete(`/todos/${id}`);
  },
};