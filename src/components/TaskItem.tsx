import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
}

function TaskItem({ task }: TaskItemProps) {
  return (
    <div className="taskitem">
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <p>Category: {task.category}</p>
      <p>Priority: {task.priority}</p>
      <p>Status: {task.completed ? 'Completed' : 'Incomplete'}</p>
    </div>
  );
}

export default TaskItem;
