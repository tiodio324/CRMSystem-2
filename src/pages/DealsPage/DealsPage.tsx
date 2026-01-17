import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore, authStore } from '@/store';
import { Card, Button, Select, Badge, Modal, Input, Table } from '@/components/UI';
import { Deal, DealFormData, getDealStageLabel, getDealStageColor, DealStage } from '@/types';
import styles from './DealsPage.module.scss';

export const DealsPage = observer(() => {
  const { deals, activeDeals, activeClients, dealsLoading, createDeal, updateDeal } = dataStore;
  const { isManager } = authStore;
  const [stageFilter, setStageFilter] = useState<string>('active');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<DealFormData>({ title: '', clientId: '', amount: 0, expectedCloseDate: '' });

  const filteredDeals = stageFilter === 'active' ? activeDeals : stageFilter === 'all' ? deals : deals.filter(d => d.stage === stageFilter);
  const stageOptions = [{ value: 'active', label: 'Активные' }, { value: 'all', label: 'Все' }, { value: 'new', label: 'Новые' }, { value: 'negotiation', label: 'Переговоры' }, { value: 'proposal', label: 'Предложение' }, { value: 'won', label: 'Выигранные' }, { value: 'lost', label: 'Проигранные' }];

  const handleSubmit = async () => { await createDeal(formData); setIsModalOpen(false); };
  const handleStageChange = async (id: string, stage: DealStage) => { await updateDeal(id, { stage }); };

  const columns = [
    { key: 'title', title: 'Сделка' },
    { key: 'clientName', title: 'Клиент' },
    { key: 'amount', title: 'Сумма', render: (d: Deal) => `${d.amount.toLocaleString()} ₽` },
    { key: 'expectedCloseDate', title: 'Дата закрытия', render: (d: Deal) => new Date(d.expectedCloseDate).toLocaleDateString('ru-RU') },
    { key: 'stage', title: 'Этап', render: (d: Deal) => <Badge variant={getDealStageColor(d.stage) as 'success'|'warning'|'info'|'error'}>{getDealStageLabel(d.stage)}</Badge> },
  ];
  if (isManager) columns.push({ key: 'actions', title: '', render: (d: Deal) => d.stage !== 'won' && d.stage !== 'lost' ? <Select options={stageOptions.filter(o => !['active','all'].includes(o.value))} value={d.stage} onChange={(e) => handleStageChange(d.id, e.target.value as DealStage)} /> : <></> });

  return (
    <div className={styles.page}>
      <div className={styles.header}><h1 className={styles.title}>Сделки</h1>{isManager && <Button variant="primary" onClick={() => setIsModalOpen(true)}>Новая сделка</Button>}</div>
      <div className={styles.filters}><Select options={stageOptions} value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} /></div>
      {dealsLoading ? <div className={styles.loading}>Загрузка...</div> : filteredDeals.length === 0 ? <div className={styles.empty}>Сделки не найдены</div> : <Card className={styles.tableCard}><Table columns={columns} data={filteredDeals} keyField="id" /></Card>}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Новая сделка">
        <div className={styles.form}>
          <Input label="Название" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} required />
          <Select label="Клиент" options={activeClients.map(c => ({ value: c.id, label: c.name }))} value={formData.clientId} onChange={(e) => setFormData({ ...formData, clientId: e.target.value })} required />
          <Input label="Сумма (₽)" type="number" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })} required />
          <Input label="Ожидаемая дата закрытия" type="date" value={formData.expectedCloseDate} onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })} required />
          <div className={styles.formActions}><Button variant="secondary" onClick={() => setIsModalOpen(false)}>Отмена</Button><Button variant="primary" onClick={handleSubmit}>Создать</Button></div>
        </div>
      </Modal>
    </div>
  );
});
