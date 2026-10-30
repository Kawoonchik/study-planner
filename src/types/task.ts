export type Priority = 'low' | 'medium' | 'high'; //[cite: 3]

export interface Task {
  id: number; //[cite: 3]
  title: string; //[cite: 3]
  description: string; //[cite: 3]
  completed: boolean; //[cite: 3]
  priority: Priority; //[cite: 3]
  category: string; //[cite: 3]
}