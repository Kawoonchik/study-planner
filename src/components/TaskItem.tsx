import { useEffect, useState } from 'react';
import type { Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';
import TaskForm from './TaskForm';

interface TaskItemProps {
  task: Task;
  // Ми більше не передаємо callback-функції через props, 
  // бо тепер беремо їх напряму з контексту!
}

export default function TaskItem({ task }: TaskItemProps) {
  const { toggleTask, requestDelete, confirmDelete, undoDelete, toast } = useTaskContext();
  const [timeLeft, setTimeLeft] = useState(5);
  const [isEditing, setIsEditing] = useState(false);

  // Побічний ефект для таймера Undoable Delete
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    let intervalId: ReturnType<typeof setInterval>;

    if (task.isDeleting) {
      setTimeLeft(5); // Скидаємо лічильник на 5
      toast('Завдання буде видалено...'); // Показуємо Toast[cite: 17]

      // Інтервал для візуального відліку секунд в інтерфейсі
      intervalId = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);

      // Основний таймер на 5 секунд, після якого відбувається остаточне видалення[cite: 17]
      timerId = setTimeout(() => {
        confirmDelete(task.id);
        toast('Завдання видалено остаточно');
      }, 5000);
    }

    // Cleanup-функція: викликається при розмонтуванні або перед наступним запуском ефекту
    return () => {
      clearTimeout(timerId);
      clearInterval(intervalId);
    };
  }, [task.isDeleting, task.id, confirmDelete, toast]);

  if (isEditing) {
    return (
      <div className="w-full bg-white p-2 rounded-xl border border-blue-200 shadow-sm">
        <TaskForm taskToEdit={task} onClose={() => setIsEditing(false)} />
      </div>
    );
  }

  // Умовний рендеринг: якщо завдання очікує видалення, показуємо інший UI[cite: 17, 18]
  if (task.isDeleting) {
    return (
      <li className="p-5 border rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 bg-red-50 border-red-200 transition duration-200">
        <div className="text-red-600 font-medium">
          Завдання буде видалено через {timeLeft} сек...
        </div>
        <button
          onClick={() => {
            undoDelete(task.id);
            toast('Видалення скасовано'); // Toast після скасування[cite: 17]
          }}
          className="text-gray-700 bg-white hover:bg-gray-100 px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium transition shadow-sm"
        >
          Скасувати (Undo)
        </button>
      </li>
    );
  }

  // Звичайний рендеринг завдання (перероблений під Tailwind з минулої лаби)
  return (
    <li className={`p-5 border rounded-xl shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition duration-200 ${
      task.completed ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200 hover:border-blue-300'
    }`}>
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => toggleTask(task.id)}
          className="w-5 h-5 mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
        />
        <div>
          <h3 className={`text-lg ${task.completed ? 'line-through text-gray-400' : 'text-gray-800 font-semibold'}`}>
            {task.title}
          </h3>
          <p className="text-gray-500 text-sm mt-1">{task.description}</p>
          <div className="mt-2">
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600 inline-block mr-2">
              Category: {task.category}
            </span>
            <span className="text-xs font-medium px-2 py-1 rounded-md bg-gray-100 text-gray-600 inline-block mr-2">
              Priority: {task.priority}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-2">
        <button
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:bg-blue-50 px-4 py-2 rounded-lg border border-blue-200 text-sm font-medium transition"
        >
          Редагувати
        </button>
        <button
          onClick={() => requestDelete(task.id)}
          className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg border border-red-200 text-sm font-medium transition"
        >
          Видалити
        </button>
      </div>
    </li>
  );
}