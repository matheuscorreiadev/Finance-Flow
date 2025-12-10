export interface Goal {
  id: string;
  category: 'income' | 'expense' | 'savings';
  name: string;
  targetAmount: number;
  month: string; // formato: YYYY-MM
  createdAt: number;
}

export type GoalCategory = 'income' | 'expense' | 'savings';

export const GOAL_CATEGORIES: { value: GoalCategory; label: string; description: string }[] = [
  { value: 'income', label: 'Meta de Receita', description: 'Valor que deseja receber no mês' },
  { value: 'expense', label: 'Limite de Despesas', description: 'Valor máximo que deseja gastar' },
  { value: 'savings', label: 'Meta de Economia', description: 'Valor que deseja economizar' },
];
