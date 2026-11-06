import Header from './components/Header';
import TaskFilters from './components/TaskFilters';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import TaskStats from './components/TaskStats';
import Toast from './components/Toast';
import { TaskProvider } from './context/TaskContext';

export default function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Header />
          <TaskForm />
          <TaskStats />
          <TaskFilters />
          <TaskList />
        </div>
      </div>
      <Toast />
    </TaskProvider>
  );
}
