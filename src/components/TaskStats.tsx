import { useEffect } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';

function TaskStats() {
  const { tasks } = useTaskContext();
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const incomplete = total - completed;

  useEffect(() => {
    document.title = 'Study Planner - ' + incomplete + ' active tasks';
  }, [incomplete]);

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
        <p className="text-2xl font-bold text-blue-900">{incomplete}</p>
      </div>
    </div>
  );
}

export default TaskStats;
