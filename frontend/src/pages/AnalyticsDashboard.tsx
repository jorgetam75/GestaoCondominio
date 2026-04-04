/**
 * Analytics & Reports Dashboard
 */

import { useState } from 'react';
import useAuthStore from '../hooks/useAuth';
import { BuildingOccupancyChart } from '../components/charts/BuildingOccupancyChart';
import { FinancialReportChart } from '../components/charts/FinancialReportChart';
import { MaintenanceTrendsChart } from '../components/charts/MaintenanceTrendsChart';
import { exportToCSV, exportToPDF, printElement, formatReportDate } from '../utils/exportUtils';

export function AnalyticsDashboard() {
  const { user, logout } = useAuthStore();
  const [dateRange, setDateRange] = useState({
    startDate: '2026-01-01',
    endDate: '2026-04-04',
  });

  // Mock data for visualizations
  const occupancyData = [
    { name: 'Occupied Units', value: 380 },
    { name: 'Vacant Units', value: 45 },
    { name: 'Under Maintenance', value: 15 },
  ];

  const financialData = [
    { name: 'Sunset Plaza', paid: 125000, outstanding: 45000, overdue: 12000 },
    { name: 'Central Tower', paid: 420000, outstanding: 89000, overdue: 25000 },
    { name: 'Vila Nova', paid: 180000, outstanding: 35000, overdue: 8000 },
  ];

  const maintenanceData = [
    { date: 'Apr 1', pending: 8, assigned: 5, in_progress: 3, completed: 42 },
    { date: 'Apr 2', pending: 6, assigned: 7, in_progress: 4, completed: 45 },
    { date: 'Apr 3', pending: 5, assigned: 6, in_progress: 5, completed: 48 },
    { date: 'Apr 4', pending: 4, assigned: 8, in_progress: 3, completed: 51 },
  ];

  const handleExportCSV = () => {
    const data = [
      { building: 'Sunset Plaza', paid: 1250, outstanding: 450, overdue: 120 },
      { building: 'Central Tower', paid: 4200, outstanding: 890, overdue: 250 },
      { building: 'Vila Nova', paid: 1800, outstanding: 350, overdue: 80 },
    ];
    const success = exportToCSV(data, 'financial-report');
    if (success) alert('✓ Financial report exported to CSV');
  };

  const handleExportPDF = () => {
    const element = document.getElementById('report-content');
    if (element) {
      exportToPDF(element, 'analytics-report');
    }
  };

  const handlePrint = () => {
    printElement('report-content', 'Analytics & Reports');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Analytics & Reports</h1>
            <p className="mt-2 text-gray-600">Welcome, {user?.email}</p>
          </div>
          <button
            onClick={logout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Controls */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                Start Date
              </label>
              <input
                type="date"
                value={dateRange.startDate}
                onChange={(e) => setDateRange({ ...dateRange, startDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2">
                End Date
              </label>
              <input
                type="date"
                value={dateRange.endDate}
                onChange={(e) => setDateRange({ ...dateRange, endDate: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                Apply Filter
              </button>
            </div>

            <div className="flex items-end">
              <button
                onClick={() => setDateRange({ startDate: '2026-01-01', endDate: '2026-04-04' })}
                className="w-full px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Export Buttons */}
        <div className="mb-8 flex flex-wrap gap-4">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium flex items-center gap-2"
          >
            📊 Export to CSV
          </button>
          <button
            onClick={handleExportPDF}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium flex items-center gap-2"
          >
            📄 Export to PDF
          </button>
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium flex items-center gap-2"
          >
            🖨️ Print Report
          </button>
        </div>

        {/* Charts Section */}
        <div id="report-content" className="space-y-8">
          {/* Report Header */}
          <div className="bg-white rounded-lg shadow p-6 print:page-break-before">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Analytics Report</h2>
            <p className="text-gray-600">
              Generated on {formatReportDate(new Date())} • Period: {formatReportDate(dateRange.startDate)} to{' '}
              {formatReportDate(dateRange.endDate)}
            </p>
          </div>

          {/* Charts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 print:grid-cols-1">
            <div className="print:page-break-inside-avoid">
              <BuildingOccupancyChart data={occupancyData} title="Unit Occupancy Distribution" />
            </div>

            <div className="print:page-break-inside-avoid">
              <FinancialReportChart data={financialData} title="Building Financial Summary" />
            </div>

            <div className="lg:col-span-2 print:page-break-inside-avoid">
              <MaintenanceTrendsChart data={maintenanceData} />
            </div>
          </div>

          {/* Summary Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 print:page-break-inside-avoid">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Total Units</h3>
              <p className="text-4xl font-bold text-gray-900">440</p>
              <p className="text-sm text-gray-500 mt-2">Across all buildings</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Revenue (Paid)</h3>
              <p className="text-4xl font-bold text-green-600">R$ 725k</p>
              <p className="text-sm text-gray-500 mt-2">Current period</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Outstanding</h3>
              <p className="text-4xl font-bold text-yellow-600">R$ 169k</p>
              <p className="text-sm text-gray-500 mt-2">To be collected</p>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-gray-600 text-sm font-medium mb-2">Overdue Amount</h3>
              <p className="text-4xl font-bold text-red-600">R$ 45k</p>
              <p className="text-sm text-gray-500 mt-2">Past deadline</p>
            </div>
          </div>

          {/* Details Table */}
          <div className="bg-white rounded-lg shadow overflow-hidden print:page-break-inside-avoid">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-bold text-gray-900">Detailed Financial Breakdown</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Building</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Paid</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Outstanding</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Overdue</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {financialData.map((row, idx) => (
                    <tr key={idx} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{row.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">R$ {(row.paid / 100).toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">R$ {(row.outstanding / 100).toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4 text-sm text-red-600">R$ {(row.overdue / 100).toFixed(2).replace('.', ',')}</td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        R$ {((row.paid + row.outstanding + row.overdue) / 100).toFixed(2).replace('.', ',')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
