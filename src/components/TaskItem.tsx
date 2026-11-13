import { useState } from 'react';
import { taskRepository } from '../repositories/taskRepository';
import { useTaskContext } from '../hooks/useTaskContext';
import type { Task } from '../types/task';
import TaskForm from './TaskForm'; // Залежить від того, як ти експортував TaskForm (якщо default, то без {})
import TaskDetailsModal from './TaskDetailsModal';

interface TaskItemProps {
  task: Task;
  onUpdate: (task: Task) => void;
  onDelete: (id: number) => void;
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const { toast } = useTaskContext();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false); // Власний UI для підтвердження видалення[cite: 15]
  const [isProcessing, setIsProcessing] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Додаткове завдання 2: Optimistic update для зміни completed[cite: 15]
  const handleToggle = async () => {
    const updatedTask = { ...task, completed: !task.completed };
    
    // 1. ОПТИМІСТИЧНЕ ОНОВЛЕННЯ: Одразу показуємо результат у UI, не чекаючи сервера
    onUpdate(updatedTask); 
    
    try {
      // 2. Робимо запит на сервер
      await taskRepository.update(task.id, { completed: updatedTask.completed });
    } catch (error) {
      // 3. ВІДКОЧЕННЯ: Якщо сталася помилка, повертаємо старе значення і показуємо помилку
      onUpdate(task); 
      toast('Помилка сервера. Зміни скасовано.');
    }
  };

  const handleDelete = async () => {
    setIsProcessing(true);
    try {
      const success = await taskRepository.delete(task.id);
      if (success) {
        onDelete(task.id); // Видаляємо з локального списку[cite: 11]
        toast('Завдання успішно видалено');
      }
    } catch (error) {
      toast('Помилка при видаленні');
      setIsProcessing(false);
      setShowConfirm(false);
    }
  };

  // Режим редагування (викличемо TaskForm)
  if (isEditing) {
    return (
      <div className="w-full bg-white p-2 rounded-xl border border-blue-200 shadow-sm">
        <TaskForm 
          taskToEdit={task} 
          onClose={() => setIsEditing(false)} 
          onSave={(updatedTask: Task) => { // Додамо цей проп у TaskForm на наступному кроці
            onUpdate(updatedTask);
            setIsEditing(false);
          }}
        />
      </div>
    );
  }

  // Режим підтвердження видалення (замість забороненого alert/confirm)[cite: 9, 15]
  if (showConfirm) {
    return (
      <li className="flex justify-between items-center p-4 border rounded-xl bg-red-50 border-red-200">
        <span className="text-red-700 font-medium">Видалити завдання "{task.title}"?</span>
        <div className="flex gap-2">
           <button 
             onClick={handleDelete} 
             disabled={isProcessing} 
             className="bg-red-600 text-white px-4 py-1.5 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
           >
             Так, видалити
           </button>
           <button 
             onClick={() => setShowConfirm(false)} 
             disabled={isProcessing} 
             className="bg-white border border-gray-300 text-gray-700 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-50"
           >
             Скасувати
           </button>
        </div>
      </li>
    );
  }

  // Звичайний режим перегляду
  return (
    <li className={`flex justify-between items-center p-4 border rounded-xl transition-all duration-300 ${task.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-blue-300 shadow-sm hover:shadow'}`}>
      <div className="flex items-center gap-4">
        <input 
          type="checkbox" 
          checked={task.completed} 
          onChange={handleToggle}
          className="w-5 h-5 cursor-pointer accent-blue-600 transition-transform hover:scale-110"
        />
        <div className="flex flex-col">
          <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
            {task.title}
          </h3>
          <span className="text-xs text-gray-500 mt-1">
            <span className="bg-gray-100 px-2 py-0.5 rounded-full mr-2">{task.category}</span>
            <span className={task.priority === 'high' ? 'text-red-500' : task.priority === 'medium' ? 'text-orange-500' : 'text-green-500'}>
              {task.priority === 'high' ? '↑ Високий' : task.priority === 'medium' ? '— Середній' : '↓ Низький'}
            </span>
          </span>
        </div>
      </div>
      <div className="flex gap-2">
        {/* НОВА КНОПКА ДЕТАЛІВ */}
        <button 
          onClick={() => setShowDetailsModal(true)}
          className="text-gray-600 hover:bg-gray-100 px-3 py-1.5 rounded-lg text-sm font-medium transition"
        >
          Деталі
        </button>
        
        <button 
          onClick={() => setIsEditing(true)}
          className="text-blue-600 hover:bg-blue-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
        >
          Редагувати
        </button>
        <button 
          onClick={() => setShowConfirm(true)}
          className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded-lg text-sm font-medium transition"
        >
          Видалити
        </button>
      </div>

      {/* НОВИЙ ВИВІД МОДАЛЬНОГО ВІКНА */}
      {showDetailsModal && (
        <TaskDetailsModal 
          taskId={task.id} 
          onClose={() => setShowDetailsModal(false)} 
        />
      )}
    </li>
  );
}