import { httpClient } from '../api/httpClient';
import type { Task, ApiTodo, TodosResponse } from '../types/task';

// Зберігаємо локально створені або змінені таски, щоб DummyJSON їх не "губив"
let localCreatedTasks: Task[] = [];
let localUpdatedMap = new Map<number, Partial<Task>>();

function toTask(todo: ApiTodo): Task {
  const localEdits = localUpdatedMap.get(todo.id) || {};
  return {
    id: todo.id,
    title: localEdits.title !== undefined ? localEdits.title : todo.todo,
    description: localEdits.description !== undefined ? localEdits.description : '',
    completed: localEdits.completed !== undefined ? localEdits.completed : todo.completed,
    priority: localEdits.priority || 'medium',
    category: localEdits.category || 'General',
  };
}

export const taskRepository = {
  async getAll(limit = 10, skip = 0, signal?: AbortSignal): Promise<{ tasks: Task[], total: number }> {
    try {
      const response = await httpClient.get<TodosResponse>(`/todos?limit=${limit}&skip=${skip}`, { signal });
      let tasks = response.data.todos.map(toTask);
      
      // Додаємо локально створені таски на першу сторінку
      if (skip === 0) {
        tasks = [...localCreatedTasks, ...tasks];
      }
      
      return {
        tasks,
        total: response.data.total + localCreatedTasks.length
      };
    } catch (error) {
      // Fallback, якщо мережа впала
      return { tasks: localCreatedTasks, total: localCreatedTasks.length };
    }
  },

  async getById(id: number, signal?: AbortSignal): Promise<Task> {
    const localFound = localCreatedTasks.find(t => t.id === id);
    if (localFound) return localFound;

    const response = await httpClient.get<ApiTodo>(`/todos/${id}`, { signal });
    return toTask(response.data);
  },

  async create(task: Omit<Task, 'id' | 'isDeleting'>): Promise<Task> {
    try {
      const response = await httpClient.post<ApiTodo>('/todos/add', {
        todo: task.title,
        completed: task.completed,
        userId: 1,
      });
      const created: Task = {
        id: response.data.id || Date.now(), // Генеруємо унікальний ID якщо сервер не дав
        title: task.title,
        description: task.description,
        completed: task.completed,
        priority: task.priority,
        category: task.category,
      };
      localCreatedTasks.unshift(created);
      return created;
    } catch (e) {
      // На випадок збою мережі створюємо локально
      const fallbackTask: Task = {
        id: Date.now(),
        ...task
      };
      localCreatedTasks.unshift(fallbackTask);
      return fallbackTask;
    }
  },

  async update(id: number, updates: Partial<Task>):Promise<Task> {
    // Зберігаємо локально для захисту від обмежень DummyJSON
    const existingEdits = localUpdatedMap.get(id) || {};
    localUpdatedMap.set(id, { ...existingEdits, ...updates });

    // Оновлюємо в локально створених, якщо це наш таск
    const localIndex = localCreatedTasks.findIndex(t => t.id === id);
    if (localIndex !== -1) {
      localCreatedTasks[localIndex] = { ...localCreatedTasks[localIndex], ...updates };
      return localCreatedTasks[localIndex];
    }

    try {
      const payload: Partial<ApiTodo> = {};
      if (updates.title !== undefined) payload.todo = updates.title;
      if (updates.completed !== undefined) payload.completed = updates.completed;
      
      const response = await httpClient.patch<ApiTodo>(`/todos/${id}`, payload);
      return toTask(response.data);
    } catch (error) {
      // Якщо DummyJSON кидає 404 для нових тасків, ми все одно повертаємо успішний результат з локального мапу
      const baseTask = { id, title: '', description: '', completed: false, priority: 'medium' as const, category: 'General', ...updates };
      return baseTask;
    }
  },

  async delete(id: number): Promise<boolean> {
    localCreatedTasks = localCreatedTasks.filter(t => t.id !== id);
    localUpdatedMap.delete(id);
    try {
      await httpClient.delete(`/todos/${id}`);
      return true;
    } catch (e) {
      return true; // Навіть якщо сервер дав помилку, локально видалили успішно
    }
  },

  async search(query: string, limit = 10, skip = 0, signal?: AbortSignal): Promise<{ tasks: Task[], total: number }> {
    try {
      const response = await httpClient.get<TodosResponse>(`/todos/search?q=${encodeURIComponent(query)}&limit=${limit}&skip=${skip}`, { signal });
      return {
        tasks: response.data.todos.map(toTask),
        total: response.data.total
      };
    } catch (error) {
      // Надійний клієнтський пошук у разі помилки сервера
      const all = await this.getAll(100, 0, signal);
      const filtered = all.tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()));
      return {
        tasks: filtered.slice(skip, skip + limit),
        total: filtered.length
      };
    }
  }
};