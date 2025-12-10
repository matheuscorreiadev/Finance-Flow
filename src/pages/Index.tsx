import { useTransactions } from '@/hooks/useTransactions';
import { useGoals } from '@/hooks/useGoals';
import { Summary } from '@/components/dashboard/Summary';
import { TransactionForm } from '@/components/dashboard/TransactionForm';
import { TransactionList } from '@/components/dashboard/TransactionList';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { ExportButtons } from '@/components/dashboard/ExportButtons';
import { GoalForm } from '@/components/dashboard/GoalForm';
import { GoalsList } from '@/components/dashboard/GoalsList';
import { Wallet } from 'lucide-react';

const Index = () => {
  const {
    transactions,
    addTransaction,
    deleteTransaction,
    clearAllTransactions,
    getTotalIncome,
    getTotalExpense,
    getBalance,
  } = useTransactions();

  const {
    goals,
    addGoal,
    deleteGoal,
  } = useGoals();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <header className="mb-12 animate-fade-in">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 rounded-2xl gradient-primary">
              <Wallet className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-5xl font-bold text-gradient">FinanceFlow</h1>
              <p className="text-muted-foreground text-lg">Controle total das suas finanças</p>
            </div>
          </div>
        </header>

        <Summary
          totalIncome={getTotalIncome()}
          totalExpense={getTotalExpense()}
          balance={getBalance()}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <TransactionForm onAddTransaction={addTransaction} />
          <CategoryChart transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <GoalForm onAddGoal={addGoal} />
          <GoalsList 
            goals={goals} 
            transactions={transactions}
            onDeleteGoal={deleteGoal}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2">
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={deleteTransaction}
              onClearAll={clearAllTransactions}
            />
          </div>
          <ExportButtons
            transactions={transactions}
            totalIncome={getTotalIncome()}
            totalExpense={getTotalExpense()}
            balance={getBalance()}
            chartElementId="category-chart"
          />
        </div>
      </div>
    </div>
  );
};

export default Index;
