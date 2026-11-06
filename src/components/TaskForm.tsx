import { useState } from 'react';
import type * as React from 'react';
import type { Priority, Task } from '../types/task';
import { useTaskContext } from '../hooks/useTaskContext';

interface TaskFormProps {
  taskToEdit?: Task;
  onClose?: () => void;
}

function TaskForm({ taskToEdit, onClose }: TaskFormProps) {
  const { addTask, updateTask, toast } = useTaskContext();
  const [title, setTitle] = useState(taskToEdit?.title ?? '');
  const [description, setDescription] = useState(taskToEdit?.description ?? '');
  const [category, setCategory] = useState(taskToEdit?.category ?? '');
  const [priority, setPriority] = useState<Priority>(taskToEdit?.priority ?? 'medium');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim() === '') {
      return;
    }

    if (taskToEdit) {
      updateTask({ ...taskToEdit, title: title.trim(), description, category, priority });
      toast('Завдання успішно оновлено');
    } else {
      addTask({
        title: title.trim(),
        description,
        category,
        priority,
        completed: false,
      });
      toast('Завдання успішно додано');

      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
    }

    onClose?.();
  }

  return (
    <form
      className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8 flex flex-col gap-4"
      onSubmit={handleSubmit}
    >
      <input
        className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Назва завдання"
        required
      />
      <textarea
        className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Опис"
      />
      <input
        className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        type="text"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        placeholder="Категорія"
      />
      <select
        className="border border-gray-300 rounded-lg p-3 text-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
        value={priority}
        onChange={(e) => setPriority(e.target.value as Priority)}
      >
        <option value="low">low</option>
        <option value="medium">medium</option>
        <option value="high">high</option>
      </select>
      <div className="flex gap-2">
        <button
          className="flex-1 bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
          type="submit"
        >
          {taskToEdit ? 'Зберегти' : 'Додати'}
        </button>
        {onClose && (
          <button
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
            type="button"
            onClick={onClose}
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
