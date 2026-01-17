// ============================================
// Task Types
// ============================================

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';
export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'cancelled';

export interface Task {
  id: string;
  title: string;
  description?: string;
  clientId?: string;
  dealId?: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  assignee?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TaskFormData {
  title: string;
  description?: string;
  clientId?: string;
  dealId?: string;
  priority?: TaskPriority;
  status?: TaskStatus;
  dueDate: string;
  assignee?: string;
}

export const getTaskPriorityLabel = (priority: TaskPriority): string => {
  const labels: Record<TaskPriority, string> = { low: 'Низкий', medium: 'Средний', high: 'Высокий', urgent: 'Срочный' };
  return labels[priority];
};

export const getTaskStatusLabel = (status: TaskStatus): string => {
  const labels: Record<TaskStatus, string> = { todo: 'К выполнению', in_progress: 'В работе', done: 'Выполнено', cancelled: 'Отменено' };
  return labels[status];
};
