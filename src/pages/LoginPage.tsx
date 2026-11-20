import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate, Navigate } from 'react-router';
import { loginSchema, type LoginFormData } from '../schemas/authSchema';
import { useAuth } from '../hooks/useAuth';
import { useTaskContext } from '../hooks/useTaskContext';

export default function LoginPage() {
  const { login, isAuthenticated } = useAuth();
  const { toast } = useTaskContext();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  });

  if (isAuthenticated) {
    return <Navigate to="/profile" replace />;
  }

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    try {
      await login(data);
      toast('Вхід виконано успішно');
      navigate('/profile', { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Помилка входу. Перевірте облікові дані.';
      setServerError(message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-2xl shadow-sm border border-gray-200">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Вхід у систему</h1>
      <p className="text-sm text-gray-500 mb-6">
        Увійдіть, щоб створювати, редагувати та видаляти завдання.
      </p>

      {serverError && (
        <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
            Ім&apos;я користувача (username)
          </label>
          <input
            id="username"
            type="text"
            placeholder="Введіть username (напр. emilys)"
            {...register('username')}
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition ${
              errors.username
                ? 'border-red-400 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.username && (
            <p className="mt-1 text-xs text-red-600">{errors.username.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            Пароль
          </label>
          <input
            id="password"
            type="password"
            placeholder="Мінімум 6 символів"
            {...register('password')}
            className={`w-full px-4 py-2.5 border rounded-xl focus:outline-none focus:ring-2 transition ${
              errors.password
                ? 'border-red-400 focus:ring-red-400'
                : 'border-gray-300 focus:ring-blue-500'
            }`}
          />
          {errors.password && (
            <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-2 w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-xl transition cursor-pointer"
        >
          {isSubmitting ? 'Виконується вхід...' : 'Увійти'}
        </button>
      </form>
    </div>
  );
}