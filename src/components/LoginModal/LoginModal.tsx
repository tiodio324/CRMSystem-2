import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { authStore } from '@/store';
import { UserRole } from '@/types';
import { Modal, Input, Button } from '@/components/UI';
import styles from './LoginModal.module.scss';

export const LoginModal = observer(() => {
  const { loginModalOpen, closeLoginModal, login, loginError, isLoading } = authStore;
  const [selectedRole, setSelectedRole] = useState<Exclude<UserRole, 'viewer'>>('manager');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => { e.preventDefault(); await login(selectedRole, password); };
  const handleClose = () => { closeLoginModal(); setPassword(''); setSelectedRole('manager'); };

  return (
    <Modal isOpen={loginModalOpen} onClose={handleClose} title="Вход в систему">
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.roleSelect}><label className={styles.label}>Выберите роль:</label><div className={styles.roles}><button type="button" className={`${styles.roleButton} ${selectedRole === 'manager' ? styles.active : ''}`} onClick={() => setSelectedRole('manager')}><span className={styles.roleIcon}>👔</span><span className={styles.roleName}>Менеджер</span></button><button type="button" className={`${styles.roleButton} ${selectedRole === 'admin' ? styles.active : ''}`} onClick={() => setSelectedRole('admin')}><span className={styles.roleIcon}>⚙️</span><span className={styles.roleName}>Администратор</span></button></div></div>
        <Input type="password" label="Пароль" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите пароль" error={loginError || undefined} disabled={isLoading} autoFocus />
        <div className={styles.actions}><Button type="button" variant="secondary" onClick={handleClose} disabled={isLoading}>Отмена</Button><Button type="submit" variant="primary" disabled={isLoading || !password}>{isLoading ? 'Вход...' : 'Войти'}</Button></div>
      </form>
    </Modal>
  );
});
