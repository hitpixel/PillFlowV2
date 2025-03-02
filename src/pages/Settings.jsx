import React from 'react';
import { Settings as SettingsIcon, User, Bell, Shield, Database } from 'lucide-react';

const Settings = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Settings</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex items-center">
            <SettingsIcon className="h-6 w-6 text-gray-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">Application Settings</h2>
          </div>
          <p className="mt-1 text-sm text-gray-500">
            Manage your application preferences and configurations.
          </p>
        </div>
        
        <div className="divide-y divide-gray-200">
          <div className="p-6 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <User className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">User Profile</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Edit
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Update your personal information and preferences.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Bell className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">Notifications</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Configure
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Set up email and in-app notifications for Webster pack events.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Shield className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">Security</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    Manage
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Change your password and configure security settings.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 hover:bg-gray-50">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Database className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="text-md font-medium text-gray-900">Data Management</h3>
                  <button className="text-sm text-blue-600 hover:text-blue-800">
                    View
                  </button>
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Export data and manage database settings.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-gray-50 border-t">
          <p className="text-sm text-gray-500">
            Webster Pack Tracker v0.1.0 • © 2023 Pharmacy Solutions
          </p>
        </div>
      </div>
    </div>
  );
};

export default Settings; 