import { useTaskContext } from '../hooks/useTaskContext';

export default function Toast() {
  const { toastMessage } = useTaskContext();

  // Якщо повідомлення немає, компонент нічого не рендерить
  if (!toastMessage) return null;

  return (
    <div className="fixed bottom-5 right-5 bg-gray-800 text-white px-6 py-4 rounded-xl shadow-2xl z-50 flex items-center gap-3 transition-opacity duration-300">
      <span className="text-xl">ℹ️</span>
      <p className="font-medium">{toastMessage}</p>
    </div>
  );
}