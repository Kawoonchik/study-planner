interface TaskFormProps {
  label?: string;
}

function TaskForm({ label = 'TaskForm' }: TaskFormProps) {
  return (
    <div className="taskform" aria-label={label}>
      <h2>TaskForm</h2>
    </div>
  );
}

export default TaskForm;
