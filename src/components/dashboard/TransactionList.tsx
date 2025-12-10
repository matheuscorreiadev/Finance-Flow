import { Transaction } from '@/types/transaction';
import { Trash2, Calendar, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onClearAll: () => void;
}

export const TransactionList = ({ transactions, onDeleteTransaction, onClearAll }: TransactionListProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const handleDelete = (id: string) => {
    onDeleteTransaction(id);
    toast.success('Transação removida!');
  };

  const handleClearAll = () => {
    onClearAll();
    toast.success('Histórico limpo!');
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Histórico de Transações</h2>
        {transactions.length > 0 && (
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <Trash2 className="w-4 h-4 mr-2" />
                Limpar Histórico
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="glassmorphism">
              <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta ação não pode ser desfeita. Todas as transações serão permanentemente removidas.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearAll} className="bg-danger hover:bg-danger/90">
                  Limpar Tudo
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Nenhuma transação registrada ainda.</p>
          <p className="text-muted-foreground text-sm mt-2">Adicione sua primeira transação acima!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className="bg-secondary/50 rounded-xl p-4 flex items-center justify-between hover:bg-secondary/70 transition-all card-hover animate-slide-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-lg font-semibold">{transaction.description}</span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    transaction.type === 'income' 
                      ? 'bg-success/20 text-success' 
                      : 'bg-danger/20 text-danger'
                  }`}>
                    {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Tag className="w-4 h-4" />
                    <span>{transaction.category}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(transaction.date)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-2xl font-bold ${
                  transaction.type === 'income' ? 'text-success' : 'text-danger'
                }`}>
                  {transaction.type === 'income' ? '+' : '-'} {formatCurrency(transaction.amount)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleDelete(transaction.id)}
                  className="hover:bg-danger/20 hover:text-danger"
                >
                  <Trash2 className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
