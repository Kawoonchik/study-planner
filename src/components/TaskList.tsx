import { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { useDebounce } from '../hooks/useDebounce';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskStats from './TaskStats';
import TaskFilters from './TaskFilters';

const ITEMS_PER_PAGE = 10;

export function TaskList() {
  const { filter, toast } = useTaskContext();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedSearchQuery = useDebounce(searchQuery, 400);

  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const fetchTasks = async (page: number, query: string, signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * ITEMS_PER_PAGE;
      let data;

      if (query.trim()) {
        data = await taskRepository.search(query, ITEMS_PER_PAGE, skip, signal);
      } else {
        data = await taskRepository.getAll(ITEMS_PER_PAGE, skip, signal);
      }

      setTasks(data.tasks);
      setTotalTasks(data.total);
    } catch (err: any) {
      if (err.name === 'CanceledError' || err.message === 'canceled') {
        console.log('Запит скасовано');
      } else {
        setError(err.message || 'Не вдалося завантажити завдання');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    fetchTasks(currentPage, debouncedSearchQuery, controller.signal);
    return () => {
      controller.abort();
    };
  }, [currentPage, debouncedSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); 
  };

  const handleUpdateLocal = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleDeleteLocal = (id: number) => {
    setTasks(prev => prev.filter(t => t.id !== id));
    setTotalTasks(prev => Math.max(0, prev - 1));
  };

  const handleSaveNewTask = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    setTotalTasks(prev => prev + 1);
  };

  // Кнопка очищення виконаних
  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter(t => t.completed);
    for (const task of completedTasks) {
      await taskRepository.delete(task.id);
    }
    setTasks(prev => prev.filter(t => !t.completed));
    setTotalTasks(prev => Math.max(0, prev - completedTasks.length));
    toast('Виконані завдання успішно очищено');
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const totalPages = Math.ceil(totalTasks / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col">
      <TaskForm onSave={handleSaveNewTask} />
      <TaskStats tasks={tasks} />
      
      <div className="mb-4">
        <input 
          type="text"
          value={searchQuery}
          onChange={handleSearchChange}
          placeholder="🔍 Пошук завдань за назвою..."
          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white shadow-sm"
        />
      </div>

      <TaskFilters onClearCompleted={handleClearCompleted} />

      <div className="mt-4">
        {isLoading && (
          <div className="text-center p-8 text-gray-500 font-medium">Завантаження з сервера...</div>
        )}
        
        {error && !isLoading && (
          <div className="text-center p-8 text-red-500 bg-white rounded-xl border border-red-200">
            <p>Помилка завантаження: {error}</p>
            <button onClick={() => fetchTasks(currentPage, debouncedSearchQuery)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
              Спробувати ще
            </button>
          </div>
        )}

        {!isLoading && !error && tasks.length === 0 && (
          <div className="text-center p-8 text-gray-500 bg-white rounded-xl border border-gray-200 shadow-sm">
            Завдань не знайдено.
          </div>
        )}

        {!isLoading && !error && filteredTasks.length > 0 && (
          <ul className="flex flex-col gap-3">
            {filteredTasks.map((task) => (
              <TaskItem 
                key={task.id} 
                task={task} 
                onUpdate={handleUpdateLocal}
                onDelete={handleDeleteLocal}
              />
            ))}
          </ul>
        )}

        {!isLoading && !error && tasks.length > 0 && filteredTasks.length === 0 && (
          <p className="text-center text-gray-500 py-4">Немає завдань для цього фільтра.</p>
        )}

        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-6 border-t border-gray-200 pt-4">
            <button 
              disabled={currentPage === 1 || isLoading}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Попередня
            </button>
            <span className="text-sm font-medium text-gray-600">
              Сторінка {currentPage} з {totalPages}
            </span>
            <button 
              disabled={currentPage === totalPages || isLoading}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-white border border-gray-300 rounded-lg disabled:opacity-50 hover:bg-gray-50 transition font-medium text-gray-700"
            >
              Наступна
            </button>
          </div>
        )}
      </div>
    </div>
  );
}