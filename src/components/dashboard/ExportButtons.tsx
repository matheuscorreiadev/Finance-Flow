import { Transaction } from '@/types/transaction';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useExport } from '@/hooks/useExport';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface ExportButtonsProps {
  transactions: Transaction[];
  totalIncome: number;
  totalExpense: number;
  balance: number;
  chartElementId?: string;
}

export const ExportButtons = ({
  transactions,
  totalIncome,
  totalExpense,
  balance,
  chartElementId,
}: ExportButtonsProps) => {
  const { exportToCSV, exportToPDF } = useExport();
  const [selectedMonth, setSelectedMonth] = useState<string>('all');

  // Gerar lista de meses disponíveis
  const getAvailableMonths = () => {
    const months = new Set<string>();
    transactions.forEach(t => {
      const date = new Date(t.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      months.add(monthYear);
    });
    return Array.from(months).sort().reverse();
  };

  const availableMonths = getAvailableMonths();

  const getFilteredTransactions = () => {
    if (selectedMonth === 'all') return transactions;
    
    return transactions.filter(t => {
      const date = new Date(t.date);
      const monthYear = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      return monthYear === selectedMonth;
    });
  };

  const getFilteredTotals = () => {
    const filtered = getFilteredTransactions();
    const income = filtered
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);
    const expense = filtered
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    return {
      income,
      expense,
      balance: income - expense,
    };
  };

  const formatMonthLabel = (monthYear: string) => {
    const [year, month] = monthYear.split('-');
    const date = new Date(parseInt(year), parseInt(month) - 1);
    return date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  };

  const handleExportCSV = () => {
    const filtered = getFilteredTransactions();
    if (filtered.length === 0) {
      toast.error('Nenhuma transação para exportar!');
      return;
    }
    
    const monthLabel = selectedMonth === 'all' ? undefined : formatMonthLabel(selectedMonth);
    exportToCSV(filtered, monthLabel);
    toast.success('CSV exportado com sucesso!');
  };

  const handleExportPDF = async () => {
    const filtered = getFilteredTransactions();
    if (filtered.length === 0) {
      toast.error('Nenhuma transação para exportar!');
      return;
    }
    
    const totals = getFilteredTotals();
    const monthLabel = selectedMonth === 'all' ? undefined : formatMonthLabel(selectedMonth);
    const chartElement = chartElementId ? document.getElementById(chartElementId) : null;
    
    toast.loading('Gerando PDF...');
    await exportToPDF(
      filtered,
      totals.income,
      totals.expense,
      totals.balance,
      monthLabel,
      chartElement
    );
    toast.dismiss();
    toast.success('PDF exportado com sucesso!');
  };

  if (transactions.length === 0) return null;

  return (
    <div className="glassmorphism rounded-2xl p-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-6">Exportar Dados</h2>
      
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">Período:</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Selecione o período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              {availableMonths.map(month => (
                <SelectItem key={month} value={month}>
                  {formatMonthLabel(month)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3">
          <Button
            onClick={handleExportCSV}
            className="flex-1 bg-success hover:bg-success/90"
          >
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Exportar CSV
          </Button>
          
          <Button
            onClick={handleExportPDF}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <FileDown className="w-4 h-4 mr-2" />
            Exportar PDF
          </Button>
        </div>

        <p className="text-xs text-muted-foreground text-center">
          {getFilteredTransactions().length} transação(ões) no período selecionado
        </p>
      </div>
    </div>
  );
};
