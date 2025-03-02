import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Search } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';

const CustomerSearch = ({ onSelect, selectedCustomer, onClear }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      searchCustomers();
    } else {
      setResults([]);
    }
  }, [debouncedSearchTerm]);

  const searchCustomers = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('Customers')
        .select('id, first_name, last_name, medicare_number')
        .or(`first_name.ilike.%${debouncedSearchTerm}%,last_name.ilike.%${debouncedSearchTerm}%,medicare_number.ilike.%${debouncedSearchTerm}%`)
        .limit(10);
      
      if (error) throw error;
      
      setResults(data);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (e.target.value === '') {
      setShowResults(false);
    }
  };

  const handleSelectCustomer = (customer) => {
    onSelect(customer);
    setSearchTerm('');
    setShowResults(false);
  };

  return (
    <div className="relative">
      {selectedCustomer ? (
        <div className="flex items-center justify-between p-4 bg-blue-50 border border-blue-200 rounded-md">
          <div>
            <p className="font-medium text-blue-800">
              {selectedCustomer.first_name} {selectedCustomer.last_name}
            </p>
            <p className="text-sm text-blue-600">Medicare: {selectedCustomer.medicare_number}</p>
          </div>
          <button
            onClick={onClear}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Change
          </button>
        </div>
      ) : (
        <>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              placeholder="Search by name or Medicare number..."
              value={searchTerm}
              onChange={handleInputChange}
              onFocus={() => {
                if (results.length > 0) setShowResults(true);
              }}
              onBlur={() => {
                // Delay hiding the results to allow for clicks
                setTimeout(() => setShowResults(false), 200);
              }}
            />
            {loading && (
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="h-4 w-4 border-t-2 border-blue-500 border-r-2 rounded-full animate-spin"></div>
              </div>
            )}
          </div>
          
          {showResults && results.length > 0 && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200 max-h-60 overflow-y-auto">
              <ul className="py-1">
                {results.map((customer) => (
                  <li 
                    key={customer.id}
                    onClick={() => handleSelectCustomer(customer)}
                    className="px-4 py-2 hover:bg-blue-50 cursor-pointer"
                  >
                    <div className="font-medium">
                      {customer.first_name} {customer.last_name}
                    </div>
                    <div className="text-sm text-gray-500">
                      Medicare: {customer.medicare_number}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {searchTerm && showResults && results.length === 0 && !loading && (
            <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-gray-200">
              <div className="px-4 py-3 text-sm text-gray-500">
                No customers found. <a href="/customers/new" className="text-blue-500 hover:text-blue-700">Add new customer?</a>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default CustomerSearch; 