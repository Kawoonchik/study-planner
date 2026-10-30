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
    <div className="taskform">
      <h2>TaskForm</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Назва завдання"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Опис"
        />
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          placeholder="Категорія"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as Priority)}
        >
          <option value="low">low</option>
          <option value="medium">medium</option>
          <option value="high">high</option>
        </select>
        <button type="submit">Додати</button>
      </form>
    </div>
  );
}

export default TaskForm;
