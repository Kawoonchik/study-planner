import Header from './components/Header'; // Або як він у тебе називається
import { TaskList } from './components/TaskList';
import { TaskProvider } from './context/TaskContext';
import Toast from './components/Toast'; // Перевір шлях

export default function App() {
  return (
    <TaskProvider>
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-3xl mx-auto px-4">
          <Header />
          <TaskList />
        </div>
      </div>
      <Toast />
    </TaskProvider>
  );
}