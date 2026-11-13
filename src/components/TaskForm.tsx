import { useState, type FormEvent } from 'react';
import { useTaskContext } from '../hooks/useTaskContext';
import { taskRepository } from '../repositories/taskRepository';
import type { Task, Priority } from '../types/task';

// Оновлені пропси: тепер форма знає про onSave
interface TaskFormProps {
  taskToEdit?: Task;
  onClose?: () => void;
  onSave?: (task: Task) => void;
}

export default function TaskForm({ taskToEdit, onClose, onSave }: TaskFormProps) {
  const { toast } = useTaskContext();
  
  // Локальний стейт форми
  const [title, setTitle] = useState(taskToEdit?.title || '');
  const [description, setDescription] = useState(taskToEdit?.description || '');
  const [priority, setPriority] = useState<Priority>(taskToEdit?.priority || 'medium');
  const [category, setCategory] = useState(taskToEdit?.category || 'General');
  
  // Стейт для блокування кнопок під час запиту
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    try {
      if (taskToEdit) {
        // 1. Оновлення існуючого завдання (PATCH)
        const updated = await taskRepository.update(taskToEdit.id, { 
          title, 
          completed: taskToEdit.completed 
        });
        
        // DummyJSON не повертає наші кастомні поля, тому ми їх "домішуємо" назад
        const finalTask = { ...taskToEdit, ...updated, description, priority, category };
        
        toast('Завдання успішно оновлено');
        if (onSave) onSave(finalTask);
        if (onClose) onClose();
      } else {
        // 2. Створення нового завдання (POST)
        const created = await taskRepository.create({
          title,
          description,
          priority,
          category,
          completed: false
        });
        
        toast('Завдання успішно додано');
        if (onSave) onSave(created); // Передаємо створене завдання нагору
        
        // Очищаємо форму після створення
        setTitle('');
        setDescription('');
        setPriority('medium');
        setCategory('General');
      }
    } catch (error) {
      toast(taskToEdit ? 'Помилка при оновленні' : 'Помилка при створенні');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 p-5 bg-white border border-gray-200 rounded-xl shadow-sm mb-6">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Назва завдання</label>
        <input 
          type="text" 
          value={title} 
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Що потрібно зробити?"
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
          disabled={isSubmitting}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-gray-700">Опис (необов'язково)</label>
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Деталі завдання..."
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none h-20"
          disabled={isSubmitting}
        />
      </div>

      <div className="flex gap-4">
        <div className="flex flex-col gap-1 w-1/2">
          <label className="text-sm font-medium text-gray-700">Пріоритет</label>
          <select 
            value={priority} 
            onChange={(e) => setPriority(e.target.value as Priority)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            disabled={isSubmitting}
          >
            <option value="low">Низький</option>
            <option value="medium">Середній</option>
            <option value="high">Високий</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 w-1/2">
          <label className="text-sm font-medium text-gray-700">Категорія</label>
          <input 
            type="text" 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            placeholder="Наприклад: Навчання"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isSubmitting}
          />
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <button 
          type="submit" 
          disabled={isSubmitting || !title.trim()}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? 'Завантаження...' : (taskToEdit ? 'Зберегти зміни' : 'Додати завдання')}
        </button>
        {onClose && (
          <button 
            type="button" 
            onClick={onClose}
            disabled={isSubmitting}
            className="px-6 py-2 bg-white text-gray-700 font-medium rounded-lg border border-gray-300 hover:bg-gray-50 transition disabled:opacity-50"
          >
            Скасувати
          </button>
        )}
      </div>
    </form>
  );
}