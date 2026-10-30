import type { Task } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const uncompleted = total - completed;

  return (
    <div className="grid grid-cols-3 gap-4 text-center mb-8">
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-600 font-medium">Загальна кількість</p>
        <p className="text-2xl font-bold text-blue-900">{total}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-600 font-medium">Виконано</p>
        <p className="text-2xl font-bold text-blue-900">{completed}</p>
      </div>
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <p className="text-sm text-blue-600 font-medium">Не виконано</p>
        <p className="text-2xl font-bold text-blue-900">{uncompleted}</p>
      </div>
    </div>
  );
}

export default TaskStats;
