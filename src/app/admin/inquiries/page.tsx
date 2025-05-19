'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanelLayout from '@/components/admin/AdminPanelLayout';
import { formatDistanceToNow } from 'date-fns';

interface Inquiry {
  _id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  carId?: {
    _id: string;
    title: string;
    make: string;
    model: string;
    year: number;
  };
  status: 'new' | 'read' | 'responded';
  createdAt: string;
  updatedAt: string;
}

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'new' | 'read' | 'responded' | 'all'>('new');
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const router = useRouter();

  // Fetch inquiries on component mount and when active tab changes
  useEffect(() => {
    const fetchInquiries = async () => {
      setIsLoading(true);
      try {
        let url = '/api/inquiries';
        if (activeTab !== 'all') {
          url += `?status=${activeTab}`;
        }
        
        console.log('Fetching inquiries from:', url);
        
        const response = await fetch(url, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        console.log('Response status:', response.status);
        
        // If we get a 404, handle it gracefully (maybe endpoint not found)
        if (response.status === 404) {
          console.error('Endpoint not found. Please check API route implementation.');
          setInquiries([]);
          setError('API endpoint not found. Please check server implementation.');
          return;
        }
        
        if (!response.ok) {
          const errorText = await response.text();
          console.error('Error response:', errorText);
          throw new Error(`Failed to fetch inquiries: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        console.log('Received data:', data);
        
        if (data.success) {
          setInquiries(data.inquiries || []);
        } else {
          throw new Error(data.error || 'Failed to fetch inquiries');
        }
      } catch (error: any) {
        console.error('Error fetching inquiries:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchInquiries();
  }, [activeTab]);

  // Update inquiry status
  const updateInquiryStatus = async (id: string, status: 'new' | 'read' | 'responded') => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/inquiries/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update inquiry status');
      }
      
      const data = await response.json();
      if (data.success) {
        // Update local state
        setInquiries(prevInquiries => 
          prevInquiries.map(inquiry => 
            inquiry._id === id ? { ...inquiry, status } : inquiry
          )
        );
        
        if (selectedInquiry && selectedInquiry._id === id) {
          setSelectedInquiry({ ...selectedInquiry, status });
        }
      } else {
        throw new Error(data.error || 'Failed to update inquiry status');
      }
    } catch (error: any) {
      console.error('Error updating inquiry status:', error);
      alert('Error updating status: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Get count by status
  const getCountByStatus = (status: 'new' | 'read' | 'responded' | 'all') => {
    if (status === 'all') return inquiries.length;
    return inquiries.filter(inquiry => inquiry.status === status).length;
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return formatDistanceToNow(date, { addSuffix: true });
  };

  return (
    <AdminPanelLayout>
      <div className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Customer Inquiries</h1>
          <p className="text-gray-600">Manage and respond to customer inquiries and contact requests.</p>
        </div>
        
        {/* Tabs */}
        <div className="mb-6 border-b border-gray-200">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('new')}
              className={`py-4 px-1 relative ${
                activeTab === 'new'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              New
              <span className="ml-2 bg-blue-100 text-blue-600 py-0.5 px-2 rounded-full text-xs">
                {getCountByStatus('new')}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('read')}
              className={`py-4 px-1 relative ${
                activeTab === 'read'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Read
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {getCountByStatus('read')}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('responded')}
              className={`py-4 px-1 relative ${
                activeTab === 'responded'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Responded
              <span className="ml-2 bg-green-100 text-green-600 py-0.5 px-2 rounded-full text-xs">
                {getCountByStatus('responded')}
              </span>
            </button>
            
            <button
              onClick={() => setActiveTab('all')}
              className={`py-4 px-1 relative ${
                activeTab === 'all'
                  ? 'text-blue-600 border-b-2 border-blue-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              All
              <span className="ml-2 bg-gray-100 text-gray-600 py-0.5 px-2 rounded-full text-xs">
                {getCountByStatus('all')}
              </span>
            </button>
          </div>
        </div>
        
        {/* Content */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Inquiries List */}
          <div className="w-full md:w-1/2">
            {isLoading ? (
              <div className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-6"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-600">
                <p>Error loading inquiries: {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md"
                >
                  Retry
                </button>
              </div>
            ) : inquiries.length === 0 ? (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="p-4 mb-4 inline-block bg-blue-50 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">No inquiries found</h3>
                <p className="text-gray-500 mt-1">
                  {activeTab === 'all' 
                    ? "You don't have any inquiries yet." 
                    : `No ${activeTab} inquiries found.`}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <div 
                    key={inquiry._id}
                    onClick={() => setSelectedInquiry(inquiry)}
                    className={`bg-white p-4 rounded-lg shadow-sm border-l-4 cursor-pointer hover:shadow-md transition-shadow ${
                      selectedInquiry?._id === inquiry._id 
                        ? 'border-blue-600 bg-blue-50' 
                        : inquiry.status === 'new'
                        ? 'border-blue-500'
                        : inquiry.status === 'read'
                        ? 'border-gray-500'
                        : 'border-green-500'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium text-gray-800">{inquiry.name}</h3>
                        <p className="text-sm text-gray-500">{inquiry.email}</p>
                      </div>
                      <span className="text-xs text-gray-400">{formatDate(inquiry.createdAt)}</span>
                    </div>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-2">{inquiry.message}</p>
                    {inquiry.carId && (
                      <div className="mt-2 text-xs bg-gray-100 inline-block px-2 py-1 rounded text-gray-600">
                        {typeof inquiry.carId === 'object' && inquiry.carId.make ? 
                          `${inquiry.carId.year} ${inquiry.carId.make} ${inquiry.carId.model}` : 
                          `Car ID: ${typeof inquiry.carId === 'object' ? inquiry.carId._id : inquiry.carId}`}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Inquiry Detail */}
          <div className="w-full md:w-1/2">
            {selectedInquiry ? (
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-bold text-gray-800">Inquiry Details</h2>
                  <div className="flex gap-2">
                    <button
                      disabled={isUpdating || selectedInquiry.status === 'read'}
                      onClick={() => updateInquiryStatus(selectedInquiry._id, 'read')}
                      className={`px-3 py-1 text-xs rounded ${
                        selectedInquiry.status === 'read'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                    >
                      Mark as Read
                    </button>
                    <button
                      disabled={isUpdating || selectedInquiry.status === 'responded'}
                      onClick={() => updateInquiryStatus(selectedInquiry._id, 'responded')}
                      className={`px-3 py-1 text-xs rounded ${
                        selectedInquiry.status === 'responded'
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-green-100 text-green-600 hover:bg-green-200'
                      }`}
                    >
                      Mark as Responded
                    </button>
                  </div>
                </div>
                
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="font-medium text-gray-800">{selectedInquiry.name}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-green-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="font-medium text-gray-800">{selectedInquiry.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-yellow-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="font-medium text-gray-800">{selectedInquiry.phone}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="p-3 bg-purple-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Message</p>
                      <p className="font-medium text-gray-800 whitespace-pre-wrap">{selectedInquiry.message}</p>
                    </div>
                  </div>
                  
                  {selectedInquiry?.carId && (
                    <div className="flex items-center gap-4">
                      <div className="p-3 bg-red-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Regarding Car</p>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800">
                            {selectedInquiry && typeof selectedInquiry.carId === 'object' && selectedInquiry.carId.make ? 
                              `${selectedInquiry.carId.year} ${selectedInquiry.carId.make} ${selectedInquiry.carId.model}` : 
                              `Car ID: ${selectedInquiry && typeof selectedInquiry.carId === 'object' ? selectedInquiry.carId._id : selectedInquiry?.carId}`}
                          </p>
                          {selectedInquiry && typeof selectedInquiry.carId === 'object' && selectedInquiry.carId._id && (
                            <button
                              onClick={() => router.push(`/admin/cars/${selectedInquiry.carId._id}`)}
                              className="text-blue-600 hover:text-blue-800 text-xs underline"
                            >
                              View Car
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gray-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500">Date Submitted</p>
                      <p className="font-medium text-gray-800">{new Date(selectedInquiry.createdAt).toLocaleString()}</p>
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex gap-4">
                    <a
                      href={`mailto:${selectedInquiry.email}?subject=RE: Your Inquiry at AutoElite`}
                      className="px-4 py-2 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 flex-1 text-center"
                    >
                      Reply via Email
                    </a>
                    <a
                      href={`tel:${selectedInquiry.phone}`}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded font-medium hover:bg-gray-50 flex-1 text-center"
                    >
                      Call Customer
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center">
                <div className="p-4 mb-4 inline-block bg-gray-100 rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-800">No inquiry selected</h3>
                <p className="text-gray-500 mt-1">
                  Select an inquiry from the list to view details.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminPanelLayout>
  );
} 