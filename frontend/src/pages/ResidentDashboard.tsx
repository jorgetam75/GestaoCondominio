import { useState } from 'react';
import useAuthStore from '../hooks/useAuth';

export function ResidentDashboard() {
  const { user, logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('overview');
  const [maintenanceForm, setMaintenanceForm] = useState({
    description: '',
    priority: 'medium',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleMaintenanceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      // In a real app, this would call the API
      // await api.post('/maintenance', { ...maintenanceForm, unit_id: userUnitId });
      alert('Maintenance request submitted! (Demo mode)');
      setMaintenanceForm({ description: '', priority: 'medium' });
    } catch (error) {
      alert('Failed to submit maintenance request');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resident Dashboard</h1>
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

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: 'overview', label: 'Overview', icon: '📋' },
              { id: 'maintenance', label: 'Maintenance', icon: '🔧' },
              { id: 'announcements', label: 'Announcements', icon: '📢' },
              { id: 'invoices', label: 'Invoices', icon: '💳' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Unit Information</h2>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-600 text-sm">Unit Number</p>
                    <p className="text-2xl font-bold text-gray-900">203</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Floor</p>
                    <p className="text-xl text-gray-900">2</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Type</p>
                    <p className="text-xl text-gray-900">Apartment</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Building</p>
                    <p className="text-xl text-gray-900">Condomínio Central</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Current Status</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Account Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-900 rounded-full text-sm font-medium">
                      ✓ Active
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Pending Maintenance</span>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded-full text-sm font-medium">
                      1 Request
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Outstanding Balance</span>
                    <span className="text-lg font-bold text-red-600">R$ 250,00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Maintenance Tab */}
        {activeTab === 'maintenance' && (
          <div className="space-y-6">
            {/* Submit Form */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Submit Maintenance Request</h2>
              <form onSubmit={handleMaintenanceSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Description
                  </label>
                  <textarea
                    value={maintenanceForm.description}
                    onChange={(e) =>
                      setMaintenanceForm({ ...maintenanceForm, description: e.target.value })
                    }
                    placeholder="Describe the maintenance issue..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                    rows={4}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-900 mb-2">
                    Priority
                  </label>
                  <select
                    value={maintenanceForm.priority}
                    onChange={(e) =>
                      setMaintenanceForm({ ...maintenanceForm, priority: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition font-medium"
                >
                  {submitting ? 'Submitting...' : 'Submit Request'}
                </button>
              </form>
            </div>

            {/* Requests List */}
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Your Maintenance Requests</h2>
              <div className="space-y-4">
                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">Leaking faucet in bathroom</p>
                      <p className="text-sm text-gray-600 mt-1">Submitted 2 days ago</p>
                    </div>
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-900 rounded-full text-xs font-medium">
                      Pending
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">Priority: High</p>
                </div>

                <div className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-gray-900">Door lock repair</p>
                      <p className="text-sm text-gray-600 mt-1">Submitted 5 days ago</p>
                    </div>
                    <span className="px-3 py-1 bg-blue-100 text-blue-900 rounded-full text-xs font-medium">
                      In Progress
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-3">Priority: Medium</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Tab */}
        {activeTab === 'announcements' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-6">Building Announcements</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-600 pl-4 py-3">
                <p className="font-semibold text-gray-900">🔧 Elevator Maintenance</p>
                <p className="text-sm text-gray-600 mt-1">
                  Scheduled maintenance will occur on April 10th. The elevator will be unavailable from 8 AM to 5 PM.
                </p>
                <p className="text-xs text-gray-500 mt-2">Posted 1 week ago</p>
              </div>

              <div className="border-l-4 border-green-600 pl-4 py-3">
                <p className="font-semibold text-gray-900">✓ Water Bill Results</p>
                <p className="text-sm text-gray-600 mt-1">
                  April water consumption reports are available. Check your account for more details.
                </p>
                <p className="text-xs text-gray-500 mt-2">Posted 3 days ago</p>
              </div>

              <div className="border-l-4 border-yellow-600 pl-4 py-3">
                <p className="font-semibold text-gray-900">📢 Condominium Meeting</p>
                <p className="text-sm text-gray-600 mt-1">
                  Monthly condominium meeting scheduled for April 15th at 6 PM in the common area.
                </p>
                <p className="text-xs text-gray-500 mt-2">Posted 2 days ago</p>
              </div>
            </div>
          </div>
        )}

        {/* Invoices Tab */}
        {activeTab === 'invoices' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Your Invoices</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Description</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Amount</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Due Date</th>
                    <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">April 2026</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Condominium Fee</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">R$ 450,00</td>
                    <td className="px-6 py-4 text-sm text-gray-600">April 10</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-red-100 text-red-900 rounded text-xs font-medium">
                        Overdue
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">March 2026</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Condominium Fee</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">R$ 450,00</td>
                    <td className="px-6 py-4 text-sm text-gray-600">March 10</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-900 rounded text-xs font-medium">
                        Paid
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm text-gray-900">February 2026</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Condominium Fee</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">R$ 450,00</td>
                    <td className="px-6 py-4 text-sm text-gray-600">Feb 10</td>
                    <td className="px-6 py-4 text-sm">
                      <span className="px-2 py-1 bg-green-100 text-green-900 rounded text-xs font-medium">
                        Paid
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
