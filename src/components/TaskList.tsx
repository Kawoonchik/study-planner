import type { Task } from '../types/task';
import TaskItem from './TaskItem';

interface TaskListProps {
  filteredTasks: Task[];
  totalCount: number;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskList({
  filteredTasks,
  totalCount,
  onToggle,
  onDelete,
}: TaskListProps) {
  if (totalCount === 0) {
    return (
      <p className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100 border-dashed">
        Завдань поки немає. Додайте перше навчальне завдання.
      </p>
    );
  }

  if (filteredTasks.length === 0) {
    return (
      <p className="text-center text-gray-500 py-12 bg-white rounded-xl border border-gray-100 border-dashed">
        За цим фільтром завдань немає.
      </p>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}

export default TaskList;
