import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <div className={`taskitem${task.completed ? ' completed-task' : ''}`}>
      <label>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
        />
        {task.title}
      </label>
      <p>{task.description}</p>
      <p>Category: {task.category}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.completed ? 'Completed' : 'Incomplete'}</p>
      <button type="button" onClick={() => onDelete(task.id)}>
        Видалити
      </button>
    </div>
  );
}

export default TaskItem;
