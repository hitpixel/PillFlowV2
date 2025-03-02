import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/use-toast';
import WebsterPackList from '../components/WebsterPack/WebsterPackList';
import { Plus } from 'lucide-react';

const WebsterPacks = () => {
  const [loading, setLoading] = useState(true);
  const [websterPacks, setWebsterPacks] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    fetchWebsterPacks();
  }, []);

  const fetchWebsterPacks = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('WebsterPacks')
        .select(`
          *,
          Customers(id, first_name, last_name),
          Pharmacists(id, first_name, last_name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      setWebsterPacks(data);
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

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Webster Packs</h1>
        <Link
          to="/webster-packs/new"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-5 w-5 mr-1" />
          New Webster Pack
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <WebsterPackList 
          websterPacks={websterPacks}
          loading={loading}
          onRefresh={fetchWebsterPacks}
        />
      </div>
    </div>
  );
};

export default WebsterPacks; 