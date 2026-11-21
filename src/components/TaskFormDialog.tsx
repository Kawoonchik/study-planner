import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { taskSchema, type TaskFormData } from '../schemas/taskSchema';
import type { Task } from '../types/task';

export type TaskFormDialogProps = {
  open: boolean;
  mode: 'create' | 'edit';
  task?: Task;
  onClose: () => void;
  onSubmit: (data: TaskFormData) => Promise<void>;
};

export default function TaskFormDialog({
  open,
  mode,
  task,
  onClose,
  onSubmit,
}: TaskFormDialogProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors, isSubmitting },
  } = useForm<TaskFormData>({
    resolver: zodResolver(taskSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'General',
      priority: 'medium',
    },
  });


  useEffect(() => {
    if (!open) return;

    setSubmitError(null);
    if (mode === 'edit' && task) {
      reset({
        title: task.title,
        description: task.description,
        category: task.category,
        priority: task.priority,
      });
    } else {
      reset({
        title: '',
        description: '',
        category: 'General',
        priority: 'medium',
      });
    }

    const frame = requestAnimationFrame(() => {
      setFocus('title');
    });
    return () => cancelAnimationFrame(frame);
  }, [open, mode, task, reset, setFocus]);


  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isSubmitting, onClose]);

  if (!open) {
    return null;
  }

  const handleFormSubmit = async (data: TaskFormData) => {
    setSubmitError(null);
    try {
      await onSubmit(data);
      onClose();
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : 'Не вдалося зберегти завдання'
      );
    }
  };

  const isEditMode = mode === 'edit';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={() => !isSubmitting && onClose()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="task-dialog-title"
    >
      <div
        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl border border-gray-200 space-y-5"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-3">
          <h2 id="task-dialog-title" className="text-xl font-bold text-gray-900">
            {isEditMode ? 'Редагувати завдання' : 'Нове завдання'}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Закрити вікно"
            className="text-gray-400 hover:text-gray-700 text-xl leading-none px-2 py-1 rounded-lg transition cursor-pointer disabled:opacity-40"
          >
            ×
          </button>
        </div>

        {submitError && (
          <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
          <div>
            <label htmlFor="task-title" className="block text-sm font-medium text-gray-700 mb-1">
              Назва завдання
            </label>
            <input
              id="task-title"
              type="text"
              placeholder="Наприклад: Підготуватися до захисту лабораторної"
              {...register('title')}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                errors.title
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="task-description" className="block text-sm font-medium text-gray-700 mb-1">
              Опис
            </label>
            <textarea
              id="task-description"
              rows={3}
              placeholder="Деталі або нотатки до завдання..."
              {...register('description')}
              className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                errors.description
                  ? 'border-red-400 focus:ring-red-400'
                  : 'border-gray-300 focus:ring-blue-500'
              }`}
            />
            {errors.description && (
              <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-category" className="block text-sm font-medium text-gray-700 mb-1">
                Категорія
              </label>
              <input
                id="task-category"
                type="text"
                placeholder="Навчання, Робота, Особисте"
                {...register('category')}
                className={`w-full px-4 py-2.5 border rounded-xl text-sm focus:outline-none focus:ring-2 transition ${
                  errors.category
                    ? 'border-red-400 focus:ring-red-400'
                    : 'border-gray-300 focus:ring-blue-500'
                }`}
              />
              {errors.category && (
                <p className="mt-1 text-xs text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="task-priority" className="block text-sm font-medium text-gray-700 mb-1">
                Пріоритет
              </label>
              <select
                id="task-priority"
                {...register('priority')}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-xs text-red-600">{errors.priority.message}</p>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 rounded-xl transition cursor-pointer"
            >
              Скасувати
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 rounded-xl transition cursor-pointer"
            >
              {isSubmitting
                ? 'Збереження...'
                : isEditMode
                  ? 'Зберегти зміни'
                  : 'Створити'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}