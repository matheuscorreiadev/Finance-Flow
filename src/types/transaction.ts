export type TransactionType = 'income' | 'expense';

export type Category = 
  | 'Salário'
  | 'Freelance'
  | 'Investimentos'
  | 'Outros Ganhos'
  | 'Alimentação'
  | 'Transporte'
  | 'Moradia'
  | 'Saúde'
  | 'Educação'
  | 'Lazer'
  | 'Compras'
  | 'Contas'
  | 'Outros Gastos';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: Category;
  amount: number;
  description: string;
  date: string;
  createdAt: number;
}

export const INCOME_CATEGORIES: Category[] = [
  'Salário',
  'Freelance',
  'Investimentos',
  'Outros Ganhos',
];

export const EXPENSE_CATEGORIES: Category[] = [
  'Alimentação',
  'Transporte',
  'Moradia',
  'Saúde',
  'Educação',
  'Lazer',
  'Compras',
  'Contas',
  'Outros Gastos',
];

export const CATEGORY_COLORS: Record<Category, string> = {
  'Salário': 'hsl(142, 76%, 45%)',
  'Freelance': 'hsl(160, 70%, 50%)',
  'Investimentos': 'hsl(180, 80%, 50%)',
  'Outros Ganhos': 'hsl(200, 90%, 55%)',
  'Alimentação': 'hsl(0, 85%, 60%)',
  'Transporte': 'hsl(15, 80%, 55%)',
  'Moradia': 'hsl(30, 85%, 55%)',
  'Saúde': 'hsl(340, 80%, 60%)',
  'Educação': 'hsl(280, 70%, 60%)',
  'Lazer': 'hsl(260, 75%, 65%)',
  'Compras': 'hsl(300, 70%, 60%)',
  'Contas': 'hsl(320, 75%, 55%)',
  'Outros Gastos': 'hsl(350, 80%, 60%)',
};
