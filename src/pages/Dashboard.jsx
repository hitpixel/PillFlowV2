import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import CustomerSearch from '../components/Customer/CustomerSearch';
import WebsterPackList from '../components/WebsterPack/WebsterPackList';
import StatusSummary from '../components/Dashboard/StatusSummary';
import { useToast } from '../components/ui/use-toast';

const Dashboard = () => {
  const [loading, setLoading] = useState(true);
  const [websterPacks, setWebsterPacks] = useState([]);
  const [statusCounts, setStatusCounts] = useState({
    pending: 0,
    inProgress: 0,
    completed: 0,
    total: 0
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchWebsterPacks();
  }, [selectedCustomer]);

  const fetchWebsterPacks = async () => {
    try {
      setLoading(true);
      
      let query = supabase
        .from('WebsterPacks')
        .select(`
          *,
          Customers(id, first_name, last_name),
          Pharmacists(id, first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      // Filter by selected customer if one is selected
      if (selectedCustomer) {
        query = query.eq('customer_id', selectedCustomer.id);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      setWebsterPacks(data);
      
      // Calculate status counts
      const counts = {
        pending: 0,
        inProgress: 0,
        completed: 0,
        total: data.length
      };
      
      data.forEach(pack => {
        if (pack.status === 'pending') counts.pending++;
        else if (pack.status === 'in_progress') counts.inProgress++;
        else if (pack.status === 'completed') counts.completed++;
      });
      
      setStatusCounts(counts);
    } catch (error) {
      toast({
        title: "Error fetching Webster packs",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };

  const handleClearCustomerFilter = () => {
    setSelectedCustomer(null);
  };

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Webster Pack Management</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <StatusSummary 
          pendingCount={statusCounts.pending}
          inProgressCount={statusCounts.inProgress}
          completedCount={statusCounts.completed}
          totalCount={statusCounts.total}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-medium mb-4">Find Customer</h2>
        <CustomerSearch 
          onSelect={handleCustomerSelect}
          selectedCustomer={selectedCustomer}
          onClear={handleClearCustomerFilter}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">
            {selectedCustomer 
              ? `Webster Packs for ${selectedCustomer.first_name} ${selectedCustomer.last_name}`
              : 'Recent Webster Packs'
            }
          </h2>
          {selectedCustomer && (
            <button
              onClick={handleClearCustomerFilter}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Clear Filter
            </button>
          )}
        </div>
        <WebsterPackList 
          websterPacks={websterPacks}
          loading={loading}
          onRefresh={fetchWebsterPacks}
        />
      </div>
    </div>
  );
};

export default Dashboard; 