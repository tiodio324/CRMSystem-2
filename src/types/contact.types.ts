// ============================================
// Contact Types
// ============================================

export interface Contact {
  id: string;
  clientId: string;
  type: 'call' | 'email' | 'meeting' | 'other';
  subject: string;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface ContactFormData {
  clientId: string;
  type: 'call' | 'email' | 'meeting' | 'other';
  subject: string;
  notes?: string;
  date: string;
}

export const getContactTypeLabel = (type: string): string => {
  const labels: Record<string, string> = { call: 'Звонок', email: 'Email', meeting: 'Встреча', other: 'Другое' };
  return labels[type] || type;
};
