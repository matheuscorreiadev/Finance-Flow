import { Transaction } from '@/types/transaction';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';

export const useExport = () => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const exportToCSV = (transactions: Transaction[], month?: string) => {
    const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor'];
    const rows = transactions.map(t => [
      formatDate(t.date),
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.category,
      t.description,
      formatCurrency(t.amount),
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', `financas_${month || 'completo'}_${Date.now()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = async (
    transactions: Transaction[],
    totalIncome: number,
    totalExpense: number,
    balance: number,
    month?: string,
    chartElement?: HTMLElement | null
  ) => {
    const pdf = new jsPDF();
    
    // Título
    pdf.setFontSize(20);
    pdf.setTextColor(34, 197, 94);
    pdf.text('Relatório Financeiro', 105, 20, { align: 'center' });
    
    // Período
    pdf.setFontSize(12);
    pdf.setTextColor(100, 100, 100);
    pdf.text(month || 'Período Completo', 105, 30, { align: 'center' });
    
    // Resumo
    pdf.setFontSize(14);
    pdf.setTextColor(0, 0, 0);
    pdf.text('Resumo:', 14, 45);
    
    pdf.setFontSize(11);
    pdf.setTextColor(34, 197, 94);
    pdf.text(`Total de Receitas: ${formatCurrency(totalIncome)}`, 14, 55);
    
    pdf.setTextColor(239, 68, 68);
    pdf.text(`Total de Despesas: ${formatCurrency(totalExpense)}`, 14, 62);
    
    if (balance >= 0) {
      pdf.setTextColor(34, 197, 94);
    } else {
      pdf.setTextColor(239, 68, 68);
    }
    pdf.text(`Saldo: ${formatCurrency(balance)}`, 14, 69);
    
    let yPosition = 80;
    
    // Capturar e adicionar gráfico se existir
    if (chartElement) {
      try {
        const canvas = await html2canvas(chartElement, {
          backgroundColor: '#1a1a2e',
          scale: 2,
        });
        const imgData = canvas.toDataURL('image/png');
        const imgWidth = 180;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        
        pdf.addImage(imgData, 'PNG', 15, yPosition, imgWidth, imgHeight);
        yPosition += imgHeight + 10;
      } catch (error) {
        console.error('Erro ao capturar gráfico:', error);
      }
    }
    
    // Adicionar nova página se necessário
    if (yPosition > 200) {
      pdf.addPage();
      yPosition = 20;
    }
    
    // Tabela de transações
    const tableData = transactions.map(t => [
      formatDate(t.date),
      t.type === 'income' ? 'Receita' : 'Despesa',
      t.category,
      t.description,
      formatCurrency(t.amount),
    ]);
    
    autoTable(pdf, {
      startY: yPosition,
      head: [['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor']],
      body: tableData,
      theme: 'grid',
      headStyles: {
        fillColor: [34, 197, 94],
        textColor: [255, 255, 255],
        fontSize: 10,
      },
      bodyStyles: {
        fontSize: 9,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      columnStyles: {
        4: { halign: 'right' },
      },
    });
    
    // Rodapé
    const pageCount = (pdf as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(8);
      pdf.setTextColor(150, 150, 150);
      pdf.text(
        `Gerado em ${new Date().toLocaleString('pt-BR')} - Página ${i} de ${pageCount}`,
        105,
        290,
        { align: 'center' }
      );
    }
    
    pdf.save(`relatorio_financeiro_${month || 'completo'}_${Date.now()}.pdf`);
  };

  return {
    exportToCSV,
    exportToPDF,
  };
};
