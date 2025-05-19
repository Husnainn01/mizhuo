'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import AdminPanelLayout from '@/components/admin/AdminPanelLayout';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';

interface Attribute {
  _id: string;
  name: string;
  value: string;
  description?: string;
  type: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AttributesManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [selectedType, setSelectedType] = useState('transmission');
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [attributeToDelete, setAttributeToDelete] = useState<Attribute | null>(null);
  const router = useRouter();
  
  const attributeTypes = [
    { id: 'transmission', label: 'Transmission Types' },
    { id: 'fuel', label: 'Fuel Types' },
    { id: 'body', label: 'Body Types' },
    { id: 'drive', label: 'Drive Types' },
    { id: 'feature', label: 'Features' }
  ];
  
  useEffect(() => {
    // Check if user is authenticated via session API
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/session/edge', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (!response.ok) {
          throw new Error('Authentication failed');
        }
        
        const data = await response.json();
        
        if (!data.success || !data.user || data.user.role !== 'admin') {
          throw new Error('Admin access required');
        }
        
        // Fetch attributes for the selected type
        fetchAttributes(selectedType);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Redirect to login
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router, selectedType]);
  
  const fetchAttributes = async (type: string) => {
    try {
      setIsLoading(true);
      
      const response = await fetch(`/api/admin/attributes?type=${type}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch attributes');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setAttributes(data.attributes || []);
      } else {
        throw new Error(data.error || 'Failed to fetch attributes');
      }
    } catch (error) {
      console.error(`Error fetching ${type} attributes:`, error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTypeChange = (type: string) => {
    setSelectedType(type);
  };
  
  const openDeleteDialog = (attribute: Attribute) => {
    setAttributeToDelete(attribute);
    setDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setAttributeToDelete(null);
  };
  
  const handleDeleteAttribute = async () => {
    if (!attributeToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Call the delete API endpoint
      const response = await fetch(`/api/admin/attributes/${attributeToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete attribute');
      }
      
      // Close the dialog
      setDeleteDialogOpen(false);
      setAttributeToDelete(null);
      
      // Refresh the attributes
      fetchAttributes(selectedType);
    } catch (error: any) {
      console.error('Error deleting attribute:', error);
      alert(`Error: ${error.message || 'Failed to delete attribute'}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Get attribute type display name
  const getAttributeTypeDisplayName = (type: string) => {
    const found = attributeTypes.find(at => at.id === type);
    return found ? found.label : 'Attributes';
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-700 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <AdminPanelLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Car Attribute Management</h1>
          
          <Link 
            href={`/admin/attributes/${selectedType}/add`}
            className="flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New {selectedType === 'feature' ? 'Feature' : `${selectedType.charAt(0).toUpperCase() + selectedType.slice(1)} Type`}
          </Link>
        </div>
        
        {/* Attribute Type Tabs */}
        <div className="flex flex-wrap mb-6 border-b overflow-x-auto pb-1">
          {attributeTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => handleTypeChange(type.id)}
              className={`py-2 px-4 mr-2 font-medium text-sm ${
                selectedType === type.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>
        
        {/* Attributes Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Value</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Description</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {attributes.length > 0 ? (
                  attributes.map((attribute) => (
                    <tr key={attribute._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{attribute.name}</td>
                      <td className="py-3 px-4 text-sm font-mono">{attribute.value}</td>
                      <td className="py-3 px-4 text-sm text-gray-700">
                        {attribute.description || <span className="text-gray-400 italic">No description</span>}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          attribute.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {attribute.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/attributes/${attribute.type}/edit/${attribute._id}`}
                            className="text-blue-600 hover:text-blue-800"
                            title="Edit"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Link>
                          <button 
                            className="text-red-600 hover:text-red-800 disabled:opacity-50"
                            title="Delete"
                            onClick={() => openDeleteDialog(attribute)}
                            disabled={isDeleting}
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 px-4 text-center text-gray-500">
                      No {getAttributeTypeDisplayName(selectedType).toLowerCase()} available. Add your first one!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete Attribute"
        message={`Are you sure you want to delete "${attributeToDelete?.name}"? This action cannot be undone and may affect car listings using this attribute.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteAttribute}
        onCancel={closeDeleteDialog}
        isLoading={isDeleting}
        type="danger"
      />
    </AdminPanelLayout>
  );
} 