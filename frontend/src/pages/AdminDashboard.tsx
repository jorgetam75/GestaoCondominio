import { useState } from 'react';
import { useBuildings } from '../hooks/useApi';
import useAuthStore from '../hooks/useAuth';

export function AdminDashboard() {
  const { user, logout } = useAuthStore();
  const { data: buildingsData, loading, error } = useBuildings(100);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <p className="text-red-800">Error: {error}</p>
          </div>
        </div>
      </div>
    );
  }

  const buildings = buildingsData?.buildings || [];
  const totalBuildings = buildings.length;
  const totalUnits = buildings.reduce((sum: number, b: any) => sum + (b.unit_count || 0), 0);
  const totalResidents = buildings.reduce((sum: number, b: any) => sum + (b.resident_count || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
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
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Buildings</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalBuildings}</p>
              </div>
              <div className="text-5xl text-blue-200">🏢</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Units</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalUnits}</p>
              </div>
              <div className="text-5xl text-green-200">🏠</div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Total Residents</p>
                <p className="text-4xl font-bold text-gray-900 mt-2">{totalResidents}</p>
              </div>
              <div className="text-5xl text-purple-200">👥</div>
            </div>
          </div>
        </div>

        {/* Buildings List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">All Buildings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Address</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">City</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Units</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Residents</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {buildings.length > 0 ? (
                  buildings.map((building: any) => (
                    <tr key={building.id} className="hover:bg-gray-50 transition">
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{building.name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{building.address}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{building.city}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{building.unit_count}</td>
                      <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{building.resident_count}</td>
                      <td className="px-6 py-4 text-sm">
                        <button
                          onClick={() => setSelectedBuilding(building.id)}
                          className="text-blue-600 hover:text-blue-900 font-medium"
                        >
                          View Details →
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                      No buildings found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Building Details */}
        {selectedBuilding && (
          <div className="mt-12 bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-gray-900">Building Details</h2>
              <button
                onClick={() => setSelectedBuilding(null)}
                className="text-gray-600 hover:text-gray-900"
              >
                ✕ Close
              </button>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-blue-900">Building ID: {selectedBuilding}</p>
              <p className="text-sm text-blue-700 mt-2">
                Click on a building row to view detailed information, financial reports, and management options.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
