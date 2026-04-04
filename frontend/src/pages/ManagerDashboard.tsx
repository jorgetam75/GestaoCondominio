import { useState } from 'react';
import useAuthStore from '../hooks/useAuth';
import { useBuildings, useBuildingStats, useMaintenanceStats, useFinancialReport, useResidents } from '../hooks/useApi';

export function ManagerDashboard() {
  const { user, logout } = useAuthStore();
  const { data: buildingsData, loading } = useBuildings(50);
  const [selectedBuildingId, setSelectedBuildingId] = useState<string | null>(null);

  const selectedBuilding = buildingsData?.buildings.find((b: any) => b.id === selectedBuildingId);
  const buildingStats = useBuildingStats(selectedBuildingId || '');
  const maintenanceStats = useMaintenanceStats(selectedBuildingId || '');
  const financialReport = useFinancialReport(selectedBuildingId || '');
  const residents = useResidents(selectedBuildingId || '');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading manager dashboard...</p>
        </div>
      </div>
    );
  }

  const buildings = buildingsData?.buildings || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manager Dashboard</h1>
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
        {/* Buildings Selection */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Your Buildings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildings.length > 0 ? (
              buildings.map((building: any) => (
                <button
                  key={building.id}
                  onClick={() => setSelectedBuildingId(building.id)}
                  className={`p-4 rounded-lg border-2 transition text-left ${
                    selectedBuildingId === building.id
                      ? 'border-blue-600 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-blue-400'
                  }`}
                >
                  <h3 className="font-bold text-gray-900">{building.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{building.address}</p>
                  <div className="flex gap-4 mt-3 text-sm">
                    <span className="text-gray-600">
                      <strong>{building.unit_count}</strong> units
                    </span>
                    <span className="text-gray-600">
                      <strong>{building.resident_count}</strong> residents
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <p className="text-gray-600">No buildings assigned</p>
            )}
          </div>
        </div>

        {/* Building Details */}
        {selectedBuildingId && (
          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {selectedBuilding?.name}
              </h2>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm font-medium">Units</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {buildingStats.data?.unit_count || 0}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm font-medium">Residents</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">
                    {buildingStats.data?.resident_count || 0}
                  </p>
                </div>

                <div className="bg-white rounded-lg shadow p-6">
                  <p className="text-gray-600 text-sm font-medium">Outstanding Invoices</p>
                  <p className="text-3xl font-bold text-red-600 mt-2">
                    {financialReport.data?.outstanding 
                      ? `R$ ${(financialReport.data.outstanding / 100).toFixed(2)}`
                      : 'R$ 0.00'
                    }
                  </p>
                </div>
              </div>

              {/* Maintenance Status */}
              {maintenanceStats.data && (
                <div className="bg-white rounded-lg shadow p-6 mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Maintenance Overview</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-yellow-50 rounded p-4 border border-yellow-200">
                      <p className="text-yellow-900 text-sm font-medium">Pending</p>
                      <p className="text-2xl font-bold text-yellow-600 mt-2">
                        {maintenanceStats.data.pending || 0}
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded p-4 border border-blue-200">
                      <p className="text-blue-900 text-sm font-medium">Assigned</p>
                      <p className="text-2xl font-bold text-blue-600 mt-2">
                        {maintenanceStats.data.assigned || 0}
                      </p>
                    </div>
                    <div className="bg-purple-50 rounded p-4 border border-purple-200">
                      <p className="text-purple-900 text-sm font-medium">In Progress</p>
                      <p className="text-2xl font-bold text-purple-600 mt-2">
                        {maintenanceStats.data.in_progress || 0}
                      </p>
                    </div>
                    <div className="bg-green-50 rounded p-4 border border-green-200">
                      <p className="text-green-900 text-sm font-medium">Completed</p>
                      <p className="text-2xl font-bold text-green-600 mt-2">
                        {maintenanceStats.data.completed || 0}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Residents */}
              {residents.data && (
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Residents</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Email</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Unit</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Floor</th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">Type</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {residents.data.residents.slice(0, 10).map((resident: any) => (
                          <tr key={resident.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3 text-sm font-medium text-gray-900">{resident.name}</td>
                            <td className="px-4 py-3 text-sm text-gray-600">{resident.email}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{resident.unit_number}</td>
                            <td className="px-4 py-3 text-sm text-gray-900">{resident.floor}</td>
                            <td className="px-4 py-3 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                resident.is_owner 
                                  ? 'bg-purple-100 text-purple-900' 
                                  : 'bg-gray-100 text-gray-900'
                              }`}>
                                {resident.is_owner ? 'Owner' : 'Tenant'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {residents.data.residents.length > 10 && (
                      <p className="text-sm text-gray-600 mt-4">
                        Showing 10 of {residents.data.residents.length} residents
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
