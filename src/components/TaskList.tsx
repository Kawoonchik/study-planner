import { useEffect, useState, useRef } from 'react';
import { useTaskContext } from '../context/task-context';
import { taskRepository } from '../repositories/taskRepository';
import { Task } from '../types/task';
import { TaskItem } from './TaskItem';

const ITEMS_PER_PAGE = 10;

export function TaskList() {
  const { filter } = useTaskContext(); // З контексту беремо ТІЛЬКИ UI-стан
  
  // Локальні стани для роботи з сервером (Server State)
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Стани для пагінації[cite: 13]
  const [currentPage, setCurrentPage] = useState(1);
  const [totalTasks, setTotalTasks] = useState(0);

  // Функція для завантаження даних
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
        console.log('Запит скасовано'); // Ігноруємо помилку, якщо ми самі скасували запит[cite: 15]
      } else {
        setError(err.message || 'Не вдалося завантажити завдання');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Викликаємо завантаження при зміні сторінки
  useEffect(() => {
    // Створюємо AbortController для скасування попереднього запиту[cite: 9, 14, 15]
    const controller = new AbortController();
    
    fetchTasks(currentPage, controller.signal);

    // Cleanup-функція: скасовує HTTP-запит, якщо компонент зникає або сторінка змінюється до завершення запиту
    return () => {
      controller.abort();
    };
  }, [currentPage]);

  // Фільтруємо завдання на клієнті (оскільки DummyJSON не має endpoint'у для фільтрації completed)
  const filteredTasks = tasks.filter((task) => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const totalPages = Math.ceil(totalTasks / ITEMS_PER_PAGE);

  // Візуальні стани згідно з вимогами (Loading, Error, Empty)
  if (isLoading) return <div className="text-center p-8 text-gray-500">Завантаження...</div>;
  
  if (error) {
    return (
      <div className="text-center p-8 text-red-500">
        <p>Помилка завантаження: {error}</p>
        <button onClick={() => fetchTasks(currentPage)} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded">
          Спробувати ще
        </button>
      </div>
    );
  }

  if (tasks.length === 0) return <div className="text-center p-8 text-gray-500">Завдань не знайдено.</div>;

  return (
    <div className="flex flex-col gap-4">
      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500 py-4">Немає завдань для цього фільтра.</p>
      ) : (
        <ul className="flex flex-col gap-3">
          {filteredTasks.map((task) => (
            <TaskItem 
              key={task.id} 
              task={task} 
              // Наступним кроком ми оновимо TaskItem, щоб він не приймав пропси, а працював через Repository
              // Поки що можеш залишити пропси пустими, якщо TypeScript свариться, або передати заглушки
            />
          ))}
        </ul>
      )}

      {/* Пагінація[cite: 13, 14] */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-6 border-t pt-4">
          <button 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            Попередня
          </button>
          <span className="text-sm text-gray-600">
            Сторінка {currentPage} з {totalPages}
          </span>
          <button 
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 bg-gray-100 rounded disabled:opacity-50"
          >
            Наступна
          </button>
        </div>
      )}
    </div>
  );
}