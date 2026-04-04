/**
 * Financial Report Chart Component
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FinancialChartData {
  name: string;
  paid: number;
  outstanding: number;
  overdue: number;
}

interface FinancialReportChartProps {
  data: FinancialChartData[];
  title?: string;
}

const formatCurrency = (value: number) => {
  return `R$ ${(value / 100).toFixed(2)}`;
};

export function FinancialReportChart({ data, title = 'Financial Report' }: FinancialReportChartProps) {
  return (
    <div className="w-full h-full bg-white rounded-lg p-6 shadow">
      {title && <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={350}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
          <Tooltip formatter={(value) => formatCurrency(value as number)} />
          <Legend />
          <Bar dataKey="paid" fill="#10b981" name="Paid" />
          <Bar dataKey="outstanding" fill="#f59e0b" name="Outstanding" />
          <Bar dataKey="overdue" fill="#ef4444" name="Overdue" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
