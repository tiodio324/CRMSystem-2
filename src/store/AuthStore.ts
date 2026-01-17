import { makeAutoObservable } from 'mobx';
import { User, UserRole, ROLE_PERMISSIONS, RolePermissions } from '@/types';

const AUTH_STORAGE_KEY = 'crm_system_auth';
const SESSION_EXPIRY_KEY = 'crm_system_session_expiry';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

const AUTH_CREDENTIALS: Record<Exclude<UserRole, 'viewer'>, string> = {
  manager: 'manager2026-crm',
  admin: 'admin2026-crm',
};

export class AuthStore {
  private _user: User = { role: 'viewer' };
  loginModalOpen = false;
  loginError: string | null = null;
  isLoading = false;

  constructor() { makeAutoObservable(this, {}, { autoBind: true }); this.loadAuthState(); }

  get user(): User { return this._user; }
  get isAuthenticated(): boolean { return this._user.role !== 'viewer'; }
  get isManager(): boolean { return this._user.role === 'manager' || this._user.role === 'admin'; }
  get isAdmin(): boolean { return this._user.role === 'admin'; }
  get permissions(): RolePermissions { return ROLE_PERMISSIONS[this._user.role]; }
  get currentRole(): UserRole { return this._user.role; }

  canViewClients = (): boolean => this.permissions.canViewClients;
  canViewDeals = (): boolean => this.permissions.canViewDeals;
  canViewTasks = (): boolean => this.permissions.canViewTasks;
  canManageClients = (): boolean => this.permissions.canManageClients;
  canManageDeals = (): boolean => this.permissions.canManageDeals;
  canManageTasks = (): boolean => this.permissions.canManageTasks;
  canAccessAdmin = (): boolean => this.permissions.canAccessAdmin;

  hasRole = (requiredRole: UserRole): boolean => {
    const h: Record<UserRole, number> = { viewer: 0, manager: 1, admin: 2 };
    return h[this._user.role] >= h[requiredRole];
  };

  private loadAuthState = (): void => {
    try {
      const s = localStorage.getItem(AUTH_STORAGE_KEY), e = localStorage.getItem(SESSION_EXPIRY_KEY);
      if (s && e) { const a = JSON.parse(s); if (Date.now() < parseInt(e, 10) && a.role !== 'viewer') this._user = { role: a.role }; else this.clearAuthStorage(); }
    } catch { this.clearAuthStorage(); }
  };

  private saveAuthState = (): void => {
    if (this._user.role !== 'viewer') { localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ role: this._user.role })); localStorage.setItem(SESSION_EXPIRY_KEY, String(Date.now() + SESSION_DURATION)); }
    else this.clearAuthStorage();
  };

  private clearAuthStorage = (): void => { localStorage.removeItem(AUTH_STORAGE_KEY); localStorage.removeItem(SESSION_EXPIRY_KEY); };

  openLoginModal = (): void => { this.loginModalOpen = true; this.loginError = null; };
  closeLoginModal = (): void => { this.loginModalOpen = false; this.loginError = null; this.isLoading = false; };

  login = async (role: Exclude<UserRole, 'viewer'>, password: string): Promise<boolean> => {
    this.isLoading = true; this.loginError = null;
    await new Promise(r => setTimeout(r, 500));
    if (AUTH_CREDENTIALS[role] === password) { this._user = { role }; this.saveAuthState(); this.closeLoginModal(); this.isLoading = false; return true; }
    this.loginError = 'Неверный пароль'; this.isLoading = false; return false;
  };

  logout = (): void => { this._user = { role: 'viewer' }; this.clearAuthStorage(); };
  clearError = (): void => { this.loginError = null; };
}

export const authStore = new AuthStore();
