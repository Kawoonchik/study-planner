import type { Task, TaskAction } from '../types/task';


export function taskReducer(state: Task[], action: TaskAction): Task[] {
  switch (action.type) {
    case 'add': {

      const newTask: Task = {
        ...action.payload,
        id: Date.now(),
        isDeleting: false,
      };
      return [...state, newTask];
    }
    
    case 'toggle': {

      return state.map((task) =>
        task.id === action.payload.id
          ? { ...task, completed: !task.completed }
          : task
      );
    }

    case 'update': {

      return state.map((task) =>
        task.id === action.payload.id ? action.payload : task
      );
    }

    case 'requestDelete': {

      return state.map((task) =>
        task.id === action.payload.id ? { ...task, isDeleting: true } : task
      );
    }

    case 'confirmDelete': {

      return state.filter((task) => task.id !== action.payload.id);
    }

    case 'undoDelete': {

      return state.map((task) =>
        task.id === action.payload.id ? { ...task, isDeleting: false } : task
      );
    }

    case 'clearCompleted': {

      return state.filter((task) => !task.completed);
    }

    case 'reset': {

      return action.payload;
    }

    default:
      return state;
  }
}