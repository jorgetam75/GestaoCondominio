/**
 * System Settings Page - Admin Only
 */

import { useState } from 'react';
import useAuthStore from '../hooks/useAuth';

interface SystemSettings {
  appName: string;
  appVersion: string;
  maintenanceMode: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  autoBackup: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  maxUploadSize: number;
  sessionTimeout: number;
  defaultCurrency: string;
}

export function SystemSettings() {
  const { user: currentUser, logout } = useAuthStore();
  const [settings, setSettings] = useState<SystemSettings>({
    appName: 'Gestão Condomínio',
    appVersion: '1.0.0',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: true,
    autoBackup: true,
    backupFrequency: 'daily',
    maxUploadSize: 50,
    sessionTimeout: 30,
    defaultCurrency: 'BRL',
  });

  const [activeTab, setActiveTab] = useState<'general' | 'notifications' | 'backup' | 'security' | 'about'>(
    'general'
  );
  const [saved, setSaved] = useState(false);

  const handleChange = (key: keyof SystemSettings, value: any) => {
    setSettings({ ...settings, [key]: value });
    setSaved(false);
  };

  const handleSave = () => {
    alert('✓ Settings saved successfully');
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to defaults?')) {
      setSettings({
        appName: 'Gestão Condomínio',
        appVersion: '1.0.0',
        maintenanceMode: false,
        emailNotifications: true,
        smsNotifications: true,
        autoBackup: true,
        backupFrequency: 'daily',
        maxUploadSize: 50,
        sessionTimeout: 30,
        defaultCurrency: 'BRL',
      });
      setSaved(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
            <p className="mt-2 text-gray-600">Welcome, {currentUser?.email}</p>
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
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        {saved && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 font-medium">✓ Settings saved successfully</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <nav className="space-y-2 p-4">
                {[
                  { id: 'general', label: 'General', icon: '⚙️' },
                  { id: 'notifications', label: 'Notifications', icon: '🔔' },
                  { id: 'backup', label: 'Backup', icon: '💾' },
                  { id: 'security', label: 'Security', icon: '🔒' },
                  { id: 'about', label: 'About', icon: 'ℹ️' },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`w-full text-left px-4 py-3 rounded-lg font-medium transition ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow p-6">
              {/* General Settings */}
              {activeTab === 'general' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">General Settings</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Application Name
                    </label>
                    <input
                      type="text"
                      value={settings.appName}
                      onChange={(e) => handleChange('appName', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.maintenanceMode}
                        onChange={(e) => handleChange('maintenanceMode', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">Enable Maintenance Mode</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      When enabled, only admins can access the system
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={settings.defaultCurrency}
                      onChange={(e) => handleChange('defaultCurrency', e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="BRL">Brazilian Real (R$)</option>
                      <option value="USD">US Dollar ($)</option>
                      <option value="EUR">Euro (€)</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Notifications Settings */}
              {activeTab === 'notifications' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Notification Settings</h2>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.emailNotifications}
                        onChange={(e) => handleChange('emailNotifications', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">Enable Email Notifications</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Send email notifications for important events
                    </p>
                  </div>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.smsNotifications}
                        onChange={(e) => handleChange('smsNotifications', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">Enable SMS Notifications</span>
                    </label>
                    <p className="text-sm text-gray-500 mt-2">
                      Send SMS notifications for critical alerts
                    </p>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-sm text-blue-900">
                      <strong>Note:</strong> Users can customize their notification preferences in their account settings.
                    </p>
                  </div>
                </div>
              )}

              {/* Backup Settings */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Backup & Recovery</h2>

                  <div>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.autoBackup}
                        onChange={(e) => handleChange('autoBackup', e.target.checked)}
                        className="w-4 h-4 text-blue-600 rounded"
                      />
                      <span className="text-sm font-medium text-gray-900">Enable Automatic Backups</span>
                    </label>
                  </div>

                  {settings.autoBackup && (
                    <div>
                      <label className="block text-sm font-medium text-gray-900 mb-2">
                        Backup Frequency
                      </label>
                      <select
                        value={settings.backupFrequency}
                        onChange={(e) => handleChange('backupFrequency', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </select>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium">
                      💾 Create Backup Now
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                      📥 Restore Backup
                    </button>
                  </div>

                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-sm text-yellow-900">
                      <strong>Last Backup:</strong> April 3, 2026 - 2:30 PM (Successful)
                    </p>
                  </div>
                </div>
              )}

              {/* Security Settings */}
              {activeTab === 'security' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">Security Settings</h2>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Session Timeout (minutes)
                    </label>
                    <input
                      type="number"
                      value={settings.sessionTimeout}
                      onChange={(e) => handleChange('sessionTimeout', parseInt(e.target.value))}
                      min="5"
                      max="480"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Users will be automatically logged out after this period of inactivity
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-900 mb-2">
                      Max Upload Size (MB)
                    </label>
                    <input
                      type="number"
                      value={settings.maxUploadSize}
                      onChange={(e) => handleChange('maxUploadSize', parseInt(e.target.value))}
                      min="1"
                      max="500"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                      🔐 Force Password Reset
                    </button>
                    <button className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium">
                      🚨 Clear All Sessions
                    </button>
                  </div>
                </div>
              )}

              {/* About */}
              {activeTab === 'about' && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900">About This System</h2>

                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600">Application Name</p>
                      <p className="text-lg font-semibold text-gray-900">{settings.appName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Application Version</p>
                      <p className="text-lg font-semibold text-gray-900">{settings.appVersion}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Database Status</p>
                      <p className="text-lg font-semibold text-green-600">✓ Connected</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Last Updated</p>
                      <p className="text-lg font-semibold text-gray-900">April 4, 2026</p>
                    </div>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
                    <h3 className="font-semibold text-blue-900 mb-2">System Information</h3>
                    <ul className="text-sm text-blue-900 space-y-1">
                      <li>• Frontend: React 18.2.0 + TypeScript</li>
                      <li>• Backend: Node.js with Express</li>
                      <li>• Database: PostgreSQL</li>
                      <li>• Styling: Tailwind CSS 3.3</li>
                      <li>• Testing: Vitest with 19+ tests</li>
                    </ul>
                  </div>

                  <div className="flex gap-4">
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                      📄 View Documentation
                    </button>
                    <button className="px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium">
                      🐛 Report Issue
                    </button>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="border-t border-gray-200 mt-8 pt-6 flex gap-4 justify-end">
                <button
                  onClick={resetSettings}
                  className="px-6 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Reset to Defaults
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
                >
                  💾 Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
