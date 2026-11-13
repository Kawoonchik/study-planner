import { useTaskContext } from '../hooks/useTaskContext';
import type { TaskFilter } from '../context/task-context';

interface TaskFiltersProps {
  onClearCompleted?: () => void;
}

export default function TaskFilters({ onClearCompleted }: TaskFiltersProps) {
  const { filter, setFilter } = useTaskContext();

  return (
    <div className="flex flex-wrap justify-between items-center gap-4 my-4">
      <div className="flex gap-2">
        <button 
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl font-medium transition ${filter === 'all' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
        >
          Всі
        </button>
        <button 
          onClick={() => setFilter('completed')}
          className={`px-4 py-2 rounded-xl font-medium transition ${filter === 'completed' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
        >
          Виконані
        </button>
        <button 
          onClick={() => setFilter('incomplete')}
          className={`px-4 py-2 rounded-xl font-medium transition ${filter === 'incomplete' ? 'bg-blue-600 text-white shadow' : 'bg-white text-gray-700 border border-gray-200 hover:bg-gray-50'}`}
        >
          Не виконані
        </button>
      </div>

      {onClearCompleted && (
        <button 
          onClick={onClearCompleted}
          className="text-red-600 hover:text-red-700 font-medium text-sm transition hover:underline"
        >
          Очистити виконані
        </button>
      )}
    </div>
  );
}