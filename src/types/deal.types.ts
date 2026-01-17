// ============================================
// Deal Types
// ============================================

export type DealStage = 'new' | 'negotiation' | 'proposal' | 'won' | 'lost';

export interface Deal {
  id: string;
  title: string;
  clientId: string;
  clientName: string;
  amount: number;
  stage: DealStage;
  probability: number;
  expectedCloseDate: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DealFormData {
  title: string;
  clientId: string;
  amount: number;
  stage?: DealStage;
  probability?: number;
  expectedCloseDate: string;
  description?: string;
}

export const getDealStageLabel = (stage: DealStage): string => {
  const labels: Record<DealStage, string> = { new: 'Новая', negotiation: 'Переговоры', proposal: 'Предложение', won: 'Выиграна', lost: 'Проиграна' };
  return labels[stage];
};

export const getDealStageColor = (stage: DealStage): string => {
  const colors: Record<DealStage, string> = { new: 'info', negotiation: 'warning', proposal: 'primary', won: 'success', lost: 'error' };
  return colors[stage];
};
