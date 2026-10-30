interface TaskItemProps {
  label?: string;
}

function TaskItem({ label = 'TaskItem' }: TaskItemProps) {
  return (
    <div className="taskitem" aria-label={label}>
      <h2>TaskItem</h2>
    </div>
  );
}

export default TaskItem;
