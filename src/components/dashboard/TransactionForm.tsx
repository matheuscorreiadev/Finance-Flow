import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TransactionType, INCOME_CATEGORIES, EXPENSE_CATEGORIES, Category } from '@/types/transaction';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';

interface TransactionFormProps {
  onAddTransaction: (transaction: {
    type: TransactionType;
    category: Category;
    amount: number;
    description: string;
    date: string;
  }) => void;
}

export const TransactionForm = ({ onAddTransaction }: TransactionFormProps) => {
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<Category>('Alimentação');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber) || amountNumber <= 0) {
      toast.error('Por favor, insira um valor válido');
      return;
    }

    onAddTransaction({
      type,
      category,
      amount: amountNumber,
      description: description || 'Sem descrição',
      date,
    });

    toast.success(type === 'income' ? 'Receita adicionada!' : 'Despesa adicionada!');
    
    setAmount('');
    setDescription('');
    setDate(new Date().toISOString().split('T')[0]);
  };

  return (
    <div className="glassmorphism rounded-2xl p-6 mb-8 animate-scale-in">
      <h2 className="text-2xl font-bold mb-6 text-gradient">Nova Transação</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="type">Tipo</Label>
            <Select value={type} onValueChange={(value) => {
              setType(value as TransactionType);
              setCategory(value === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]);
            }}>
              <SelectTrigger id="type" className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="income">Receita</SelectItem>
                <SelectItem value="expense">Despesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select value={category} onValueChange={(value) => setCategory(value as Category)}>
              <SelectTrigger id="category" className="bg-secondary border-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-secondary border-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="bg-secondary border-border"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Input
            id="description"
            type="text"
            placeholder="Adicione uma descrição..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-secondary border-border"
          />
        </div>

        <Button type="submit" className="w-full gradient-primary hover:opacity-90 transition-opacity">
          <Plus className="w-5 h-5 mr-2" />
          Adicionar Transação
        </Button>
      </form>
    </div>
  );
};
