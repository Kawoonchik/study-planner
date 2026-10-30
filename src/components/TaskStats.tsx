import type { Task } from '../types/task';

interface TaskStatsProps {
  tasks: Task[];
}

function TaskStats({ tasks }: TaskStatsProps) {
  const total = tasks.length;
  const completed = tasks.filter((task) => task.completed).length;
  const uncompleted = total - completed;

  return (
    <div className="taskstats">
      <h2>TaskStats</h2>
      <p>Загальна кількість: {total}</p>
      <p>Виконано: {completed}</p>
      <p>Не виконано: {uncompleted}</p>
    </div>
  );
}

export default TaskStats;
