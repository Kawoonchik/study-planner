import { useEffect, useState } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

// Імпортуємо всі наші UI-компоненти (переконайся, що вони експортуються як default)
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import TaskStats from './TaskStats';
import TaskFilters from './TaskFilters'; // Якщо експортується без default, додай фігурні дужки { TaskFilters }

const ITEMS_PER_PAGE = 10;

export function TaskList() {
  const { filter, toast } = useTaskContext();
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  const fetchTasks = async (page: number, signal?: AbortSignal) => {
    setIsLoading(true);
    setError(null);
    try {
      const skip = (page - 1) * ITEMS_PER_PAGE;
      const data = await taskRepository.getAll(ITEMS_PER_PAGE, skip, signal);
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
    fetchTasks(currentPage, controller.signal);
    return () => {
      controller.abort();
    };
  }, [currentPage]);

  // Функції для локального оновлення після дій у TaskItem та TaskForm
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

  const handleClearCompleted = async () => {
    const completedTasks = tasks.filter(task => task.completed);
    const results = await Promise.allSettled(
      completedTasks.map(task => taskRepository.delete(task.id))
    );
    const deletedIds = results.reduce<number[]>((ids, result, index) => {
      if (result.status === 'fulfilled' && result.value) {
        ids.push(completedTasks[index].id);
      }
      return ids;
    }, []);

    if (deletedIds.length > 0) {
      setTasks(prev => prev.filter(task => !deletedIds.includes(task.id)));
      setTotalTasks(prev => Math.max(0, prev - deletedIds.length));
    }

    if (deletedIds.length < completedTasks.length) {
      toast('Не вдалося видалити всі виконані завдання');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const totalPages = Math.ceil(totalTasks / ITEMS_PER_PAGE);

  return (
    <div className="flex flex-col">
      {/* 1. Форма створення */}
      <TaskForm onSave={handleSaveNewTask} />
      
      {/* 2. Статистика (передаємо дані) */}
      <TaskStats tasks={tasks} />
      
      {/* 3. Фільтри */}
      <TaskFilters onClearCompleted={handleClearCompleted} />

      {/* 4. Сам список */}
      <div className="mt-4">
        {isLoading && <div className="text-center p-8 text-gray-500">Завантаження з сервера...</div>}
        
        {error && (
          <div className="text-center p-8 text-red-500">
            <p>Помилка завантаження: {error}</p>
            <button onClick={() => fetchTasks(currentPage)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition">
              Спробувати ще
            </button>
          </div>
        )}

        {!isLoading && !error && tasks.length === 0 && (
          <div className="text-center p-8 text-gray-500 bg-white rounded-xl border border-gray-200">
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

        {/* 5. Пагінація */}
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