// ============================================
// Navigation Types
// ============================================

export type PageId = 'home' | 'clients' | 'deals' | 'tasks' | 'admin' | 'admin-clients' | 'admin-deals' | 'admin-tasks';

export interface PageConfig {
  id: PageId;
  title: string;
  icon: string;
  requiresAuth: boolean;
  requiredRole?: 'manager' | 'admin';
  showInNav: boolean;
  parentId?: PageId;
}

export const PAGES_CONFIG: Record<PageId, PageConfig> = {
  home: { id: 'home', title: 'Дашборд', icon: 'home', requiresAuth: false, showInNav: true },
  clients: { id: 'clients', title: 'Клиенты', icon: 'users', requiresAuth: false, showInNav: true },
  deals: { id: 'deals', title: 'Сделки', icon: 'briefcase', requiresAuth: false, showInNav: true },
  tasks: { id: 'tasks', title: 'Задачи', icon: 'check-square', requiresAuth: false, showInNav: true },
  admin: { id: 'admin', title: 'Администрирование', icon: 'settings', requiresAuth: true, requiredRole: 'admin', showInNav: true },
  'admin-clients': { id: 'admin-clients', title: 'Управление клиентами', icon: 'user-plus', requiresAuth: true, requiredRole: 'admin', showInNav: false, parentId: 'admin' },
  'admin-deals': { id: 'admin-deals', title: 'Управление сделками', icon: 'folder-plus', requiresAuth: true, requiredRole: 'admin', showInNav: false, parentId: 'admin' },
  'admin-tasks': { id: 'admin-tasks', title: 'Управление задачами', icon: 'list', requiresAuth: true, requiredRole: 'admin', showInNav: false, parentId: 'admin' },
};
