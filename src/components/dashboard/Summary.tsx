import { TrendingUp, TrendingDown, Wallet } from 'lucide-react';

interface SummaryProps {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export const Summary = ({ totalIncome, totalExpense, balance }: SummaryProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="glassmorphism rounded-2xl p-6 card-hover animate-fade-in">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-success">
              <TrendingUp className="w-6 h-6 text-success-foreground" />
            </div>
            <span className="text-muted-foreground font-medium">Receitas</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-success">{formatCurrency(totalIncome)}</p>
      </div>

      <div className="glassmorphism rounded-2xl p-6 card-hover animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-danger">
              <TrendingDown className="w-6 h-6 text-danger-foreground" />
            </div>
            <span className="text-muted-foreground font-medium">Despesas</span>
          </div>
        </div>
        <p className="text-3xl font-bold text-danger">{formatCurrency(totalExpense)}</p>
      </div>

      <div className="glassmorphism rounded-2xl p-6 card-hover animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl gradient-primary">
              <Wallet className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-muted-foreground font-medium">Saldo</span>
          </div>
        </div>
        <p className={`text-3xl font-bold ${balance >= 0 ? 'text-success' : 'text-danger'}`}>
          {formatCurrency(balance)}
        </p>
      </div>
    </div>
  );
};
