import { z } from 'zod';

export const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, 'Назва завдання має містити щонайменше 3 символи')
    .max(100, 'Назва не повинна перевищувати 100 символів'),
  description: z
    .string()
    .trim()
    .max(500, 'Опис не повинен перевищувати 500 символів'),
  category: z
    .string()
    .trim()
    .min(1, 'Вкажіть категорію'),
  priority: z.enum(['low', 'medium', 'high']),
});

export type TaskFormData = z.infer<typeof taskSchema>;