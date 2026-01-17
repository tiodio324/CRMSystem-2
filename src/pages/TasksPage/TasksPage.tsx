import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore, authStore } from '@/store';
import { Card, Button, Select, Badge, Modal, Input, Table } from '@/components/UI';
import { Task, TaskFormData, getTaskStatusLabel, getTaskPriorityLabel, TaskStatus, TaskPriority } from '@/types';
import styles from './TasksPage.module.scss';

export const TasksPage = observer(() => {
  const { tasks, pendingTasks, tasksLoading, createTask, updateTask } = dataStore;
  const { isManager } = authStore;
  const [statusFilter, setStatusFilter] = useState<string>('pending');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<TaskFormData>({ title: '', dueDate: '', priority: 'medium' });

  const filteredTasks = statusFilter === 'pending' ? pendingTasks : statusFilter === 'all' ? tasks : tasks.filter(t => t.status === statusFilter);
  const statusOptions = [{ value: 'pending', label: 'Активные' }, { value: 'all', label: 'Все' }, { value: 'todo', label: 'К выполнению' }, { value: 'in_progress', label: 'В работе' }, { value: 'done', label: 'Выполнено' }];
  const priorityOptions = [{ value: 'low', label: 'Низкий' }, { value: 'medium', label: 'Средний' }, { value: 'high', label: 'Высокий' }, { value: 'urgent', label: 'Срочный' }];

  const handleSubmit = async () => { await createTask(formData); setIsModalOpen(false); };
  const handleStatusChange = async (id: string, status: TaskStatus) => { await updateTask(id, { status }); };

  const getPriorityColor = (p: TaskPriority) => ({ low: 'info', medium: 'warning', high: 'error', urgent: 'error' }[p] || 'info');
  const columns = [
    { key: 'title', title: 'Задача' },
    { key: 'priority', title: 'Приоритет', render: (t: Task) => <Badge variant={getPriorityColor(t.priority) as 'info'|'warning'|'error'}>{getTaskPriorityLabel(t.priority)}</Badge> },
    { key: 'dueDate', title: 'Срок', render: (t: Task) => new Date(t.dueDate).toLocaleDateString('ru-RU') },
    { key: 'status', title: 'Статус', render: (t: Task) => getTaskStatusLabel(t.status) },
  ];
  if (isManager) columns.push({ key: 'actions', title: '', render: (t: Task) => t.status !== 'done' ? <Button size="sm" onClick={() => handleStatusChange(t.id, t.status === 'todo' ? 'in_progress' : 'done')}>{t.status === 'todo' ? 'Начать' : 'Завершить'}</Button> : <></> });

  return (
    <div className={styles.page}>
      <div className={styles.header}><h1 className={styles.title}>Задачи</h1>{isManager && <Button variant="primary" onClick={() => setIsModalOpen(true)}>Новая задача</Button>}</div>
      <div className={styles.filters}><Select options={statusOptions} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} /></div>
      {tasksLoading ? <div className={styles.loading}>Загрузка...</div> : filteredTasks.length === 0 ? <div className={styles.empty}>Задачи не найдены</div> : <Card className={styles.tableCard}><Table columns={columns} data={filteredTasks} keyField="id" /></Card>}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Новая задача">
        <div className={styles.form}>
          <Input label="Название" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Input label="Описание" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
          <Input label="Срок выполнения" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
          <Select label="Приоритет" options={priorityOptions} value={formData.priority || 'medium'} onChange={(e) => setFormData({ ...formData, priority: e.target.value as TaskPriority })} />
          <div className={styles.formActions}><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Отмена</Button><Button variant="primary" onClick={handleSubmit}>Создать</Button></div>
        </div>
      </Modal>
    </div>
  );
});
