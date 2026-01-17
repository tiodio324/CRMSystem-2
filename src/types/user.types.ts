// ============================================
// User & Role Types - CRM System
// ============================================

export type UserRole = 'viewer' | 'manager' | 'admin';

export interface User {
  role: UserRole;
}

export interface RolePermissions {
  canViewClients: boolean;
  canViewDeals: boolean;
  canViewTasks: boolean;
  canManageClients: boolean;
  canManageDeals: boolean;
  canManageTasks: boolean;
  canAccessAdmin: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  viewer: {
    canViewClients: true,
    canViewDeals: true,
    canViewTasks: true,
    canManageClients: false,
    canManageDeals: false,
    canManageTasks: false,
    canAccessAdmin: false,
  },
  manager: {
    canViewClients: true,
    canViewDeals: true,
    canViewTasks: true,
    canManageClients: true,
    canManageDeals: true,
    canManageTasks: true,
    canAccessAdmin: false,
  },
  admin: {
    canViewClients: true,
    canViewDeals: true,
    canViewTasks: true,
    canManageClients: true,
    canManageDeals: true,
    canManageTasks: true,
    canAccessAdmin: true,
  },
};
