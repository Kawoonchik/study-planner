type TaskFilter = 'all' | 'completed' | 'uncompleted';

interface TaskFiltersProps {
  currentFilter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
}

function TaskFilters({ currentFilter, onFilterChange }: TaskFiltersProps) {
  return (
    <div className="taskfilters">
      <h2>TaskFilters</h2>
      <button
        type="button"
        className={currentFilter === 'all' ? 'active' : ''}
        onClick={() => onFilterChange('all')}
      >
        Всі
      </button>
      <button
        type="button"
        className={currentFilter === 'completed' ? 'active' : ''}
        onClick={() => onFilterChange('completed')}
      >
        Виконані
      </button>
      <button
        type="button"
        className={currentFilter === 'uncompleted' ? 'active' : ''}
        onClick={() => onFilterChange('uncompleted')}
      >
        Не виконані
      </button>
    </div>
  );
}

export default TaskFilters;
