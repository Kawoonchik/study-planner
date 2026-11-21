import { Link } from 'react-router';

export default function NotFoundPage() {
  return (
    <div className="max-w-md mx-auto mt-16 bg-white p-8 rounded-2xl shadow-sm border border-gray-200 text-center space-y-4">
      <p className="text-5xl font-extrabold text-blue-600">404</p>
      <h1 className="text-2xl font-bold text-gray-900">Сторінку не знайдено</h1>
      <p className="text-sm text-gray-500">
        Схоже, ви перейшли за неіснуючою адресою або сторінку було переміщено.
      </p>
      <div className="pt-2">
        <Link
          to="/tasks"
          className="inline-block px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl transition"
        >
          Повернутися до завдань
        </Link>
      </div>
    </div>
  );
}