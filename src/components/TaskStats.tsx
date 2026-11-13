import type { Task } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex justify-between items-center">
      <div className="flex gap-4">
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Всього</span>
          <span className="font-bold text-lg">{total}</span>
        </div>
        <div className="flex flex-col">
          <span className="text-sm text-gray-500">Виконано</span>
          <span className="font-bold text-lg text-green-600">{completed}</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium text-gray-700">{percent}%</span>
        <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  );
}