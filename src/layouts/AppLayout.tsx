import { NavLink, Outlet, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';

export default function AppLayout() {
  const { isAuthenticated, user, logout } = useAuth();
  const { toastMessage, toast } = useTaskContext();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast('Ви вийшли з облікового запису');
    navigate('/login', { replace: true });
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `px-3 py-2 rounded-xl text-sm font-medium transition ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
    }`;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <NavLink to="/tasks" className="text-xl font-bold text-gray-900 tracking-tight">
            Study Planner
          </NavLink>

          <nav className="flex items-center gap-2">
            <NavLink to="/tasks" className={navLinkClass}>
              Tasks
            </NavLink>

            <NavLink to="/profile" className={navLinkClass}>
              Profile
            </NavLink>

            {isAuthenticated ? (
              <div className="flex items-center gap-3 ml-2 pl-3 border-l border-gray-200">
                <span className="text-sm text-gray-500 hidden sm:inline">
                  @{user?.username}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <NavLink to="/login" className={navLinkClass}>
                Login
              </NavLink>
            )}
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        <Outlet />
      </main>

      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-gray-900 text-white px-4 py-3 rounded-xl shadow-lg text-sm">
          {toastMessage}
        </div>
      )}
    </div>
  );
}