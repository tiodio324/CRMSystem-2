import { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore, authStore } from '@/store';
import { Card, Button, Input, Select, Badge, Modal, Table } from '@/components/UI';
import { Client, ClientFormData, getClientStatusLabel, getClientStatusColor, ClientStatus } from '@/types';
import styles from './ClientsPage.module.scss';

export const ClientsPage = observer(() => {
  const { filteredClients, clientsLoading, setFilter, createClient, updateClient, deleteClient } = dataStore;
  const { isManager } = authStore;
  const [searchValue, setSearchValue] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<ClientFormData>({ name: '', email: '', phone: '', status: 'lead' });

  useEffect(() => { const t = setTimeout(() => setFilter('search', searchValue || undefined), 300); return () => clearTimeout(t); }, [searchValue, setFilter]);

  const handleOpenModal = (client?: Client) => {
    if (client) { setEditingClient(client); setFormData({ name: client.name, email: client.email, phone: client.phone, company: client.company, status: client.status }); }
    else { setEditingClient(null); setFormData({ name: '', email: '', phone: '', status: 'lead' }); }
    setIsModalOpen(true);
  };

  const handleSubmit = async () => { if (editingClient) await updateClient(editingClient.id, formData); else await createClient(formData); setIsModalOpen(false); };
  const handleDelete = async (id: string) => { if (confirm('Удалить клиента?')) await deleteClient(id); };

  const statusOptions = [{ value: '', label: 'Все статусы' }, { value: 'lead', label: 'Лид' }, { value: 'prospect', label: 'Потенциальный' }, { value: 'customer', label: 'Клиент' }, { value: 'inactive', label: 'Неактивный' }];
  const columns = [
    { key: 'name', title: 'Имя' },
    { key: 'email', title: 'Email' },
    { key: 'phone', title: 'Телефон' },
    { key: 'company', title: 'Компания', render: (c: Client) => c.company || '-' },
    { key: 'status', title: 'Статус', render: (c: Client) => <Badge variant={getClientStatusColor(c.status) as 'success'|'warning'|'info'|'error'}>{getClientStatusLabel(c.status)}</Badge> },
  ];
  if (isManager) columns.push({ key: 'actions', title: '', render: (c: Client) => <div style={{display:'flex',gap:'8px'}}><Button size="sm" variant="secondary" onClick={() => handleOpenModal(c)}>✏️</Button><Button size="sm" variant="danger" onClick={() => handleDelete(c.id)}>🗑️</Button></div> });

  return (
    <div className={styles.page}>
      <div className={styles.header}><h1 className={styles.title}>Клиенты</h1>{isManager && <Button variant="primary" onClick={() => handleOpenModal()}>Добавить клиента</Button>}</div>
      <div className={styles.filters}><Input placeholder="Поиск..." value={searchValue} onChange={(e) => setSearchValue(e.target.value)} className={styles.searchInput} /><Select options={statusOptions} value="" onChange={(e) => setFilter('status', e.target.value || undefined)} /></div>
      {clientsLoading ? <div className={styles.loading}>Загрузка...</div> : filteredClients.length === 0 ? <div className={styles.empty}>Клиенты не найдены</div> : <Card className={styles.tableCard}><Table columns={columns} data={filteredClients} keyField="id" /></Card>}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingClient ? 'Редактировать клиента' : 'Добавить клиента'}>
        <div className={styles.form}>
          <Input label="Имя" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Input label="Телефон" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <Input label="Компания" value={formData.company || ''} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
          <Select label="Статус" options={statusOptions.filter(o => o.value)} value={formData.status || 'lead'} onChange={(e) => setFormData({ ...formData, status: e.target.value as ClientStatus })} />
          <div className={styles.formActions}><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Отмена</Button><Button variant="primary" onClick={handleSubmit}>{editingClient ? 'Сохранить' : 'Добавить'}</Button></div>
        </div>
      </Modal>
    </div>
  );
});
