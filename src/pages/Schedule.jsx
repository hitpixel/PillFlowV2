import React from 'react';
import { Calendar, Clock } from 'lucide-react';

const Schedule = () => {
  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Schedule</h1>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-center h-64 bg-gray-50 border border-dashed border-gray-300 rounded-lg">
          <div className="text-center">
            <Calendar className="h-12 w-12 mx-auto text-gray-400" />
            <h2 className="mt-2 text-lg font-medium text-gray-900">Schedule Management</h2>
            <p className="mt-1 text-gray-500">
              This feature is coming soon. You'll be able to manage Webster pack schedules here.
            </p>
          </div>
        </div>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Upcoming Webster Packs</h3>
                <p className="mt-2 text-sm text-blue-700">
                  View and manage upcoming Webster packs that need to be prepared.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Calendar View</h3>
                <p className="mt-2 text-sm text-blue-700">
                  See all scheduled Webster packs in a calendar view for better planning.
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">Notifications</h3>
                <p className="mt-2 text-sm text-blue-700">
                  Set up reminders and notifications for upcoming Webster pack preparations.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule; 