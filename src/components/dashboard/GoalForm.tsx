import { useState } from 'react';
import { Goal, GOAL_CATEGORIES, GoalCategory } from '@/types/goal';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Target } from 'lucide-react';
import { toast } from 'sonner';

interface GoalFormProps {
  onAddGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
}

export const GoalForm = ({ onAddGoal }: GoalFormProps) => {
  const [category, setCategory] = useState<GoalCategory>('expense');
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [month, setMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim() || !targetAmount || parseFloat(targetAmount) <= 0) {
      toast.error('Preencha todos os campos corretamente!');
      return;
    }

    onAddGoal({
      category,
      name: name.trim(),
      targetAmount: parseFloat(targetAmount),
      month,
    });

    setName('');
    setTargetAmount('');
    toast.success('Meta adicionada com sucesso!');
  };

  const selectedCategory = GOAL_CATEGORIES.find(c => c.value === category);

  return (
    <div className="glassmorphism rounded-2xl p-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-warning/20">
          <Target className="w-5 h-5 text-warning" />
        </div>
        <h2 className="text-2xl font-bold">Nova Meta Financeira</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="goal-category">Tipo de Meta</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as GoalCategory)}>
            <SelectTrigger id="goal-category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {GOAL_CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  <div>
                    <div className="font-medium">{cat.label}</div>
                    <div className="text-xs text-muted-foreground">{cat.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedCategory && (
            <p className="text-xs text-muted-foreground mt-1">{selectedCategory.description}</p>
          )}
        </div>

        <div>
          <Label htmlFor="goal-name">Nome da Meta</Label>
          <Input
            id="goal-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Reduzir gastos com alimentação"
          />
        </div>

        <div>
          <Label htmlFor="goal-amount">Valor Alvo (R$)</Label>
          <Input
            id="goal-amount"
            type="number"
            step="0.01"
            min="0"
            value={targetAmount}
            onChange={(e) => setTargetAmount(e.target.value)}
            placeholder="0.00"
          />
        </div>

        <div>
          <Label htmlFor="goal-month">Mês de Referência</Label>
          <Input
            id="goal-month"
            type="month"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full">
          <Target className="w-4 h-4 mr-2" />
          Adicionar Meta
        </Button>
      </form>
    </div>
  );
};
