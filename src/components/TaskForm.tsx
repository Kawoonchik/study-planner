import { useState } from 'react';
import type * as React from 'react';
import type { Priority, Task } from '../types/task';

interface TaskFormProps {
  onAdd: (task: Omit<Task, 'id'>) => void;
}

function TaskForm({ onAdd }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (title.trim() === '') {
      return;
    }

    onAdd({
      title: title.trim(),
      description,
      category,
      priority,
      completed: false,
    });

    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
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
      <button
        className="bg-blue-600 text-white font-medium py-3 rounded-lg hover:bg-blue-700 transition"
        type="submit"
      >
        Додати
      </button>
    </form>
  );
}

export default TaskForm;
