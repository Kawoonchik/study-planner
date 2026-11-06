import { useTaskContext } from '../hooks/useTaskContext';
import TaskItem from './TaskItem';

function TaskList() {
  const { tasks, filter } = useTaskContext();
  const filteredTasks =
    filter === 'completed'
      ? tasks.filter((task) => task.completed)
      : filter === 'incomplete'
        ? tasks.filter((task) => !task.completed)
        : tasks;

  if (tasks.length === 0) {
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
        />
      ))}
    </ul>
  );
}

export default TaskList;
