import { useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { dataStore, authStore, navigationStore } from '@/store';
import { Card, Button, Badge } from '@/components/UI';
import styles from './HomePage.module.scss';

const StatCard = ({ title, value, icon, color }: { title: string; value: number | string; icon: React.ReactNode; color: 'primary' | 'success' | 'warning' | 'info' }) => (
  <Card className={`${styles.statCard} ${styles[color]}`}><div className={styles.statIcon}>{icon}</div><div className={styles.statContent}><span className={styles.statValue}>{value}</span><span className={styles.statTitle}>{title}</span></div></Card>
);

export const HomePage = observer(() => {
  const { clients, loadAllData, clientsLoading, totalDealValue, activeDeals, pendingTasks } = dataStore;
  const { isManager, isAdmin } = authStore;
  const { navigate } = navigationStore;

  useEffect(() => { loadAllData(); }, [loadAllData]);

  const activeClients = clients.filter(c => c.isActive);
  const customerCount = activeClients.filter(c => c.status === 'customer').length;

  return (
    <div className={styles.page}>
      <section className={styles.welcome}>
        <div className={styles.welcomeContent}>
          <h1 className={styles.welcomeTitle}>CRM-система для малого бизнеса</h1>
          <p className={styles.welcomeText}>Управление клиентами, сделками и задачами в одном месте.{!isManager && ' Войдите для редактирования данных.'}</p>
          {!authStore.isAuthenticated && <Button variant="primary" size="lg" onClick={() => authStore.openLoginModal()}>Войти в систему</Button>}
        </div>
      </section>
      <section className={styles.stats}>
        <StatCard title="Клиентов" value={clientsLoading ? '...' : activeClients.length} color="primary" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>} />
        <StatCard title="Активных сделок" value={activeDeals.length} color="warning" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>} />
        <StatCard title="Сумма сделок" value={`${(totalDealValue / 1000).toFixed(0)}K ₽`} color="success" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6"/></svg>} />
        <StatCard title="Задач в работе" value={pendingTasks.length} color="info" icon={<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>} />
      </section>
      <section className={styles.quickActions}>
        <h2 className={styles.sectionTitle}>Быстрые действия</h2>
        <div className={styles.actionCards}>
          <Card className={styles.actionCard} hoverable onClick={() => navigate('clients')}><div className={styles.actionIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/></svg></div><h3>Клиенты</h3><p>База клиентов и лидов</p><Badge variant="info">{customerCount} клиентов</Badge></Card>
          <Card className={styles.actionCard} hoverable onClick={() => navigate('deals')}><div className={styles.actionIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg></div><h3>Сделки</h3><p>Воронка продаж</p>{activeDeals.length > 0 && <Badge variant="warning">{activeDeals.length} активных</Badge>}</Card>
          <Card className={styles.actionCard} hoverable onClick={() => navigate('tasks')}><div className={styles.actionIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="9,11 12,14 22,4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg></div><h3>Задачи</h3><p>Планирование работы</p></Card>
          {isAdmin && <Card className={styles.actionCard} hoverable onClick={() => navigate('admin')}><div className={styles.actionIcon}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09a1.65 1.65 0 00-1-1.51 1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09a1.65 1.65 0 001.51-1 1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9c.26.604.852.997 1.51 1H21a2 2 0 010 4h-.09c-.658.003-1.25.396-1.51 1z"/></svg></div><h3>Администрирование</h3><p>Управление системой</p></Card>}
        </div>
      </section>
    </div>
  );
});
