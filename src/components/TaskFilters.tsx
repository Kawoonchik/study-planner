type TaskFilter = 'all' | 'completed' | 'uncompleted';

interface TaskFiltersProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <button
        type="button"
        className={`px-5 py-2 rounded-full border font-medium transition ${
          currentFilter === 'all'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => onFilterChange('all')}
      >
        Всі
      </button>
      <button
        type="button"
        className={`px-5 py-2 rounded-full border font-medium transition ${
          currentFilter === 'completed'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => onFilterChange('completed')}
      >
        Виконані
      </button>
      <button
        type="button"
        className={`px-5 py-2 rounded-full border font-medium transition ${
          currentFilter === 'uncompleted'
            ? 'bg-blue-600 text-white border-blue-600'
            : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
        }`}
        onClick={() => onFilterChange('uncompleted')}
      >
        Не виконані
      </button>
    </div>
  );
}

export default TaskFilters;
