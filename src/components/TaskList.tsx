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
      <p className="empty-message">
        Завдань поки немає. Додайте перше навчальне завдання.
      </p>
    );
  }

  if (filteredTasks.length === 0) {
    return <p className="empty-message">За цим фільтром завдань немає.</p>;
  }

  return (
    <div className="tasklist">
      <h2>TaskList</h2>
      {filteredTasks.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}

export default TaskList;
