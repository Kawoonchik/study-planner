interface TaskListProps {
  label?: string;
}

function TaskList({ label = 'TaskList' }: TaskListProps) {
  return (
    <div className="tasklist" aria-label={label}>
      <h2>TaskList</h2>
    </div>
  );
}

export default TaskList;
