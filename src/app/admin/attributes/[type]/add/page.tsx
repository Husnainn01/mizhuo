'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import AdminPanelLayout from '@/components/admin/AdminPanelLayout';
import AttributeForm from '@/components/admin/AttributeForm';

export default function AddAttribute() {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  
  const router = useRouter();
  const params = useParams();
  const attributeType = params.type as string;
  
  // Valid attribute types
  const validTypes = ['transmission', 'fuel', 'body', 'drive', 'feature'];
  
  useEffect(() => {
    // Check if the attribute type is valid
    if (!validTypes.includes(attributeType)) {
      router.push('/admin/attributes');
      return;
    }
    
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
        
        setIsLoading(false);
      } catch (error) {
        console.error('Auth check failed:', error);
        // Redirect to login
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router, attributeType, validTypes]);
  
  const handleSubmit = async (data: any) => {
    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      const response = await fetch('/api/admin/attributes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          type: attributeType
        }),
        credentials: 'include'
      });
      
      const responseData = await response.json();
      
      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to add attribute');
      }
      
      // Show success message
      setSuccessMessage('Attribute added successfully!');
      
      // Redirect back to attributes page after delay
      setTimeout(() => {
        router.push('/admin/attributes?type=' + attributeType);
      }, 1500);
    } catch (error: any) {
      console.error('Error adding attribute:', error);
      setErrorMessage(error.message || 'Failed to add attribute');
      setIsSubmitting(false);
    }
  };
  
  // Get attribute type display name
  const getAttributeTypeDisplayName = () => {
    switch (attributeType) {
      case 'transmission':
        return 'Transmission Type';
      case 'fuel':
        return 'Fuel Type';
      case 'body':
        return 'Body Type';
      case 'drive':
        return 'Drive Type';
      case 'feature':
        return 'Feature';
      default:
        return 'Attribute';
    }
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
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Add New {getAttributeTypeDisplayName()}</h1>
          <Link
            href="/admin/attributes"
            className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Attributes
          </Link>
        </div>
        
        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
            {errorMessage}
          </div>
        )}
        
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md">
            {successMessage}
          </div>
        )}
        
        <div className="bg-white shadow-md rounded-lg p-6">
          <AttributeForm
            onSubmit={handleSubmit}
            attributeType={attributeType}
            isSubmitting={isSubmitting}
          />
        </div>
      </div>
    </AdminPanelLayout>
  );
} 