/**
 * Maintenance Trends Chart Component
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface MaintenanceTrendData {
  date: string;
  pending: number;
  assigned: number;
  in_progress: number;
  completed: number;
}

interface MaintenanceTrendsChartProps {
  data: MaintenanceTrendData[];
  title?: string;
}

export function MaintenanceTrendsChart({ data, title = 'Maintenance Request Trends' }: MaintenanceTrendsChartProps) {
  return (
    <div className="w-full h-full bg-white rounded-lg p-6 shadow">
      {title && <h3 className="text-lg font-bold text-gray-900 mb-4">{title}</h3>}
      <ResponsiveContainer width="100%" height={350}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="pending" stroke="#f59e0b" name="Pending" strokeWidth={2} />
          <Line type="monotone" dataKey="assigned" stroke="#3b82f6" name="Assigned" strokeWidth={2} />
          <Line type="monotone" dataKey="in_progress" stroke="#8b5cf6" name="In Progress" strokeWidth={2} />
          <Line type="monotone" dataKey="completed" stroke="#10b981" name="Completed" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
