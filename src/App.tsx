import { BrowserRouter, Routes, Route, Navigate } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import AppLayout from './layouts/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import TasksPage from './pages/TasksPage';
import TaskDetailsPage from './pages/TaskDetailsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import NotFoundPage from './pages/NotFoundPage';
//https://youtu.be/dQw4w9WgXcQ?si=-Cz1ujAZvJ0jDYfh

export default function App() {
  return (
    <AuthProvider>
      <TaskProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/tasks" replace />} />

            <Route element={<AppLayout />}>
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/tasks/:taskId" element={<TaskDetailsPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ProfilePage />
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<NotFoundPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </TaskProvider>
    </AuthProvider>
  );
}