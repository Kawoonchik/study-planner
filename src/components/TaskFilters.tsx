import { useTaskContext } from '../hooks/useTaskContext';

function TaskFilters() {
  const { filter, setFilter, clearCompleted } = useTaskContext();

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          className={`px-5 py-2 rounded-full border font-medium transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setFilter('all')}
        >
          Всі
        </button>
        <button
          type="button"
          className={`px-5 py-2 rounded-full border font-medium transition ${
            filter === 'completed'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setFilter('completed')}
        >
          Виконані
        </button>
        <button
          type="button"
          className={`px-5 py-2 rounded-full border font-medium transition ${
            filter === 'incomplete'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
          }`}
          onClick={() => setFilter('incomplete')}
        >
          Не виконані
        </button>
      </div>
      <button
        type="button"
        className="px-4 py-2 rounded-full font-medium text-red-600 hover:bg-red-50 transition"
        onClick={clearCompleted}
      >
        Очистити виконані
      </button>
    </div>
  );
}

export default TaskFilters;
