import React from 'react';
import { Pill } from 'lucide-react';

const MedicationList = ({ medications }) => {
  if (medications.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">No medications found in this Webster pack</p>
      </div>
    );
  }

  // Group medications by time of day
  const groupedMedications = medications.reduce((acc, med) => {
    const timeOfDay = med.time_of_day || 'Unspecified';
    if (!acc[timeOfDay]) {
      acc[timeOfDay] = [];
    }
    acc[timeOfDay].push(med);
    return acc;
  }, {});

  // Define the order of time of day
  const timeOrder = ['Morning', 'Noon', 'Evening', 'Night', 'Unspecified'];

  // Sort the keys based on the defined order
  const sortedTimes = Object.keys(groupedMedications).sort(
    (a, b) => timeOrder.indexOf(a) - timeOrder.indexOf(b)
  );

  return (
    <div className="space-y-6">
      {sortedTimes.map((timeOfDay) => (
        <div key={timeOfDay}>
          <h3 className="text-md font-medium text-gray-700 mb-2">{timeOfDay}</h3>
          <div className="bg-gray-50 rounded-md border border-gray-200">
            <ul className="divide-y divide-gray-200">
              {groupedMedications[timeOfDay].map((med) => (
                <li key={med.id} className="p-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 pt-1">
                      <Pill className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-gray-900">
                          {med.Medications.brand_name} {med.Medications.strength}
                        </p>
                        <p className="text-sm text-gray-500">
                          {med.dosage}
                        </p>
                      </div>
                      <p className="text-sm text-gray-500">
                        {med.Medications.form}
                      </p>
                      {med.frequency && (
                        <p className="text-xs text-gray-500 mt-1">
                          Frequency: {med.frequency}
                        </p>
                      )}
                      {med.special_instructions && (
                        <p className="text-xs text-gray-500 mt-1 bg-yellow-50 p-1 rounded">
                          Note: {med.special_instructions}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MedicationList; 