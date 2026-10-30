import { useState } from 'react';
import Header from './components/Header';
import TaskFilters from './components/TaskFilters';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import { initialTasks } from './data/initialTasks';
import type { Task } from './types/task';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  function addTask(newTaskData: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now(),
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  return (
    <div className="app-container">
      <h1>Study Planner</h1>
      <Header />
      <TaskForm onAdd={addTask} />
      <TaskStats />
      <TaskFilters />
      <TaskList tasks={tasks} />
    </div>
  );
}