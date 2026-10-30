import type { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  return (
    <li
      className={`p-5 border rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition duration-200 ${
        task.completed
          ? 'bg-emerald-50 border-emerald-200'
          : 'bg-white border-gray-200 hover:border-blue-300'
      }`}
    >
      <div className="flex-1">
        <label className="flex items-center gap-3">
          <input
            className="w-5 h-5 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
            type="checkbox"
            checked={task.completed}
            onChange={() => onToggle(task.id)}
          />
          <span
            className={
              task.completed
                ? 'line-through text-gray-400'
                : 'text-gray-800 font-semibold'
            }
          >
            {task.title}
          </span>
        </label>
        {task.description && (
          <p className="text-gray-600 mt-2">{task.description}</p>
        )}
        <div>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600 inline-block mt-2 mr-2">
            Category: {task.category}
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600 inline-block mt-2 mr-2">
            Priority: {task.priority}
          </span>
          <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600 inline-block mt-2 mr-2">
            Status: {task.completed ? 'Completed' : 'Incomplete'}
          </span>
        </div>
      </div>
      <button
        className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200 text-sm font-medium transition"
        type="button"
        onClick={() => onDelete(task.id)}
      >
        Видалити
      </button>
    </li>
  );
}

export default TaskItem;
