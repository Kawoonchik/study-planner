interface TaskFiltersProps {
  label?: string;
}

function TaskFilters({ label = 'TaskFilters' }: TaskFiltersProps) {
  return (
    <div className="taskfilters" aria-label={label}>
      <h2>TaskFilters</h2>
    </div>
  );
}

export default TaskFilters;
