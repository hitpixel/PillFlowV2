import React from 'react';
import { Check, Clock } from 'lucide-react';

const ChecklistTracker = ({ checklist, onComplete, packStatus }) => {
  const isDisabled = packStatus === 'completed';
  
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return null;
    
    const date = new Date(timestamp);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    })}`;
  };
  
  return (
    <div className="space-y-4">
      {checklist.length === 0 ? (
        <p className="text-gray-500 italic">No checklist items found</p>
      ) : (
        checklist.map((item, index) => (
          <div 
            key={item.id}
            className={`p-4 rounded border ${
              item.completed 
                ? 'bg-green-50 border-green-200' 
                : 'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-start">
              <div className="flex-shrink-0">
                {item.completed ? (
                  <div className="h-8 w-8 rounded-full bg-green-500 flex items-center justify-center">
                    <Check className="h-5 w-5 text-white" />
                  </div>
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-medium">
                    {index + 1}
                  </div>
                )}
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center justify-between">
                  <h3 className={`font-medium ${item.completed ? 'text-green-800' : 'text-gray-800'}`}>
                    {item.step_name}
                  </h3>
                  {item.completed ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <button
                      onClick={() => onComplete(item.id)}
                      disabled={isDisabled}
                      className={`inline-flex items-center px-3 py-1 rounded text-sm font-medium ${
                        isDisabled
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                      }`}
                    >
                      Mark Complete
                    </button>
                  )}
                </div>
                
                {item.completed && (
                  <div className="mt-1 text-sm text-green-600 flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    <span>Completed {formatTimestamp(item.completed_at)}</span>
                    {item.Pharmacists && (
                      <span className="ml-1">
                        by {item.Pharmacists.first_name} {item.Pharmacists.last_name}
                      </span>
                    )}
                  </div>
                )}
                
                {item.notes && (
                  <p className="mt-1 text-sm text-gray-600">{item.notes}</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
      
      {packStatus === 'completed' && (
        <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <Check className="h-5 w-5 text-green-400" aria-hidden="true" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">All steps completed</h3>
              <div className="mt-2 text-sm text-green-700">
                <p>This Webster pack has been fully prepared and verified.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChecklistTracker; 