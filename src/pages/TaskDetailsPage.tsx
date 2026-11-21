import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router';
import { taskRepository } from '../repositories/taskRepository';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';
import TaskFormDialog from '../components/TaskFormDialog';
import type { Task } from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';

export default function TaskDetailsPage() {
  const { taskId } = useParams<{ taskId: string }>();
  const { isAuthenticated } = useAuth();
  const { toast } = useTaskContext();
  const navigate = useNavigate();

  const numericId = Number(taskId);
  const isInvalidId = !taskId || Number.isNaN(numericId) || numericId <= 0;

  const [fetchState, setFetchState] = useState<{
    id: number | null;
    task: Task | null;
    error: string | null;
  }>({
    id: null,
    task: null,
    error: null,
  });

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const isLoading = !isInvalidId && fetchState.id !== numericId;
  const error = isInvalidId
    ? 'Некоректний ідентифікатор завдання'
    : fetchState.id === numericId
      ? fetchState.error
      : null;
  const task = !isInvalidId && fetchState.id === numericId ? fetchState.task : null;

  useEffect(() => {
    if (isInvalidId) return;

    const controller = new AbortController();

    taskRepository
      .getById(numericId, controller.signal)
      .then((data) => {
        setFetchState({ id: numericId, task: data, error: null });
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        setFetchState({
          id: numericId,
          task: null,
          error: err instanceof Error ? err.message : 'Не вдалося завантажити деталі завдання',
        });
      });

    return () => controller.abort();
  }, [isInvalidId, numericId]);

  const handleEditClick = () => {
    if (!isAuthenticated) {
      toast('Увійдіть у систему, щоб редагувати завдання');
      navigate('/login');
      return;
    }
    setIsEditOpen(true);
  };

  const handleUpdateTask = async (data: TaskFormData) => {
    if (!task) return;

    if (!isAuthenticated) {
      toast('Увійдіть у систему, щоб редагувати завдання');
      navigate('/login');
      return;
    }

    const updated = await taskRepository.update(task.id, data);
    setFetchState((prev) => ({
      ...prev,
      task: prev.task
        ? {
            ...prev.task,
            ...updated,
            createdBy: prev.task.createdBy,
            createdAt: prev.task.createdAt,
          }
        : updated,
    }));
    toast('Завдання успішно оновлено');
  };

  const handleDeleteClick = async () => {
    if (!task) return;

    if (!isAuthenticated) {
      toast('Увійдіть у систему, щоб видалити завдання');
      navigate('/login');
      return;
    }

    setIsDeleting(true);
    try {
      await taskRepository.delete(task.id);
      toast('Завдання успішно видалено');
      navigate('/tasks');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Помилка при видаленні завдання');
      setIsDeleting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link
          to="/tasks"
          className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition"
        >
          <span>←</span>
          <span>Назад до списку завдань</span>
        </Link>
      </div>

      {isLoading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500">
          Завантаження деталей завдання...
        </div>
      ) : error || !task ? (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-700 text-sm">
          {error || 'Завдання не знайдено'}
        </div>
      ) : (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-gray-200 shadow-sm space-y-6">
          <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-5">
            <div className="space-y-1">
              <span className="text-xs font-medium text-gray-400">Завдання #{task.id}</span>
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
            </div>

            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                task.completed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {task.completed ? 'Виконано' : 'Не виконано'}
            </span>
          </div>

          <div>
            <h2 className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
              Опис
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              {task.description || 'Опис для цього завдання відсутній.'}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <p className="text-xs text-gray-400">Категорія</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{task.category}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Пріоритет</p>
              <p className="text-sm font-medium text-gray-900 capitalize mt-0.5">
                {task.priority}
              </p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Створив (client metadata)</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{task.createdBy}</p>
            </div>

            <div>
              <p className="text-xs text-gray-400">Дата створення (client metadata)</p>
              <p className="text-sm font-medium text-gray-900 mt-0.5">{task.createdAt}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-gray-100">
            <button
              onClick={handleEditClick}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition cursor-pointer"
            >
              Редагувати
            </button>

            <button
              onClick={handleDeleteClick}
              disabled={isDeleting}
              className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 disabled:opacity-50 text-sm font-medium rounded-xl transition cursor-pointer"
            >
              {isDeleting ? 'Видалення...' : 'Видалити'}
            </button>
          </div>
        </div>
      )}

      <TaskFormDialog
        open={isEditOpen}
        mode="edit"
        task={task ?? undefined}
        onClose={() => setIsEditOpen(false)}
        onSubmit={handleUpdateTask}
      />
    </div>
  );
}