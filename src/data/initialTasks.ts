import type { Task } from '../types/task';

export const initialTasks: Task[] = [
  {
    id: 1, //[cite: 3]
    title: 'React Components', //[cite: 4]
    description: 'Опрацювати базові принципи компонентів React', //[cite: 4]
    completed: false, //[cite: 4]
    priority: 'high', //[cite: 4]
    category: 'React', //[cite: 4]
  },
  {
    id: 2, //[cite: 4]
    title: 'TypeScript Exercises', //[cite: 4]
    description: 'Виконати практичні вправи', //[cite: 4]
    completed: true, //[cite: 4]
    priority: 'medium', //[cite: 4]
    category: 'TypeScript', //[cite: 4]
  }
];