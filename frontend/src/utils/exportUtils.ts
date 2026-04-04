/**
 * Export utilities for CSV, PDF, and print functionality
 */

import html2pdf from 'html2pdf.js';
import Papa from 'papaparse';

/**
 * Export data to CSV format
 */
export function exportToCSV(data: any[], filename: string, columns?: string[]) {
  try {
    const csvContent = Papa.unparse(data, {
      columns: columns || Object.keys(data[0] || {}),
    });

    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    return true;
  } catch (error) {
    console.error('Error exporting to CSV:', error);
    return false;
  }
}

/**
 * Export data to PDF format
 */
export function exportToPDF(
  htmlElement: HTMLElement | string,
  filename: string,
  options: any = {}
) {
  try {
    const element = typeof htmlElement === 'string' 
      ? document.getElementById(htmlElement) 
      : htmlElement;

    if (!element) {
      throw new Error('Element not found for PDF export');
    }

    const config = {
      margin: 10,
      filename: `${filename}-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { orientation: 'portrait', unit: 'mm', format: 'a4' },
      ...options,
    };

    return html2pdf().set(config).from(element).save();
  } catch (error) {
    console.error('Error exporting to PDF:', error);
    return false;
  }
}

/**
 * Trigger browser print dialog for specific element
 */
export function printElement(elementId: string, title?: string) {
  try {
    const element = document.getElementById(elementId);
    if (!element) {
      throw new Error('Element not found for printing');
    }

    const printWindow = window.open('', '', 'height=400,width=800');
    if (!printWindow) {
      throw new Error('Print window could not be opened');
    }

    const styles = `
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .chart-container { page-break-inside: avoid; margin: 20px 0; }
      </style>
    `;

    const sanitizedTitle = (title || 'Print Document').replace(/[<>"'&]/g, '');
    printWindow.document.write(`
      <html>
        <head>
          <title>${sanitizedTitle}</title>
          ${styles}
        </head>
        <body>
          ${sanitizedTitle !== 'Print Document' ? `<h1>${sanitizedTitle}</h1>` : ''}
          ${element.innerHTML}
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();
    printWindow.print();

    return true;
  } catch (error) {
    console.error('Error printing element:', error);
    return false;
  }
}

/**
 * Generate report metadata
 */
export function generateReportMetadata(reportName: string, generatedBy?: string) {
  return {
    reportName,
    generatedAt: new Date().toISOString(),
    generatedBy: generatedBy || 'System',
    timestamp: Date.now(),
  };
}

/**
 * Format date for reports
 */
export function formatReportDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format currency for reports
 */
export function formatReportCurrency(value: number, currency: string = 'BRL'): string {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency,
  });
  return formatter.format(value / 100);
}
