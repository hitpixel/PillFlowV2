import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/use-toast';
import { ArrowLeft, Package, Edit, Trash } from 'lucide-react';

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [customer, setCustomer] = useState(null);
  const [websterPacks, setWebsterPacks] = useState([]);
  
  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);
  
  const fetchCustomerDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch customer details
      const { data: customerData, error: customerError } = await supabase
        .from('Customers')
        .select('*')
        .eq('id', id)
        .single();
      
      if (customerError) throw customerError;
      setCustomer(customerData);
      
      // Fetch webster packs for this customer
      const { data: packsData, error: packsError } = await supabase
        .from('WebsterPacks')
        .select(`
          *,
          Pharmacists(id, first_name, last_name)
        `)
        .eq('customer_id', id)
        .order('created_at', { ascending: false });
      
      if (packsError) throw packsError;
      setWebsterPacks(packsData);
      
    } catch (error) {
      toast({
        title: "Error fetching customer details",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!customer) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-medium text-gray-900">Customer not found</h2>
        <p className="mt-2 text-gray-600">The requested customer could not be found.</p>
        <button 
          onClick={() => navigate('/customers')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Customers
        </button>
      </div>
    );
  }
  
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  return (
    <div className="container mx-auto py-6">
      <button 
        onClick={() => navigate('/customers')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Customers
      </button>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">
              {customer.first_name} {customer.last_name}
            </h1>
            <div className="flex space-x-2">
              <Link
                to={`/customers/${id}/edit`}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-sm font-medium rounded text-gray-700 bg-white hover:bg-gray-50"
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Link>
              <button
                className="inline-flex items-center px-3 py-1.5 border border-red-300 text-sm font-medium rounded text-red-700 bg-white hover:bg-red-50"
              >
                <Trash className="h-4 w-4 mr-1" />
                Delete
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Personal Information</h2>
              <div className="bg-gray-50 p-4 rounded border">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Medicare Number</p>
                    <p>{customer.medicare_number || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p>{formatDate(customer.date_of_birth)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{customer.phone || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{customer.email || '-'}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-2">Address</h2>
              <div className="bg-gray-50 p-4 rounded border">
                <p>{customer.address || 'No address provided'}</p>
              </div>
              
              {customer.special_instructions && (
                <div className="mt-4">
                  <h2 className="text-lg font-medium mb-2">Special Instructions</h2>
                  <div className="bg-yellow-50 p-4 rounded border border-yellow-200">
                    <p>{customer.special_instructions}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Webster Packs</h2>
            <Link
              to={`/webster-packs/new?customer=${id}`}
              className="inline-flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              <Package className="h-4 w-4 mr-1" />
              Create New Pack
            </Link>
          </div>
          
          {websterPacks.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded border">
              <Package className="h-12 w-12 mx-auto text-gray-400" />
              <p className="mt-2 text-gray-500">No Webster packs found for this customer</p>
              <Link
                to={`/webster-packs/new?customer=${id}`}
                className="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
              >
                Create First Pack
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date Range
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Pharmacist
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {websterPacks.map((pack) => (
                    <tr key={pack.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatDate(pack.start_date)} - {formatDate(pack.end_date)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${pack.status === 'completed' ? 'bg-green-100 text-green-800' : 
                            pack.status === 'in_progress' ? 'bg-blue-100 text-blue-800' : 
                            'bg-yellow-100 text-yellow-800'}`}
                        >
                          {pack.status === 'in_progress' ? 'In Progress' : 
                           pack.status === 'completed' ? 'Completed' : 'Pending'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {pack.Pharmacists ? `${pack.Pharmacists.first_name} ${pack.Pharmacists.last_name}` : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(pack.created_at)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/webster-packs/${pack.id}`} 
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetail; 