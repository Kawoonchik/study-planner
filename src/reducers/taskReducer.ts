import type { Task, TaskAction } from '../types/task';

// Чиста функція для управління станом завдань[cite: 23]
export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'add': {
      // Додавання завдання
      const newTask: Task = {
        ...action.payload,
        id: Date.now(),
        isDeleting: false,
      };
      return [...state, newTask];
    }
    
    case 'toggle': {
      // Зміна стану виконання[cite: 22]
      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task
      );
    }

    case 'update': {
      // Редагування завдання (повністю замінюємо старий об'єкт новим)[cite: 22]
      return state.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
    }

    case 'requestDelete': {
      // Позначаємо завдання як таке, що очікує видалення[cite: 22]
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, isDeleting: true } : task
      );
    }

    case 'confirmDelete': {
      // Остаточне видалення завдання[cite: 23]
      return state.filter((task) => task.id !== action.payload.id);
    }

    case 'undoDelete': {
      // Скасування видалення (знімаємо позначку)[cite: 23]
      return state.map((task) =>
        task.id === action.payload.id ? { ...task, isDeleting: false } : task
      );
    }

    case 'clearCompleted': {
      // Видалення всіх виконаних завдань[cite: 23]
      return state.filter((task) => !task.completed);
    }

    case 'reset': {
      // Повернення до початкових даних (наприклад, завантажених з localStorage)[cite: 23]
      return action.payload;
    }

    default:
      return state;
  }
}