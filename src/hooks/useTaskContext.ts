import { useContext } from 'react';
import { TaskContext } from '../context/taskContext';

// Custom Hook для безпечного доступу до контексту[cite: 16]
export function useTaskContext() {
  const context = useContext(TaskContext);
  
  // Якщо context === undefined, значить компонент не обгорнуто в TaskProvider
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  
  return context;
}