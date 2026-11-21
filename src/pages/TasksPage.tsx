import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router';
import { taskRepository } from '../repositories/taskRepository';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';
import TaskFormDialog from '../components/TaskFormDialog';
import type { Task, TaskPriority } from '../types/task';
import type { TaskFormData } from '../schemas/taskSchema';

type StatusFilter = 'all' | 'completed' | 'incomplete';
type PriorityFilter = 'all' | TaskPriority;

const PAGE_LIMIT = 10;

export default function TasksPage() {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useTaskContext();
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const statusFilter = (searchParams.get('status') as StatusFilter) || 'all';
  const priorityFilter = (searchParams.get('priority') as PriorityFilter) || 'all';

  const [tasks, setTasks] = useState<Task[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);

  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchInput]);


  useEffect(() => {
    const controller = new AbortController();
    setIsLoading(true);
    setError(null);

    taskRepository
      .getAll({
        limit: PAGE_LIMIT,
        skip: (page - 1) * PAGE_LIMIT,
        search: debouncedSearch,
        signal: controller.signal,
      })
      .then((data) => {
        setTasks(data.tasks);
        setTotal(data.total);
      })
      .catch((err) => {
        if (err.name === 'CanceledError' || err.name === 'AbortError') return;
        setError(err instanceof Error ? err.message : 'Не вдалося завантажити завдання');
      })
      .finally(() => {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      });

    return () => controller.abort();
  }, [page, debouncedSearch]);


  const updateQueryParam = (key: 'status' | 'priority', value: string) => {
    const nextParams = new URLSearchParams(searchParams);
    if (value === 'all') {
      nextParams.delete(key);
    } else {
      nextParams.set(key, value);
    }
    setSearchParams(nextParams);
  };


  const handleOpenCreate = () => {
    if (!isAuthenticated) {
      toast('Увійдіть у систему, щоб створити завдання');
      navigate('/login');
      return;
    }
    setIsCreateOpen(true);
  };


  const handleCreateTask = async (data: TaskFormData) => {
    if (!isAuthenticated) {
      toast('Увійдіть у систему, щоб створити завдання');
      navigate('/login');
      return;
    }

    const created = await taskRepository.create({
      ...data,
      completed: false,
      createdBy: user?.username || 'User',
    });


    setTasks((prev) => {
      const uniqueTask = prev.some((item) => item.id === created.id)
        ? { ...created, id: Date.now() }
        : created;
      return [uniqueTask, ...prev];
    });
    setTotal((prev) => prev + 1);
    toast('Завдання успішно створено');
  };


  const handleToggleTask = async (task: Task) => {
    if (!isAuthenticated) {
      toast('Авторизуйтесь, щоб змінювати статус завдання');
      navigate('/login');
      return;
    }

    try {
      const updated = await taskRepository.update(task.id, {
        completed: !task.completed,
      });
      setTasks((prev) =>
        prev.map((item) => (item.id === task.id ? { ...item, completed: updated.completed } : item))
      );
      toast('Статус завдання оновлено');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Помилка оновлення');
    }
  };


  const handleDeleteTask = async (id: number) => {
    if (!isAuthenticated) {
      toast('Авторизуйтесь, щоб видаляти завдання');
      navigate('/login');
      return;
    }

    try {
      await taskRepository.delete(id);
      setTasks((prev) => prev.filter((item) => item.id !== id));
      toast('Завдання видалено');
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Помилка видалення');
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'completed' && task.completed) ||
      (statusFilter === 'incomplete' && !task.completed);

    const matchesPriority =
      priorityFilter === 'all' || task.priority === priorityFilter;

    return matchesStatus && matchesPriority;
  });

  const totalPages = Math.max(1, Math.ceil(total / PAGE_LIMIT));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Завдання</h1>
          <p className="text-sm text-gray-500">
            Усього в базі: {total} • Показано: {filteredTasks.length}
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          title={isAuthenticated ? 'Створити завдання' : 'Потрібна авторизація'}
          className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition flex items-center gap-2 cursor-pointer"
        >
          <span className="text-lg leading-none">+</span>
          <span>Нове завдання</span>
        </button>
      </div>

      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex flex-wrap items-center gap-4">
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Пошук за назвою..."
          className="flex-1 min-w-[200px] px-4 py-2 border border-gray-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="flex items-center gap-2">
          <label htmlFor="status-filter" className="text-sm text-gray-600">
            Статус:
          </label>
          <select
            id="status-filter"
            value={statusFilter}
            onChange={(e) => updateQueryParam('status', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Усі</option>
            <option value="completed">Виконані</option>
            <option value="incomplete">Невиконані</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="priority-filter" className="text-sm text-gray-600">
            Пріоритет:
          </label>
          <select
            id="priority-filter"
            value={priorityFilter}
            onChange={(e) => updateQueryParam('priority', e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">Усі</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>


      {isLoading ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500">
          Завантаження завдань...
        </div>
      ) : error ? (
        <div className="bg-red-50 p-6 rounded-2xl border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-gray-200 text-center text-gray-500">
          За обраними фільтрами завдань не знайдено.
        </div>
      ) : (
        <ul className="space-y-3">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleTask(task)}
                  className="w-5 h-5 rounded border-gray-300 text-blue-600 cursor-pointer"
                />

                <div className="min-w-0">
                  <Link
                    to={`/tasks/${task.id}`}
                    className={`block font-medium truncate hover:text-blue-600 transition ${
                      task.completed ? 'line-through text-gray-400' : 'text-gray-900'
                    }`}
                  >
                    {task.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
                    <span className="px-2 py-0.5 rounded-md bg-gray-100 text-gray-700">
                      {task.category}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 capitalize">
                      {task.priority}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Link
                  to={`/tasks/${task.id}`}
                  className="px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition"
                >
                  Деталі
                </Link>

                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-xl transition cursor-pointer"
                >
                  Видалити
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {!isLoading && !error && totalPages > 1 && (
        <div className="flex items-center justify-center gap-3 pt-2">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-xl disabled:opacity-40 cursor-pointer"
          >
            Назад
          </button>
          <span className="text-sm text-gray-600">
            Сторінка {page} з {totalPages}
          </span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-4 py-2 text-sm font-medium bg-white border border-gray-300 rounded-xl disabled:opacity-40 cursor-pointer"
          >
            Вперед
          </button>
        </div>
      )}

      <TaskFormDialog
        open={isCreateOpen}
        mode="create"
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateTask}
      />
    </div>
  );
}