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
  const [filter, setFilter] = useState<'all' | 'completed' | 'uncompleted'>(
    'all',
  );
  const filteredTasks =
    filter === 'completed'
      ? tasks.filter((task) => task.completed)
      : filter === 'uncompleted'
        ? tasks.filter((task) => !task.completed)
        : tasks;

  function addTask(newTaskData: Omit<Task, 'id'>): void {
    const newTask: Task = {
      ...newTaskData,
      id: Date.now(),
    };

    setTasks((currentTasks) => [...currentTasks, newTask]);
  }

  function toggleTaskCompletion(id: number): void {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: number): void {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
  }

  return (
    <div className="app-container">
      <Header />
      <TaskForm onAdd={addTask} />
      <TaskStats tasks={tasks} />
      <TaskFilters currentFilter={filter} onFilterChange={setFilter} />
      <TaskList
        filteredTasks={filteredTasks}
        totalCount={tasks.length}
        onToggle={toggleTaskCompletion}
        onDelete={deleteTask}
      />
    </div>
  );
}