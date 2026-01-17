import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore } from '@/store';
import { Card, Button, Table } from '@/components/UI';
import { Client, Deal, Task, getClientStatusLabel, getDealStageLabel, getTaskStatusLabel } from '@/types';
import styles from './AdminPage.module.scss';

type AdminTab = 'clients' | 'deals' | 'tasks';

export const AdminPage = observer(() => {
  const { clients, deals, tasks, deleteClient } = dataStore;
  const [activeTab, setActiveTab] = useState<AdminTab>('clients');

  const handleDeleteClient = async (id: string) => { if (confirm('Удалить?')) await deleteClient(id); };

  const clientColumns = [
    { key: 'name', title: 'Имя' }, { key: 'email', title: 'Email' }, { key: 'phone', title: 'Телефон' },
    { key: 'status', title: 'Статус', render: (c: Client) => getClientStatusLabel(c.status) },
    { key: 'isActive', title: 'Активен', render: (c: Client) => c.isActive ? 'Да' : 'Нет' },
    { key: 'actions', title: '', render: (c: Client) => <Button size="sm" variant="danger" onClick={() => handleDeleteClient(c.id)}>Удалить</Button> }
  ];
  const dealColumns = [
    { key: 'title', title: 'Сделка' }, { key: 'clientName', title: 'Клиент' },
    { key: 'amount', title: 'Сумма', render: (d: Deal) => `${d.amount.toLocaleString()} ₽` },
    { key: 'stage', title: 'Этап', render: (d: Deal) => getDealStageLabel(d.stage) }
  ];
  const taskColumns = [
    { key: 'title', title: 'Задача' }, { key: 'dueDate', title: 'Срок', render: (t: Task) => new Date(t.dueDate).toLocaleDateString('ru-RU') },
    { key: 'status', title: 'Статус', render: (t: Task) => getTaskStatusLabel(t.status) }
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Администрирование</h1>
      <div className={styles.tabs}>
        <button className={`${styles.tab} ${activeTab === 'clients' ? styles.active : ''}`} onClick={() => setActiveTab('clients')}>Клиенты ({clients.length})</button>
        <button className={`${styles.tab} ${activeTab === 'deals' ? styles.active : ''}`} onClick={() => setActiveTab('deals')}>Сделки ({deals.length})</button>
        <button className={`${styles.tab} ${activeTab === 'tasks' ? styles.active : ''}`} onClick={() => setActiveTab('tasks')}>Задачи ({tasks.length})</button>
      </div>
      {activeTab === 'clients' && <Card className={styles.tableCard}><Table columns={clientColumns} data={clients} keyField="id" /></Card>}
      {activeTab === 'deals' && <Card className={styles.tableCard}><Table columns={dealColumns} data={deals} keyField="id" /></Card>}
      {activeTab === 'tasks' && <Card className={styles.tableCard}><Table columns={taskColumns} data={tasks} keyField="id" /></Card>}
    </div>
  );
});
