// ============================================
// Client Types
// ============================================

export type ClientStatus = 'lead' | 'prospect' | 'customer' | 'inactive';

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  status: ClientStatus;
  source?: string;
  notes?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClientFormData {
  name: string;
  email: string;
  phone: string;
  company?: string;
  status?: ClientStatus;
  source?: string;
  notes?: string;
}

export const getClientStatusLabel = (status: ClientStatus): string => {
  const labels: Record<ClientStatus, string> = { lead: 'Лид', prospect: 'Потенциальный', customer: 'Клиент', inactive: 'Неактивный' };
  return labels[status];
};

export const getClientStatusColor = (status: ClientStatus): string => {
  const colors: Record<ClientStatus, string> = { lead: 'info', prospect: 'warning', customer: 'success', inactive: 'error' };
  return colors[status];
};
