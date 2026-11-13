import { useEffect, useState } from 'react';
import { taskRepository } from '../repositories/taskRepository';
import type { Task } from '../types/task';

interface TaskDetailsModalProps {
  taskId: number;
  onClose: () => void;
}

export default function TaskDetailsModal({ taskId, onClose }: TaskDetailsModalProps) {
  // Локальний стейт компонента для збереження даних завдання
  const [taskDetails, setTaskDetails] = useState<Task | null>(null);
  
  // Асинхронні стани[cite: 20]
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // AbortController для скасування запиту, якщо користувач закриє вікно до завершення завантаження
    const controller = new AbortController();

    const fetchDetails = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await taskRepository.getById(taskId, controller.signal);
        setTaskDetails(data);
      } catch (err: any) {
        if (err.name === 'CanceledError' || err.message === 'canceled') {
          console.log('Запит деталей скасовано');
        } else {
          setError(err.message || 'Не вдалося завантажити деталі завдання');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();

    // Cleanup-функція скасовує запит[cite: 26]
    return () => {
      controller.abort();
    };
  }, [taskId]);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 transition"
        >
          ✖
        </button>
        
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2">Деталі завдання</h2>
        
        {/* Loading State[cite: 25] */}
        {isLoading && (
          <div className="flex justify-center items-center py-8">
            <span className="text-gray-500 animate-pulse">Завантаження даних сервера...</span>
          </div>
        )}
        
        {/* Error State[cite: 25] */}
        {error && (
          <div className="text-red-500 bg-red-50 p-4 rounded-lg text-center">
            <p>{error}</p>
            <button onClick={() => {
               setIsLoading(true);
               // Просте оновлення через зміну стану
               taskRepository.getById(taskId).then(setTaskDetails).catch(() => setError('Знову помилка')).finally(() => setIsLoading(false));
            }} className="mt-3 text-sm underline">Спробувати ще</button>
          </div>
        )}
        
        {/* Success State[cite: 25] */}
        {!isLoading && !error && taskDetails && (
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Назва</span>
              <p className="font-medium text-lg text-gray-900 leading-tight">{taskDetails.title}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Статус</span>
                <p className="mt-1">
                  {taskDetails.completed ? (
                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-sm font-medium bg-green-50 text-green-700">✅ Виконано</span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 py-1 px-2 rounded-md text-sm font-medium bg-orange-50 text-orange-700">⏳ В процесі</span>
                  )}
                </p>
              </div>
              
              <div>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Пріоритет</span>
                <p className="mt-1">
                  <span className={`inline-flex py-1 px-2 rounded-md text-sm font-medium ${
                    taskDetails.priority === 'high' ? 'bg-red-50 text-red-700' : 
                    taskDetails.priority === 'medium' ? 'bg-blue-50 text-blue-700' : 'bg-gray-100 text-gray-700'
                  }`}>
                    {taskDetails.priority === 'high' ? 'Високий' : taskDetails.priority === 'medium' ? 'Середній' : 'Низький'}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Категорія</span>
              <p className="mt-1 text-gray-700">{taskDetails.category}</p>
            </div>
            
            <div>
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Опис</span>
              <div className="mt-1 p-3 bg-gray-50 rounded-lg text-gray-700 text-sm whitespace-pre-wrap min-h-[60px]">
                {taskDetails.description || <span className="text-gray-400 italic">Немає опису...</span>}
              </div>
            </div>
          </div>
        )}
        
        <div className="mt-8 flex justify-end">
          <button 
            onClick={onClose} 
            className="px-5 py-2 bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-lg font-medium transition"
          >
            Закрити
          </button>
        </div>
      </div>
    </div>
  );
}