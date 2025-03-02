import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useToast } from '../components/ui/use-toast';
import { Check, ArrowLeft, Clock, AlertTriangle } from 'lucide-react';
import ChecklistTracker from '../components/WebsterPack/ChecklistTracker';
import MedicationList from '../components/WebsterPack/MedicationList';
import BarcodeScanner from '../components/Scanner/BarcodeScanner';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
  completed: 'bg-green-100 text-green-800 border-green-200'
};

const WebsterPackDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [websterPack, setWebsterPack] = useState(null);
  const [medications, setMedications] = useState([]);
  const [checklist, setChecklist] = useState([]);
  const [scannerActive, setScannerActive] = useState(false);
  
  useEffect(() => {
    fetchWebsterPackDetails();
  }, [id]);
  
  const fetchWebsterPackDetails = async () => {
    try {
      setLoading(true);
      
      // Fetch Webster Pack details
      const { data: packData, error: packError } = await supabase
        .from('WebsterPacks')
        .select(`
          *,
          Customers(*),
          Pharmacists(id, first_name, last_name)
        `)
        .eq('id', id)
        .single();
      
      if (packError) throw packError;
      setWebsterPack(packData);
      
      // Fetch medications in this Webster Pack
      const { data: medData, error: medError } = await supabase
        .from('WebsterPackMedications')
        .select(`
          *,
          Medications(*)
        `)
        .eq('webster_pack_id', id);
      
      if (medError) throw medError;
      setMedications(medData);
      
      // Fetch checklist items
      const { data: checklistData, error: checklistError } = await supabase
        .from('ChecklistItems')
        .select(`
          *,
          Pharmacists(id, first_name, last_name)
        `)
        .eq('webster_pack_id', id)
        .order('created_at', { ascending: true });
      
      if (checklistError) throw checklistError;
      setChecklist(checklistData);
      
    } catch (error) {
      toast({
        title: "Error fetching Webster pack details",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleChecklistItemComplete = async (checklistItemId) => {
    try {
      const { error } = await supabase
        .from('ChecklistItems')
        .update({ 
          completed: true,
          completed_at: new Date().toISOString(),
          pharmacist_id: '123e4567-e89b-12d3-a456-426614174000' // Would come from auth context in real app
        })
        .eq('id', checklistItemId);
      
      if (error) throw error;
      
      // Refresh checklist data
      fetchWebsterPackDetails();
      
      toast({
        title: "Step completed",
        description: "Checklist item has been marked as complete",
      });
      
      // Check if all items are completed
      const allCompleted = checklist.every(item => item.completed);
      
      if (allCompleted) {
        // Update Webster Pack status to completed
        await supabase
          .from('WebsterPacks')
          .update({ status: 'completed' })
          .eq('id', id);
          
        setWebsterPack(prev => ({ ...prev, status: 'completed' }));
        
        toast({
          title: "Webster Pack Completed",
          description: "All steps have been completed and verified",
          variant: "success"
        });
      }
      
    } catch (error) {
      toast({
        title: "Error updating checklist",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  const handleBarcodeScanned = async (barcode) => {
    try {
      // Find if this barcode belongs to any medication in this pack
      const matchedMed = medications.find(med => med.Medications.barcode === barcode);
      
      if (matchedMed) {
        toast({
          title: "Medication Verified",
          description: `${matchedMed.Medications.brand_name} ${matchedMed.Medications.strength} has been verified`,
          variant: "success"
        });
        
        // Find the medication verification step in the checklist
        const verifyStep = checklist.find(item => 
          item.step_name === 'Verify Medications' && !item.completed
        );
        
        if (verifyStep) {
          await handleChecklistItemComplete(verifyStep.id);
        }
      } else {
        toast({
          title: "Warning",
          description: `No matching medication found for barcode: ${barcode}`,
          variant: "warning"
        });
      }
    } catch (error) {
      console.error('Error processing barcode:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="h-8 w-8 border-t-2 border-b-2 border-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!websterPack) {
    return (
      <div className="text-center p-6">
        <h2 className="text-xl font-medium text-gray-900">Webster Pack not found</h2>
        <p className="mt-2 text-gray-600">The requested Webster Pack could not be found.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }
  
  const statusClass = statusColors[websterPack.status] || 'bg-gray-100 text-gray-800 border-gray-200';
  
  return (
    <div className="container mx-auto py-6">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-1" />
        Back to Dashboard
      </button>
      
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">Webster Pack Details</h1>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusClass}`}>
              {websterPack.status === 'in_progress' ? 'In Progress' : 
               websterPack.status === 'completed' ? 'Completed' : 'Pending'}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-medium mb-2">Customer Information</h2>
              <div className="bg-gray-50 p-4 rounded border">
                <p className="font-medium text-lg">{websterPack.Customers.first_name} {websterPack.Customers.last_name}</p>
                <p className="text-gray-600">Medicare: {websterPack.Customers.medicare_number}</p>
                <p className="text-gray-600">DOB: {new Date(websterPack.Customers.date_of_birth).toLocaleDateString()}</p>
                <p className="text-gray-600">{websterPack.Customers.address}</p>
                
                {websterPack.Customers.special_instructions && (
                  <div className="mt-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
                    <div className="flex items-start">
                      <AlertTriangle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <p className="font-medium text-yellow-800">Special Instructions</p>
                        <p className="text-yellow-700">{websterPack.Customers.special_instructions}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-medium mb-2">Pack Information</h2>
              <div className="bg-gray-50 p-4 rounded border">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-500">Start Date</p>
                    <p>{new Date(websterPack.start_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">End Date</p>
                    <p>{new Date(websterPack.end_date).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Prepared By</p>
                    <p>{websterPack.Pharmacists?.first_name} {websterPack.Pharmacists?.last_name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Created</p>
                    <p>{new Date(websterPack.created_at).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-b">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Medications ({medications.length})</h2>
            <button 
              onClick={() => setScannerActive(!scannerActive)}
              className="flex items-center px-3 py-1.5 text-sm bg-blue-100 text-blue-800 rounded hover:bg-blue-200"
            >
              {scannerActive ? 'Disable Scanner' : 'Enable Barcode Scanner'}
            </button>
          </div>
          
          {scannerActive && (
            <div className="mb-4">
              <BarcodeScanner onScan={handleBarcodeScanned} />
            </div>
          )}
          
          <MedicationList medications={medications} />
        </div>
        
        <div className="p-6">
          <h2 className="text-lg font-medium mb-4">Preparation Checklist</h2>
          <ChecklistTracker 
            checklist={checklist} 
            onComplete={handleChecklistItemComplete}
            packStatus={websterPack.status}
          />
        </div>
      </div>
    </div>
  );
};

export default WebsterPackDetail; 