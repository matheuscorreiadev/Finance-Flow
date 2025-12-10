import { useEffect, useRef } from 'react';
import { Goal } from '@/types/goal';
import { Transaction } from '@/types/transaction';
import { Trash2, TrendingUp, TrendingDown, PiggyBank, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface GoalsListProps {
  goals: Goal[];
  transactions: Transaction[];
  onDeleteGoal: (id: string) => void;
}

export const GoalsList = ({ goals, transactions, onDeleteGoal }: GoalsListProps) => {
  const notifiedGoals = useRef<Set<string>>(new Set());

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatMonth = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const getGoalProgress = (goal: Goal) => {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      const transactionMonth = `${transactionDate.getFullYear()}-${String(transactionDate.getMonth() + 1).padStart(2, '0')}`;
      return transactionMonth === goal.month;
    });

    let currentAmount = 0;

    if (goal.category === 'income') {
      currentAmount = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
    } else if (goal.category === 'expense') {
      currentAmount = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
    } else if (goal.category === 'savings') {
      const income = monthTransactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);
      const expense = monthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);
      currentAmount = income - expense;
    }

    const percentage = (currentAmount / goal.targetAmount) * 100;
    return { currentAmount, percentage: Math.min(percentage, 100), exceeded: percentage > 100 };
  };

  const getGoalIcon = (category: Goal['category']) => {
    if (category === 'income') return <TrendingUp className="w-5 h-5" />;
    if (category === 'expense') return <TrendingDown className="w-5 h-5" />;
    return <PiggyBank className="w-5 h-5" />;
  };

  const getGoalColor = (category: Goal['category']) => {
    if (category === 'income') return 'text-success bg-success/20';
    if (category === 'expense') return 'text-danger bg-danger/20';
    return 'text-warning bg-warning/20';
  };

  useEffect(() => {
    goals.forEach(goal => {
      const { percentage, exceeded, currentAmount } = getGoalProgress(goal);
      
      if (percentage >= 100 && !notifiedGoals.current.has(goal.id)) {
        notifiedGoals.current.add(goal.id);
        
        if (goal.category === 'expense' && exceeded) {
          toast.error(
            `⚠️ Meta ultrapassada: ${goal.name}`,
            {
              description: `Você já gastou ${formatCurrency(currentAmount)} de ${formatCurrency(goal.targetAmount)}`,
            }
          );
        } else {
          toast.success(
            `🎯 Meta atingida: ${goal.name}`,
            {
              description: `Parabéns! Você alcançou ${formatCurrency(currentAmount)}`,
            }
          );
        }
      }
    });
  }, [goals, transactions]);

  if (goals.length === 0) {
    return (
      <div className="glassmorphism rounded-2xl p-6 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">Minhas Metas</h2>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Nenhuma meta cadastrada ainda.</p>
          <p className="text-muted-foreground text-sm mt-2">Defina suas metas financeiras para acompanhar seu progresso!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="glassmorphism rounded-2xl p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Minhas Metas</h2>
      
      <div className="space-y-4">
        {goals.map((goal, index) => {
          const { currentAmount, percentage, exceeded } = getGoalProgress(goal);
          const colorClass = getGoalColor(goal.category);
          
          return (
            <div
              key={goal.id}
              className="bg-secondary/50 rounded-xl p-5 hover:bg-secondary/70 transition-all card-hover animate-slide-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${colorClass}`}>
                    {getGoalIcon(goal.category)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{goal.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      <span>{formatMonth(goal.month)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    onDeleteGoal(goal.id);
                    toast.success('Meta removida!');
                  }}
                  className="hover:bg-danger/20 hover:text-danger"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Progresso</span>
                  <span className={`font-bold ${exceeded ? 'text-danger' : percentage >= 100 ? 'text-success' : ''}`}>
                    {percentage.toFixed(1)}%
                  </span>
                </div>
                
                <Progress 
                  value={percentage} 
                  className="h-2"
                />
                
                <div className="flex justify-between items-center text-sm">
                  <span className={exceeded && goal.category === 'expense' ? 'text-danger font-medium' : ''}>
                    {formatCurrency(currentAmount)}
                  </span>
                  <span className="text-muted-foreground">
                    {formatCurrency(goal.targetAmount)}
                  </span>
                </div>
              </div>

              {exceeded && goal.category === 'expense' && (
                <div className="mt-3 p-2 bg-danger/10 border border-danger/20 rounded-lg text-xs text-danger">
                  ⚠️ Atenção: Você ultrapassou o limite desta meta!
                </div>
              )}

              {percentage >= 100 && goal.category !== 'expense' && (
                <div className="mt-3 p-2 bg-success/10 border border-success/20 rounded-lg text-xs text-success">
                  🎉 Parabéns! Você atingiu esta meta!
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
