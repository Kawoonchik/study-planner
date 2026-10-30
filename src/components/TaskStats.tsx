interface TaskStatsProps {
  label?: string;
}

function TaskStats({ label = 'TaskStats' }: TaskStatsProps) {
  return (
    <div className="taskstats" aria-label={label}>
      <h2>TaskStats</h2>
    </div>
  );
}

export default TaskStats;
