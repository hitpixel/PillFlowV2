import React from 'react';
import { Clock, CheckCircle, AlertCircle } from 'lucide-react';

const StatusCard = ({ title, count, icon: Icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow p-4 border-l-4 ${color}`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${color.replace('border-', 'bg-').replace('-600', '-100')}`}>
          <Icon className={color.replace('border-', 'text-')} />
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-semibold">{count}</p>
        </div>
      </div>
    </div>
  );
};

const StatusSummary = ({ pendingCount, inProgressCount, completedCount, totalCount }) => {
  return (
    <>
      <StatusCard 
        title="Pending" 
        count={pendingCount} 
        icon={AlertCircle} 
        color="border-yellow-600" 
      />
      <StatusCard 
        title="In Progress" 
        count={inProgressCount} 
        icon={Clock} 
        color="border-blue-600" 
      />
      <StatusCard 
        title="Completed" 
        count={completedCount} 
        icon={CheckCircle} 
        color="border-green-600" 
      />
      <StatusCard 
        title="Total" 
        count={totalCount} 
        icon={CheckCircle} 
        color="border-gray-600" 
      />
    </>
  );
};

export default StatusSummary; 