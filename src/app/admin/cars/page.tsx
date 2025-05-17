'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminPanelLayout from '@/components/admin/AdminPanelLayout';
import ConfirmationDialog from '@/components/admin/ConfirmationDialog';
import Link from 'next/link';
import Image from 'next/image';

// Define car interface
interface Car {
  _id: string;
  title: string;
  make: string;
  model: string;
  year: number;
  price: number;
  priceCurrency: string;
  offerType: string;
  images: string[];
  image: string;
  createdAt: string;
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function CarManagement() {
  const [isLoading, setIsLoading] = useState(true);
  const [cars, setCars] = useState<Car[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 1
  });
  const [isSearching, setIsSearching] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [carToDelete, setCarToDelete] = useState<Car | null>(null);
  const router = useRouter();
  
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
        
        // Fetch car listings after successful authentication
        fetchCarListings();
      } catch (error) {
        console.error('Auth check failed:', error);
        // Redirect to login
        router.push('/admin/login');
      }
    };
    
    checkAuth();
  }, [router]);
  
  const fetchCarListings = async (search = '', page = 1) => {
    try {
      setIsSearching(true);
      
      // Construct query params
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (page) params.append('page', page.toString());
      
      // Fetch car listings from API
      const response = await fetch(`/api/admin/cars?${params.toString()}`, {
        method: 'GET',
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch car listings');
      }
      
      const data = await response.json();
      
      if (data.success) {
        setCars(data.cars || []);
        setPagination(data.pagination || {
          total: 0,
          page: 1,
          limit: 10,
          pages: 1
        });
      } else {
        throw new Error(data.error || 'Failed to fetch car listings');
      }
    } catch (error) {
      console.error('Error fetching car listings:', error);
    } finally {
      setIsLoading(false);
      setIsSearching(false);
    }
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    // Debounce search
    const timeoutId = setTimeout(() => {
      fetchCarListings(e.target.value, 1);
    }, 500);
    
    return () => clearTimeout(timeoutId);
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > pagination.pages) return;
    fetchCarListings(searchTerm, newPage);
  };
  
  const openDeleteDialog = (car: Car) => {
    setCarToDelete(car);
    setDeleteDialogOpen(true);
  };
  
  const closeDeleteDialog = () => {
    setDeleteDialogOpen(false);
    setCarToDelete(null);
  };
  
  const handleDeleteCar = async () => {
    if (!carToDelete) return;
    
    setIsDeleting(true);
    
    try {
      // Call the delete API endpoint
      const response = await fetch(`/api/admin/cars/${carToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete car listing');
      }
      
      // Show a success message
      if (data.warning) {
        alert(`${data.message} (Note: ${data.warning})`);
      }
      
      // Close the dialog
      setDeleteDialogOpen(false);
      setCarToDelete(null);
      
      // Refresh the car listings
      fetchCarListings(searchTerm, pagination.page);
    } catch (error: any) {
      console.error('Error deleting car:', error);
      alert(`Error: ${error.message || 'Failed to delete car listing'}`);
    } finally {
      setIsDeleting(false);
    }
  };
  
  // Function to format price with currency
  const formatPrice = (price: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 0
    }).format(price);
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
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Car Listings</h1>
          
          <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search cars..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full md:w-64"
                value={searchTerm}
                onChange={handleSearch}
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              {isSearching && (
                <div className="absolute right-3 top-2.5 text-gray-400">
                  <div className="animate-spin h-5 w-5 border-2 border-blue-500 rounded-full border-t-transparent"></div>
                </div>
              )}
            </div>
            
            <Link 
              href="/admin/cars/add" 
              className="flex items-center justify-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add New Car
            </Link>
          </div>
        </div>
        
        {/* Car Listings Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Image</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Title</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Make</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Model</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Year</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Price</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cars.length > 0 ? (
                  cars.map((car) => (
                    <tr key={car._id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="w-16 h-12 bg-gray-100 rounded relative overflow-hidden">
                          {car.image ? (
                            <Image 
                              src={car.image} 
                              alt={car.title}
                              width={64}
                              height={48}
                              className="object-cover"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-500">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{car.title}</td>
                      <td className="py-3 px-4">{car.make}</td>
                      <td className="py-3 px-4">{car.model}</td>
                      <td className="py-3 px-4">{car.year}</td>
                      <td className="py-3 px-4">{formatPrice(car.price, car.priceCurrency)}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          car.offerType === 'Sold' 
                            ? 'bg-red-100 text-red-800' 
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {car.offerType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          <Link 
                            href={`/admin/cars/edit/${car._id}`}
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
                      onClick={() => openDeleteDialog(car)}
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
                    <td colSpan={8} className="py-4 px-4 text-center text-gray-500">
                      {searchTerm ? 'No cars found matching your search.' : 'No car listings available. Add your first car!'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {pagination.pages > 1 && (
            <div className="flex justify-between items-center px-4 py-3 bg-gray-50 border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Showing <span className="font-medium">{cars.length > 0 ? (pagination.page - 1) * pagination.limit + 1 : 0}</span> to <span className="font-medium">{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-medium">{pagination.total}</span> cars
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page === 1}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === 1
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300 text-sm font-medium`}
                >
                  Previous
                </button>
                
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page === pagination.pages}
                  className={`px-3 py-1 rounded-md ${
                    pagination.page === pagination.pages
                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                      : 'bg-white text-gray-700 hover:bg-gray-50'
                  } border border-gray-300 text-sm font-medium`}
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Confirmation Dialog */}
      <ConfirmationDialog
        isOpen={deleteDialogOpen}
        title="Delete Car Listing"
        message={`Are you sure you want to delete ${carToDelete?.title || 'this car listing'}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleDeleteCar}
        onCancel={closeDeleteDialog}
        isLoading={isDeleting}
        type="danger"
      />
    </AdminPanelLayout>
  );
} 