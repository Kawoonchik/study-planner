import { useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';

export default function ProfilePage() {
  const { user, isAuthenticated, logout } = useAuth();
  const { toast } = useTaskContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast('Ви вийшли з облікового запису');
    navigate('/login', { replace: true });
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-lg mx-auto mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Профіль користувача</h1>
        <span className="px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700">
          {isAuthenticated ? 'Авторизовано' : 'Гість'}
        </span>
      </div>

      <div className="space-y-4 border-t border-b border-gray-100 py-5 mb-6">
        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">Ім&apos;я та прізвище</p>
          <p className="text-base font-medium text-gray-900">
            {user.firstName} {user.lastName}
          </p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">Username</p>
          <p className="text-base font-medium text-gray-900">@{user.username}</p>
        </div>

        <div>
          <p className="text-xs uppercase tracking-wider text-gray-400">Email</p>
          <p className="text-base font-medium text-gray-900">{user.email}</p>
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition cursor-pointer"
      >
        Вийти (Logout)
      </button>
    </div>
  );
}