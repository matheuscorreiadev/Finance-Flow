import { Transaction, CATEGORY_COLORS } from '@/types/transaction';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface CategoryChartProps {
  transactions: Transaction[];
}

export const CategoryChart = ({ transactions }: CategoryChartProps) => {
  const chartId = 'category-chart';
  const categoryData = transactions.reduce((acc, transaction) => {
    const existing = acc.find(item => item.category === transaction.category);
    if (existing) {
      existing.value += transaction.amount;
    } else {
      acc.push({
        category: transaction.category,
        value: transaction.amount,
        color: CATEGORY_COLORS[transaction.category],
      });
    }
    return acc;
  }, [] as Array<{ category: string; value: number; color: string }>);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  if (transactions.length === 0) {
    return (
      <div className="glassmorphism rounded-2xl p-6 animate-fade-in">
        <h2 className="text-2xl font-bold mb-6">Gastos por Categoria</h2>
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">Nenhuma transação para exibir.</p>
        </div>
      </div>
    );
  }

  return (
    <div id={chartId} className="glassmorphism rounded-2xl p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Gastos por Categoria</h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={categoryData}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ category, percent }) => `${category} (${(percent * 100).toFixed(0)}%)`}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            animationBegin={0}
            animationDuration={800}
          >
            {categoryData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '0.75rem',
              color: 'hsl(var(--foreground))',
            }}
          />
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
            }}
            formatter={(value) => <span className="text-foreground">{value}</span>}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
